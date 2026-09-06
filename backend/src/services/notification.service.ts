import { prisma } from '../lib/prisma';

export class NotificationService {
  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  static async sendNotification(userId: string, title: string, message: string) {
    return prisma.notification.create({
      data: { userId, title, message },
    });
  }
}
