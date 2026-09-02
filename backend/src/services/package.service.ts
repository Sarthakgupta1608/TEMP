import { prisma } from '../lib/prisma';

export class PackageService {
  static async getAllPackages(filters: { destination?: string; maxPrice?: number; page?: number; limit?: number }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (filters.destination && filters.destination !== 'All') {
      where.destination = {
        name: { contains: filters.destination },
      };
    }
    if (filters.maxPrice) {
      where.pricePerPerson = { lte: Number(filters.maxPrice) };
    }

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        include: {
          agency: {
            select: {
              id: true,
              companyName: true,
              logoUrl: true,
              ratingAverage: true,
              reviewCount: true,
            },
          },
          destination: {
            select: {
              id: true,
              name: true,
              state: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.package.count({ where }),
    ]);

    return { packages, total, page, limit };
  }

  static async getPackageById(id: string) {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        agency: true,
        destination: true,
        images: true,
        itineraries: true,
      },
    });

    if (!pkg) {
      throw { statusCode: 404, message: 'Package not found', errorCode: 'PACKAGE_NOT_FOUND' };
    }

    return pkg;
  }

  static async getAllDestinations() {
    return prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' },
    });
  }
}
