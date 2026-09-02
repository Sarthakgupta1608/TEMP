import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';

export class AuthService {
  static async register(data: { email: string; password: string; fullName: string; role?: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw { statusCode: 409, message: 'Email address is already registered', errorCode: 'EMAIL_EXISTS' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || 'TRAVELLER';

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
      },
      include: {
        profile: true,
        agency: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role, user.agency?.id);
    return { user, tokens };
  }

  static async login(data: { email: string; password: string }) {
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
      throw { statusCode: 444, message: 'User not found', errorCode: 'USER_NOT_FOUND' };
    }
    return user;
  }
}
