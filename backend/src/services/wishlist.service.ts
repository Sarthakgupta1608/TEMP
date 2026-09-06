import { prisma } from '../lib/prisma';

export class WishlistService {
  static async getUserWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        package: {
          include: { agency: true, destination: true },
        },
      },
    });
  }

  static async addToWishlist(userId: string, packageId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_packageId: { userId, packageId } },
    });
    if (existing) return existing;

    return prisma.wishlist.create({
      data: { userId, packageId },
      include: { package: true },
    });
  }

  static async removeFromWishlist(userId: string, packageId: string) {
    return prisma.wishlist.deleteMany({
      where: { userId, packageId },
    });
  }
}
