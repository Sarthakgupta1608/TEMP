import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    role?: string;
    phone?: string;
    companyName?: string;
    operatingRegion?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw { statusCode: 409, message: 'Email address is already registered', errorCode: 'EMAIL_EXISTS' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = (data.role || 'TRAVELLER').toUpperCase();

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone || null,
        passwordHash,
        role,
        status: 'ACTIVE',
        profile: {
          create: {
            fullName: data.fullName,
          },
        },
        ...(role === 'AGENCY' && {
          agency: {
            create: {
              companyName: data.companyName || `${data.fullName}'s Agency`,
              slug: (data.companyName || data.fullName).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
              operatingRegion: data.operatingRegion || 'Sikkim & Gangtok',
              kycStatus: 'PENDING',
              wallet: {
                create: {
                  balance: 0,
                  escrowHold: 0,
                  totalEarned: 0,
                },
              },
            },
          },
        }),
      },
      include: {
        profile: true,
        agency: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role, user.agency?.id);
    return { user, tokens };
  }

  static async login(data: { email: string; password: string; role?: string; portal?: string; portalRole?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true, agency: true },
    });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' };
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' };
    }

    // Role / portal hint check: reject if credentials role does not match portal requested
    const requestedRole = (data.portalRole || data.portal || data.role)?.toUpperCase();
    if (requestedRole && user.role.toUpperCase() !== requestedRole) {
      throw {
        statusCode: 403,
        message: `Account is registered as ${user.role}, not ${requestedRole}. Please log in via the ${user.role.toLowerCase()} portal.`,
        errorCode: 'ROLE_MISMATCH',
      };
    }

    const tokens = this.generateTokens(user.id, user.email, user.role, user.agency?.id);
    return { user, tokens };
  }

  static async refreshToken(refreshToken: string, expectedRole?: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      throw { statusCode: 401, message: 'Invalid or expired refresh token', errorCode: 'INVALID_REFRESH_TOKEN' };
    }

    if (!decoded || !decoded.id) {
      throw { statusCode: 401, message: 'Invalid refresh token payload', errorCode: 'INVALID_REFRESH_TOKEN' };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { profile: true, agency: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw { statusCode: 401, message: 'User inactive or not found', errorCode: 'USER_INACTIVE' };
    }

    if (expectedRole && user.role.toUpperCase() !== expectedRole.toUpperCase()) {
      throw { statusCode: 403, message: `Session role mismatch: expected ${expectedRole}`, errorCode: 'ROLE_MISMATCH' };
    }

    const tokens = this.generateTokens(user.id, user.email, user.role, user.agency?.id);
    return { user, tokens };
  }

  static generateTokens(id: string, email: string, role: string, agencyId?: string) {
    const payload = { id, email, role, agencyId };
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, agency: true },
    });
    if (!user) {
      throw { statusCode: 404, message: 'User not found', errorCode: 'USER_NOT_FOUND' };
    }
    return user;
  }
}
