import { prisma } from '../lib/prisma';

export class ReviewService {
  static async createReview(travellerId: string, data: { bookingId: string; rating: number; comment: string }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (!booking) throw { statusCode: 404, message: 'Booking not found', errorCode: 'BOOKING_NOT_FOUND' };

    const review = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        travellerId,
        agencyId: booking.agencyId,
        rating: Math.min(5, Math.max(1, data.rating)),
        comment: data.comment,
      },
    });

    // Update Agency Average Rating
    const reviews = await prisma.review.findMany({ where: { agencyId: booking.agencyId } });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await prisma.agency.update({
      where: { id: booking.agencyId },
      data: {
        ratingAverage: Number(avg.toFixed(2)),
        reviewCount: reviews.length,
      },
    });

    return review;
  }

  static async getAgencyReviews(agencyId: string) {
    return prisma.review.findMany({
      where: { agencyId },
      include: {
        traveller: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
