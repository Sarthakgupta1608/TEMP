import { prisma } from '../lib/prisma';
import { AIService } from './ai.service';

export class TripRequestService {
  static async createTripRequest(travellerId: string, data: any) {
    // 1. Extract AI intent
    const structuredSpec = await AIService.extractTripIntent(
      data.specialRequests || `Trip to ${data.destination} for ${data.adults || 2} travellers`
    );

    // 2. Resolve destination ID
    let destination = await prisma.destination.findFirst({
      where: { name: { contains: data.destination || 'Sikkim' } },
    });
    if (!destination) {
      destination = await prisma.destination.findFirst();
    }

    const requestCode = `TR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const tripRequest = await prisma.tripRequest.create({
      data: {
        requestCode,
        travellerId,
        destinationId: destination!.id,
        status: 'QUOTES_RECEIVED',
        startDate: data.dates || '2026-10-15',
        endDate: '2026-10-20',
        durationDays: data.durationDays || 5,
        adultCount: data.adults || 2,
        childCount: data.children || 0,
        budgetMin: 10000,
        budgetMax: data.budgetPerHead || 18000,
        hotelPreference: data.hotelPref || '4-Star Mountain View Resort',
        transportPreference: data.transportPref || 'Private Innova Crysta SUV',
        specialRequests: data.specialNote || data.specialRequests,
        aiStructuredSpec: JSON.stringify(structuredSpec),
      },
      include: {
        destination: true,
        quotes: {
          include: {
            agency: true,
          },
        },
      },
    });

    return tripRequest;
  }

  static async getQuotesForRequest(tripRequestId: string) {
    const quotes = await prisma.agencyQuote.findMany({
      where: { tripRequestId },
      include: { agency: true },
    });
    return AIService.compareQuotes(quotes);
  }

  static async submitAgencyQuote(agencyId: string, data: any) {
    const quote = await prisma.agencyQuote.create({
      data: {
        tripRequestId: data.requestId || data.tripRequestId,
        agencyId,
        status: 'SUBMITTED',
        totalPrice: Number(data.totalPrice || 42000),
        pricePerPerson: Number(data.totalPrice ? data.totalPrice / 3 : 14000),
        hotelCategory: data.hotelCategory || '4-Star Mountain View Resort',
        hotelNames: data.hotelNames || 'Elgin Nor-Khill Gangtok & Lachung Retreat',
        vehicleType: data.vehicleType || 'Private Toyota Innova Crysta (Dedicated Driver)',
        includedMeals: JSON.stringify(['Daily Buffet Breakfast', 'Traditional Sikkimese Welcome Dinner']),
        includedActivities: JSON.stringify(
          Array.isArray(data.inclusions) ? data.inclusions : [data.inclusions || 'Nathula Pass Permit', 'Tsomgo Lake']
        ),
        excludedItems: JSON.stringify(['Personal shopping & tips', 'Zero Point extra vehicle charge']),
        cancellationPolicy: '100% Refund if cancelled 7 days prior to travel date',
        aiMatchScore: 96,
        aiRecommendationReason: 'Best overall value match submitted by verified local agency.',
      },
      include: { agency: true },
    });

    return quote;
  }
}
