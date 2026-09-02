# Traveller REST API Documentation

Base URL: `http://localhost:5000/api/v1`

All responses follow the standard JSON structure:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Detailed error description",
  "errorCode": "INVALID_CREDENTIALS"
}
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/register`
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "Rahul Sharma",
    "role": "TRAVELLER"
  }
  ```
- **Response (201)**: `{ "user": { "id": "...", "email": "...", "role": "TRAVELLER" } }`

### `POST /auth/login`
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200)**: `{ "user": { ... }, "accessToken": "..." }` + HTTP-Only Cookie (`refreshToken`).

### `POST /auth/refresh`
- **Auth**: Refresh Cookie
- **Response (200)**: `{ "accessToken": "..." }`

---

## 2. Packages & Destinations (`/api/v1/packages`, `/api/v1/destinations`)

### `GET /packages`
- **Auth**: Public
- **Query**: `?destination=Sikkim&maxPrice=30000&page=1&limit=10`
- **Response (200)**: Array of package items matching query filters.

### `GET /packages/:id`
- **Auth**: Public
- **Response (200)**: Full package details, hotel specs, transport type, and itinerary days.

---

## 3. Custom Trip Requests & AI Intent Engine (`/api/v1/ai`, `/api/v1/trip-requests`)

### `POST /ai/extract-intent`
- **Auth**: Protected (`TRAVELLER`)
- **Body**:
  ```json
  {
    "rawPrompt": "5-day trip to Sikkim in October for 2 adults, 4-star hotel, private Innova cab, Nathula permit."
  }
  ```
- **Response (200)**:
  ```json
  {
    "structuredSpec": {
      "destination": "Sikkim",
      "durationDays": 5,
      "adultCount": 2,
      "budgetPerHead": 18000,
      "hotelCategory": "4-Star Mountain View Resort",
      "transportType": "Private Innova Crysta"
    }
  }
  ```

### `POST /trip-requests`
- **Auth**: Protected (`TRAVELLER`)
- **Body**: Full Trip Request Payload.
- **Response (201)**: Created `TripRequest` object with assigned `requestCode` (e.g., `TR-2026-000001`).

### `GET /trip-requests/:id/quotes`
- **Auth**: Protected (`TRAVELLER` or `AGENCY`)
- **Response (200)**: List of agency quotations + AI comparative match score matrix.

---

## 4. Agency Portal APIs (`/api/v1/agency`)

### `GET /agency/leads`
- **Auth**: Protected (`AGENCY`)
- **Response (200)**: Leads matching agency's verified operating region.

### `POST /agency/quotes`
- **Auth**: Protected (`AGENCY`)
- **Body**: Custom quotation details (itemized hotels, vehicle, total price).
- **Response (201)**: Created Quote object.

---

## 5. Bookings & Payments (`/api/v1/bookings`, `/api/v1/payments`)

### `POST /bookings`
- **Auth**: Protected (`TRAVELLER`)
- **Body**: `{ "quoteId": "...", "packageId": "..." }`
- **Response (201)**: Created Booking record (`status: PENDING_PAYMENT`).

### `POST /payments/razorpay/create-order`
- **Auth**: Protected (`TRAVELLER`)
- **Body**: `{ "bookingId": "..." }`
- **Response (200)**: `{ "orderId": "order_Pz...", "amount": 4200000, "currency": "INR" }`

### `POST /payments/razorpay/verify`
- **Auth**: Protected (`TRAVELLER`)
- **Body**: `{ "razorpayOrderId": "...", "razorpayPaymentId": "...", "razorpaySignature": "..." }`
- **Response (200)**: Verified booking status updated to `CONFIRMED`.

---

## 6. Admin Panel APIs (`/api/v1/admin`)

### `GET /admin/analytics`
- **Auth**: Protected (`ADMIN`, `SUPER_ADMIN`)
- **Response (200)**: Total GMV, platform 10% commission, active agency count, booking conversion rate.

### `PATCH /admin/agencies/:id/kyc`
- **Auth**: Protected (`ADMIN`, `SUPER_ADMIN`)
- **Body**: `{ "status": "VERIFIED" }`
- **Response (200)**: Agency status updated.
