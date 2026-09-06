import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export class UserService {
  static async updateProfile(userId: string, data: { fullName?: string; bio?: string; emergencyContact?: string; avatarUrl?: string }) {
    return prisma.profile.update({
      where: { userId },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.bio && { bio: data.bio }),
        ...(data.emergencyContact && { emergencyContact: data.emergencyContact }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
      },
    });
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw { statusCode: 404, message: 'User not found', errorCode: 'USER_NOT_FOUND' };

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) throw { statusCode: 400, message: 'Current password incorrect', errorCode: 'INVALID_PASSWORD' };

    const passwordHash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }
}
