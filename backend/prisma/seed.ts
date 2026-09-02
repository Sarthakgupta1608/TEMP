import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Traveller Database Seeding...');

  // Hash password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@traveller.app' },
    update: {},
    create: {
      email: 'admin@traveller.app',
      phone: '+919999900000',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          fullName: 'Super Admin',
          bio: 'Platform System Operations',
        },
      },
    },
  });

  // 2. Seed Traveller User (Rohan Verma)
  const travellerUser = await prisma.user.upsert({
    where: { email: 'rohan@example.com' },
    update: {},
    create: {
      email: 'rohan@example.com',
      phone: '+919876543210',
      passwordHash,
      role: 'TRAVELLER',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          fullName: 'Rohan Verma',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          bio: 'Avid Himalayan Traveller',
        },
      },
    },
  });

  // 3. Seed Agency Owner 1 (Vikram Dorjee - Himalayan Footprints)
  const agencyOwner1 = await prisma.user.upsert({
    where: { email: 'vikram@himalayan.com' },
    update: {},
    create: {
      email: 'vikram@himalayan.com',
      phone: '+919832011223',
      passwordHash,
      role: 'AGENCY',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          fullName: 'Vikram Dorjee',
          bio: 'Native Sikkimese Operator',
        },
      },
      agency: {
        create: {
          companyName: 'Himalayan Footprints Tours',
          slug: 'himalayan-footprints',
          logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          description: 'Verified native destination agency in Gangtok specializing in Nathula Pass & Yumthang Valley expeditions.',
          taxIdNumber: '11AAAAA0000A1Z5',
          kycStatus: 'VERIFIED',
          ratingAverage: 4.9,
          reviewCount: 142,
          commissionRate: 10.0,
          operatingRegion: 'Sikkim & Gangtok',
          wallet: {
            create: {
              balance: 166000.0,
              escrowHold: 42000.0,
              totalEarned: 208000.0,
            },
          },
        },
      },
    },
    include: { agency: true },
  });

  // 4. Seed Agency Owner 2 (Pine Peak Travels Shimla)
  const agencyOwner2 = await prisma.user.upsert({
    where: { email: 'rajesh@pinepeak.com' },
    update: {},
    create: {
      email: 'rajesh@pinepeak.com',
      phone: '+919816099887',
      passwordHash,
      role: 'AGENCY',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          fullName: 'Rajesh Sharma',
          bio: 'Himachal Tour Specialist',
        },
      },
      agency: {
        create: {
          companyName: 'Pine Peak Travels Shimla',
          slug: 'pine-peak-shimla',
          logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          description: 'Shimla Mall Road & Kufri retreat specialists.',
          taxIdNumber: '02CCCCC0000C1Z8',
          kycStatus: 'VERIFIED',
          ratingAverage: 4.85,
          reviewCount: 94,
          commissionRate: 10.0,
          operatingRegion: 'Shimla & Kufri',
          wallet: {
            create: {
              balance: 95000.0,
              escrowHold: 0.0,
              totalEarned: 95000.0,
            },
          },
        },
      },
    },
    include: { agency: true },
  });

  // 5. Seed Destinations
  const sikkimDest = await prisma.destination.upsert({
    where: { slug: 'sikkim-gangtok' },
    update: {},
    create: {
      name: 'Sikkim & Gangtok',
      slug: 'sikkim-gangtok',
      state: 'Sikkim',
      country: 'India',
      tagline: 'Land of Mystical Monasteries & Alpine Lakes',
      description: 'Explore Nathula Pass, Tsomgo Lake, Yumthang Valley of Flowers, and authentic Himalayan culture.',
      heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      packageCount: 34,
      agencyCount: 22,
      startingPrice: 14999,
      popularActivities: JSON.stringify(['Tsomgo Lake Excursion', 'Yumthang Valley Safari', 'Gurudongmar Lake Trek', 'Rumtek Monastery Tour']),
      bestTimeToVisit: 'March – June & Oct – Dec',
      rating: 4.9,
    },
  });

  const shimlaDest = await prisma.destination.upsert({
    where: { slug: 'shimla-kufri' },
    update: {},
    create: {
      name: 'Shimla & Kufri',
      slug: 'shimla-kufri',
      state: 'Himachal Pradesh',
      country: 'India',
      tagline: 'Queen of the Hills & Colonial Elegance',
      description: 'Walk through Mall Road, Jakhoo Temple, scenic Toy Train rides, and snow-capped Kufri peaks.',
      heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      packageCount: 42,
      agencyCount: 28,
      startingPrice: 11999,
      popularActivities: JSON.stringify(['Kufri Snow Sports', 'Mall Road Heritage Walk', 'Toy Train Experience', 'Chail Palace Excursion']),
      bestTimeToVisit: 'October – June',
      rating: 4.8,
    },
  });

  // 6. Seed Packages
  if (agencyOwner1.agency) {
    await prisma.package.upsert({
      where: { slug: '5d4n-enchanting-sikkim-nathula' },
      update: {},
      create: {
        agencyId: agencyOwner1.agency.id,
        destinationId: sikkimDest.id,
        title: '5D/4N Enchanting Sikkim & Nathula Expedition',
        slug: '5d4n-enchanting-sikkim-nathula',
        durationDays: 5,
        durationNights: 4,
        pricePerPerson: 16500,
        originalPrice: 19999,
        coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        highlights: JSON.stringify(['Nathula Pass Permit Included', '4-Star Mountain View Resort', 'Private SUV Transfer', 'Tsomgo Lake & Baba Mandir']),
        includedAccommodations: '4-Star Mountain View Resort in Gangtok',
        includedMeals: 'Daily Breakfast & Dinner',
        transportType: 'Private Innova / Xylo SUV',
        isFeatured: true,
      },
    });
  }

  // 7. Seed Sample Trip Request
  const tripRequest = await prisma.tripRequest.upsert({
    where: { requestCode: 'TR-2026-000001' },
    update: {},
    create: {
      requestCode: 'TR-2026-000001',
      travellerId: travellerUser.id,
      destinationId: sikkimDest.id,
      status: 'QUOTES_RECEIVED',
      startDate: '2026-10-15',
      endDate: '2026-10-20',
      durationDays: 5,
      adultCount: 3,
      childCount: 0,
      budgetMin: 12000,
      budgetMax: 18000,
      hotelPreference: '4-Star Mountain View Resort',
      transportPreference: 'Private Innova Crysta SUV',
      specialRequests: 'Wedding anniversary trip. Require Nathula Pass permits.',
      aiStructuredSpec: JSON.stringify({
        destination: 'Sikkim',
        pax: { adults: 3, children: 0 },
        budget_per_head_inr: 18000,
        stay: '4-Star Mountain View Resort',
        vehicle: 'Private Innova Crysta SUV',
      }),
    },
  });

  // 8. Seed Quote
  if (agencyOwner1.agency) {
    await prisma.agencyQuote.upsert({
      where: { id: 'quote-seed-101' },
      update: {},
      create: {
        id: 'quote-seed-101',
        tripRequestId: tripRequest.id,
        agencyId: agencyOwner1.agency.id,
        status: 'ACCEPTED',
        totalPrice: 42000,
        pricePerPerson: 14000,
        hotelCategory: '4-Star Mountain View Resort',
        hotelNames: 'Elgin Nor-Khill Gangtok & Lachung Retreat',
        vehicleType: 'Private Toyota Innova Crysta (Dedicated Driver)',
        includedMeals: JSON.stringify(['Daily Buffet Breakfast', 'Traditional Sikkimese Welcome Dinner']),
        includedActivities: JSON.stringify(['Nathula Pass Protected Area Permit', 'Tsomgo Lake Excursion', 'Cable Car Pass in Gangtok']),
        excludedItems: JSON.stringify(['Personal shopping & tips', 'Zero Point extra vehicle charge']),
        cancellationPolicy: '100% Refund if cancelled 7 days prior to travel date',
        aiMatchScore: 96,
        aiRecommendationReason: 'Best overall value match. Offers verified 4-star mountain view rooms, dedicated Innova Crysta transport, and includes Nathula permits at no hidden cost.',
      },
    });
  }

  // 9. Seed Confirmed Booking
  if (agencyOwner1.agency) {
    await prisma.booking.upsert({
      where: { bookingCode: 'TRV-2026-SK892' },
      update: {},
      create: {
        bookingCode: 'TRV-2026-SK892',
        travellerId: travellerUser.id,
        agencyId: agencyOwner1.agency.id,
        tripRequestId: tripRequest.id,
        status: 'CONFIRMED',
        grossAmount: 42000,
        commissionAmount: 4200,
        netAgencyAmount: 37800,
        startDate: '2026-10-15',
        endDate: '2026-10-20',
        payment: {
          create: {
            status: 'SUCCESS',
            amount: 42000,
            razorpayOrderId: 'order_Pz901189201',
            razorpayPaymentId: 'pay_Pz901189201',
            paymentMethod: 'RAZORPAY_UPI',
          },
        },
      },
    });
  }

  console.log('✅ Traveller Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
