import http from 'http';
import app from './app';
import { prisma } from './lib/prisma';

interface TestResult {
  step: string;
  test: string;
  expected: string;
  actual: string;
  status: 'PASS' | 'FAIL';
}

const results: TestResult[] = [];

function record(step: string, test: string, expected: string, actual: string, pass: boolean) {
  results.push({
    step,
    test,
    expected,
    actual,
    status: pass ? 'PASS' : 'FAIL',
  });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${step} - ${test}: ${actual}`);
}

async function run() {
  const PORT = 5098;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      console.log(`Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  try {
    // ----------------------------------------------------
    // 1. Dual Login: Traveller Rohan + Agency Vikram + Admin + Traveller Ananya + Agency Rajesh
    // ----------------------------------------------------
    const loginTravellerRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rohan@example.com',
        password: 'Password123!',
        portalRole: 'traveller',
      }),
    });
    const travellerData = await loginTravellerRes.json();
    const travellerToken = travellerData.data?.accessToken;
    const travellerCookie = loginTravellerRes.headers.get('set-cookie') || '';

    record(
      'Auth Dual Login',
      'Traveller Rohan Login (traveller portal)',
      '200 with access token and refresh_token_traveller cookie',
      `Status ${loginTravellerRes.status}, token: ${Boolean(travellerToken)}, cookie has refresh_token_traveller: ${travellerCookie.includes('refresh_token_traveller')}`,
      loginTravellerRes.status === 200 && Boolean(travellerToken) && travellerCookie.includes('refresh_token_traveller')
    );

    const loginAgencyRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vikram@himalayan.com',
        password: 'Password123!',
        portalRole: 'agency',
      }),
    });
    const agencyData = await loginAgencyRes.json();
    const agencyToken = agencyData.data?.accessToken;
    const agencyCookie = loginAgencyRes.headers.get('set-cookie') || '';

    record(
      'Auth Dual Login',
      'Agency Vikram Login (agency portal)',
      '200 with access token and refresh_token_agency cookie',
      `Status ${loginAgencyRes.status}, token: ${Boolean(agencyToken)}, cookie has refresh_token_agency: ${agencyCookie.includes('refresh_token_agency')}`,
      loginAgencyRes.status === 200 && Boolean(agencyToken) && agencyCookie.includes('refresh_token_agency')
    );

    // Login Admin
    const loginAdminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@traveller.app',
        password: 'Password123!',
        portalRole: 'admin',
      }),
    });
    const adminData = await loginAdminRes.json();
    const adminToken = adminData.data?.accessToken;

    // Login Traveller 2 (Ananya)
    const loginTraveller2Res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ananya@example.com',
        password: 'Password123!',
        portalRole: 'traveller',
      }),
    });
    const traveller2Data = await loginTraveller2Res.json();
    const traveller2Token = traveller2Data.data?.accessToken;

    // Login Agency 2 (Rajesh - Pine Peak Travels)
    const loginAgency2Res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rajesh@pinepeak.com',
        password: 'Password123!',
        portalRole: 'agency',
      }),
    });
    const agency2Data = await loginAgency2Res.json();
    const agency2Token = agency2Data.data?.accessToken;

    // ----------------------------------------------------
    // 2. Both /auth/me succeed independently
    // ----------------------------------------------------
    const meTravellerRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${travellerToken}` },
    });
    const meTravellerData = await meTravellerRes.json();
    record(
      'Auth Me',
      'Traveller /auth/me returns TRAVELLER role',
      '200 TRAVELLER',
      `Status ${meTravellerRes.status}, role: ${meTravellerData.data?.role}`,
      meTravellerRes.status === 200 && meTravellerData.data?.role === 'TRAVELLER'
    );

    const meAgencyRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${agencyToken}` },
    });
    const meAgencyData = await meAgencyRes.json();
    record(
      'Auth Me',
      'Agency /auth/me returns AGENCY role',
      '200 AGENCY',
      `Status ${meAgencyRes.status}, role: ${meAgencyData.data?.role}`,
      meAgencyRes.status === 200 && meAgencyData.data?.role === 'AGENCY'
    );

    // ----------------------------------------------------
    // 3. Portal hint mismatch
    // ----------------------------------------------------
    const mismatchRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rohan@example.com',
        password: 'Password123!',
        portalRole: 'agency', // Rohan is TRAVELLER, logging into agency portal
      }),
    });
    const mismatchData = await mismatchRes.json();
    record(
      'Role Enforcement',
      'Traveller credentials on Agency portal rejected',
      '403 Forbidden with clear role message',
      `Status ${mismatchRes.status}, message: "${mismatchData.message}"`,
      mismatchRes.status === 403
    );

    // ----------------------------------------------------
    // 4. Role Guards: Cross-portal route access
    // ----------------------------------------------------
    // Traveller token on Agency route /agency/bookings
    const crossAgencyRes = await fetch(`${BASE_URL}/agency/bookings`, {
      headers: { Authorization: `Bearer ${travellerToken}` },
    });
    record(
      'Role Enforcement',
      'Traveller token on GET /agency/bookings',
      '403 Forbidden',
      `Status ${crossAgencyRes.status}`,
      crossAgencyRes.status === 403
    );

    // Agency token on Traveller route POST /bookings
    const crossTravellerRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${agencyToken}`,
      },
      body: JSON.stringify({ quoteId: 'quote-seed-101' }),
    });
    record(
      'Role Enforcement',
      'Agency token on POST /bookings',
      '403 Forbidden',
      `Status ${crossTravellerRes.status}`,
      crossTravellerRes.status === 403
    );

    // No token on protected route
    const unauthRes = await fetch(`${BASE_URL}/bookings/my`);
    record(
      'Auth Guard',
      'No token on GET /bookings/my',
      '401 Unauthorized',
      `Status ${unauthRes.status}`,
      unauthRes.status === 401
    );

    // ----------------------------------------------------
    // 5. Booking Creation by Traveller A (Rohan)
    // ----------------------------------------------------
    const agency1Pkg = await prisma.package.findFirst({
      where: { agency: { owner: { email: 'vikram@himalayan.com' } } },
    });

    const createBookingRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${travellerToken}`,
      },
      body: JSON.stringify({
        packageId: agency1Pkg?.id,
        startDate: '2026-11-01',
        endDate: '2026-11-06',
        pax: 2,
      }),
    });
    const createBookingData = await createBookingRes.json();
    const createdBooking = createBookingData.data;

    record(
      'Bookings',
      'Traveller Rohan creates booking for package (Agency 1)',
      '201 Created with server-derived agencyId and mock payment',
      `Status ${createBookingRes.status}, code: ${createdBooking?.bookingCode}, agencyId: ${createdBooking?.agencyId}`,
      createBookingRes.status === 201 && Boolean(createdBooking?.id) && Boolean(createdBooking?.agencyId)
    );

    const bookingId = createdBooking?.id;

    // ----------------------------------------------------
    // 6. Booking Visibility & Isolation
    // ----------------------------------------------------
    // Traveller A's bookings
    const rohanBookingsRes = await fetch(`${BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${travellerToken}` },
    });
    const rohanBookingsData = await rohanBookingsRes.json();
    const rohanHasBooking = Array.isArray(rohanBookingsData.data) && rohanBookingsData.data.some((b: any) => b.id === bookingId);
    record(
      'Isolation',
      "Booking appears in Traveller A's GET /bookings/my",
      'Found in list',
      `Count: ${rohanBookingsData.data?.length}, contains booking: ${rohanHasBooking}`,
      rohanHasBooking
    );

    // Agency 1's bookings (Vikram)
    const agency1BookingsRes = await fetch(`${BASE_URL}/agency/bookings`, {
      headers: { Authorization: `Bearer ${agencyToken}` },
    });
    const agency1BookingsData = await agency1BookingsRes.json();
    const agency1HasBooking = Array.isArray(agency1BookingsData.data) && agency1BookingsData.data.some((b: any) => b.id === bookingId);
    record(
      'Isolation',
      "Booking appears in Agency 1's GET /agency/bookings",
      'Found in list',
      `Count: ${agency1BookingsData.data?.length}, contains booking: ${agency1HasBooking}`,
      agency1HasBooking
    );

    // Traveller B's bookings (Ananya) -> MUST NOT SEE Rohan's booking
    const ananyaBookingsRes = await fetch(`${BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${traveller2Token}` },
    });
    const ananyaBookingsData = await ananyaBookingsRes.json();
    const ananyaHasBooking = Array.isArray(ananyaBookingsData.data) && ananyaBookingsData.data.some((b: any) => b.id === bookingId);
    record(
      'Isolation',
      "Traveller B does NOT see Traveller A's booking in GET /bookings/my",
      'NOT found in list',
      `Count: ${ananyaBookingsData.data?.length}, contains booking: ${ananyaHasBooking}`,
      !ananyaHasBooking
    );

    // Agency 2's bookings (Rajesh - Pine Peak) -> MUST NOT SEE Agency 1's booking
    const agency2BookingsRes = await fetch(`${BASE_URL}/agency/bookings`, {
      headers: { Authorization: `Bearer ${agency2Token}` },
    });
    const agency2BookingsData = await agency2BookingsRes.json();
    const agency2HasBooking = Array.isArray(agency2BookingsData.data) && agency2BookingsData.data.some((b: any) => b.id === bookingId);
    record(
      'Isolation',
      "Agency 2 does NOT see Agency 1's booking in GET /agency/bookings",
      'NOT found in list',
      `Count: ${agency2BookingsData.data?.length}, contains booking: ${agency2HasBooking}`,
      !agency2HasBooking
    );

    // ----------------------------------------------------
    // 7. Single Booking GET /bookings/:id Ownership Permissions
    // ----------------------------------------------------
    // Allowed for Traveller A (owner)
    const getByTravellerRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${travellerToken}` },
    });
    record(
      'Ownership Security',
      'Traveller A can GET /bookings/:id',
      '200 OK',
      `Status ${getByTravellerRes.status}`,
      getByTravellerRes.status === 200
    );

    // Allowed for Agency 1 (assigned agency)
    const getByAgency1Res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${agencyToken}` },
    });
    record(
      'Ownership Security',
      'Agency 1 can GET /bookings/:id',
      '200 OK',
      `Status ${getByAgency1Res.status}`,
      getByAgency1Res.status === 200
    );

    // Allowed for Admin
    const getByAdminRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    record(
      'Ownership Security',
      'Admin can GET /bookings/:id',
      '200 OK',
      `Status ${getByAdminRes.status}`,
      getByAdminRes.status === 200
    );

    // FORBIDDEN for Traveller B (Ananya)
    const getByTraveller2Res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${traveller2Token}` },
    });
    record(
      'Ownership Security',
      'Traveller B access to GET /bookings/:id is forbidden',
      '403 Forbidden',
      `Status ${getByTraveller2Res.status}`,
      getByTraveller2Res.status === 403
    );

    // FORBIDDEN for Agency 2 (Pine Peak)
    const getByAgency2Res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${agency2Token}` },
    });
    record(
      'Ownership Security',
      'Agency 2 access to GET /bookings/:id is forbidden',
      '403 Forbidden',
      `Status ${getByAgency2Res.status}`,
      getByAgency2Res.status === 403
    );

    // ----------------------------------------------------
    // 8. Silent Refresh Flow
    // ----------------------------------------------------
    const refreshCookieHeader = travellerCookie.split(';')[0]; // e.g. refresh_token_traveller=...
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh?role=traveller`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: refreshCookieHeader,
      },
    });
    const refreshData = await refreshRes.json();
    const newAccessToken = refreshData.data?.accessToken;

    record(
      'Token Refresh',
      'POST /auth/refresh?role=traveller with role cookie',
      '200 with new access token',
      `Status ${refreshRes.status}, token renewed: ${Boolean(newAccessToken)}`,
      refreshRes.status === 200 && Boolean(newAccessToken)
    );

    // Verify calls work with new access token
    const testNewTokenRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    record(
      'Token Refresh',
      'Use renewed access token on /auth/me',
      '200 OK',
      `Status ${testNewTokenRes.status}`,
      testNewTokenRes.status === 200
    );

    // ----------------------------------------------------
    // 9. Independent Logout
    // ----------------------------------------------------
    const logoutTravellerRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'traveller' }),
    });
    const logoutCookie = logoutTravellerRes.headers.get('set-cookie') || '';
    const clearsTravellerCookie = logoutCookie.includes('refresh_token_traveller=;') || logoutCookie.includes('Max-Age=0');

    record(
      'Independent Logout',
      'POST /auth/logout for role traveller',
      'Clears refresh_token_traveller cookie',
      `Status ${logoutTravellerRes.status}, set-cookie: ${logoutCookie}`,
      logoutTravellerRes.status === 200 && clearsTravellerCookie
    );

    // Agency session must still be valid!
    const agencyStillValidRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${agencyToken}` },
    });
    record(
      'Independent Logout',
      'Agency Vikram session still valid after Traveller logout',
      '200 OK',
      `Status ${agencyStillValidRes.status}`,
      agencyStillValidRes.status === 200
    );

    // ----------------------------------------------------
    // 10. Notifications check
    // ----------------------------------------------------
    const travellerUserId = travellerData.data?.user?.id || meTravellerData.data?.id;
    const agencyUserId = agencyData.data?.user?.id || meAgencyData.data?.id;

    const travellerNotifications = await prisma.notification.findMany({
      where: { userId: travellerUserId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const agencyNotifications = await prisma.notification.findMany({
      where: { userId: agencyUserId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    record(
      'Notifications',
      'Booking Confirmed notification created for Traveller A',
      'Found notification in DB',
      `Title: "${travellerNotifications[0]?.title}"`,
      travellerNotifications[0]?.title === 'Booking Confirmed!'
    );

    record(
      'Notifications',
      'New Booking Received notification created for Agency 1 owner',
      'Found notification in DB',
      `Title: "${agencyNotifications[0]?.title}"`,
      agencyNotifications[0]?.title === 'New Booking Received!'
    );

  } finally {
    await prisma.$disconnect();
    server.close();
  }

  console.log('\n========================================');
  console.log('SUMMARY OF VERIFICATION RESULTS:');
  console.log('========================================');
  console.table(results);

  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length} test(s) failed!`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${results.length} verification tests passed successfully!`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
