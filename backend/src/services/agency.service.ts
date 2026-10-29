import { prisma } from '../lib/prisma';

export class AgencyService {
  static async resolveAgency(userId: string, tokenAgencyId?: string) {
    if (tokenAgencyId) {
      const agency = await prisma.agency.findUnique({ where: { id: tokenAgencyId } });
      if (agency) return agency;
    }
    const agency = await prisma.agency.findUnique({ where: { ownerId: userId } });
    if (!agency) {
      throw { statusCode: 404, message: 'Agency profile not found for this user', errorCode: 'AGENCY_NOT_FOUND' };
    }
    return agency;
  }

  static async getLeadsForAgency(agencyId: string) {
    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    const region = agency?.operatingRegion || 'Sikkim & Gangtok';

    return prisma.tripRequest.findMany({
      where: {
        destination: {
          name: { contains: region.split('&')[0].trim() },
        },
        status: { in: ['PUBLISHED', 'QUOTES_RECEIVED', 'MATCHING'] },
      },
      include: {
        destination: true,
        traveller: {
          include: { profile: true },
        },
        quotes: {
          where: { agencyId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAgencyWallet(agencyId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { agencyId },
      include: { transactions: { orderBy: { createdAt: 'desc' } } },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          agencyId,
          balance: 166000.0,
          escrowHold: 42000.0,
          totalEarned: 208000.0,
        },
        include: { transactions: true },
      });
    }

    return wallet;
  }

  static async requestPayout(agencyId: string, amount: number) {
    const wallet = await this.getAgencyWallet(agencyId);
    if (wallet.balance < amount) {
      throw { statusCode: 400, message: 'Insufficient balance for bank payout', errorCode: 'INSUFFICIENT_FUNDS' };
    }

    const updated = await prisma.wallet.update({
      where: { agencyId },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            type: 'PAYOUT_RELEASE',
            amount,
            reference: `BANK-PAYOUT-${Math.floor(100000 + Math.random() * 900000)}`,
          },
        },
      },
      include: { transactions: true },
    });

    return updated;
  }

  static async uploadKycDocument(agencyId: string, data: { documentType: string; fileUrl: string }) {
    const doc = await prisma.agencyDocument.create({
      data: {
        agencyId,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
        isVerified: true,
      },
    });

    await prisma.agency.update({
      where: { id: agencyId },
      data: { kycStatus: 'VERIFIED' },
    });

    return doc;
  }

  static async createPackage(agencyId: string, data: any) {
    let destination = await prisma.destination.findFirst({
      where: { name: { contains: data.destination || 'Sikkim' } },
    });
    if (!destination) destination = await prisma.destination.findFirst();

    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    return prisma.package.create({
      data: {
        agencyId,
        destinationId: destination!.id,
        title: data.title,
        slug,
        durationDays: Number(data.durationDays || 5),
        durationNights: Number(data.durationNights || 4),
        pricePerPerson: Number(data.pricePerPerson || 16500),
        originalPrice: Number(data.originalPrice || 19999),
        coverImage: data.coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        highlights: JSON.stringify(data.highlights || ['Hotel Stay', 'Private SUV', 'Permit Included']),
        includedAccommodations: data.includedAccommodations || '4-Star Mountain View Resort',
        includedMeals: data.includedMeals || 'Daily Breakfast & Dinner',
        transportType: data.transportType || 'Private Innova Crysta SUV',
        isFeatured: true,
      },
    });
  }
}
