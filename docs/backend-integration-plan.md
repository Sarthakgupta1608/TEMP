# Traveller Backend Integration & System Architecture Plan

## Executive Summary
This document defines the complete backend integration plan for **Traveller**, converting the existing Vite + React + TypeScript frontend into a production-ready, full-stack AI-powered travel marketplace without modifying the visual design, layout, styling, or existing UI/UX.

---

## 1. Existing Frontend Architecture & Route Analysis

### Application State & Routing Model
- **Framework**: Vite 8 + React 19 + TypeScript + Tailwind CSS v4.
- **Routing Engine**: Custom History-API synced hash-router (`App.tsx`), handling browser back/forward (`popstate`) and URL hash changes (`#/<route>`).
- **Data Layer**: Static mock datasets defined in `src/data/mockData.ts`.

### Mapped Page Routes & Endpoints Matrix

| Route Key | Page Component | Functional Purpose | Required Backend API Endpoints |
| :--- | :--- | :--- | :--- |
| `home` | `HomePage.tsx` | Hero search, pilot destinations, ready-made packages, testimonials, FAQs | `GET /api/v1/destinations/popular`, `GET /api/v1/packages/featured`, `GET /api/v1/faqs` |
| `about` | `AboutPage.tsx` | Company story, impact stats, mission pillars | `GET /api/v1/platform/stats` |
| `contact` | `ContactPage.tsx` | Support inquiry form, regional offices, SLA metrics | `POST /api/v1/support/inquiries` |
| `blog` | `BlogPage.tsx` | Travel guides, search & category filters, article detail modal | `GET /api/v1/blogs`, `GET /api/v1/blogs/:id` |
| `packages` | `ExplorePackagesPage.tsx` | Full package catalog, budget range filter, package detail modal | `GET /api/v1/packages`, `GET /api/v1/packages/:id` |
| `destinations` | `DestinationsPage.tsx` | Pilot destinations (Sikkim, Shimla, Manali, Ladakh) explorer | `GET /api/v1/destinations` |
| `become-agency` | `BecomeAgencyPage.tsx` | Agency onboarding landing, revenue calculator, KYC guidelines | `POST /api/v1/agencies/register-intent` |
| `ai-planner` | `AITripPlannerPage.tsx` | 4-Step AI request wizard, OpenAI intent extraction, agency broadcast | `POST /api/v1/ai/extract-intent`, `POST /api/v1/trip-requests` |
| `compare-quotes` | `CompareQuotesPage.tsx` | Side-by-side quote comparison matrix, Razorpay escrow checkout | `GET /api/v1/trip-requests/:id/quotes`, `POST /api/v1/payments/create-order`, `POST /api/v1/payments/verify` |
| `login` | `LoginPage.tsx` | Dual-role login (Traveller vs Agency), OAuth simulation, JWT issuance | `POST /api/v1/auth/login`, `POST /api/v1/auth/google` |
| `signup` | `SignupPage.tsx` | Dual-role user registration | `POST /api/v1/auth/register` |
| `traveller-dashboard` | `TravellerDashboardPage.tsx` | 11 Sub-tabs (Overview, Trips, Requests, AI, Wishlist, Bookings, Payments, Messages, Notifications, Reviews, Settings) | `GET /api/v1/traveller/dashboard`, `GET /api/v1/bookings/my-bookings`, `GET /api/v1/messages/threads` |
| `agency-dashboard` | `AgencyDashboardPage.tsx` | 8 Sub-tabs (Overview, KYC Upload, Leads Inbox, Quote Builder, Bookings, Wallet, Reviews, Settings) | `GET /api/v1/agency/leads`, `POST /api/v1/agency/quotes`, `POST /api/v1/agency/kyc`, `POST /api/v1/agency/payouts` |
| `admin-panel` | `AdminPanelPage.tsx` | 5 Sub-tabs (GMV Overview, Agency KYC Review, Users, Bookings & Escrow Release, Financial Reports) | `GET /api/v1/admin/analytics`, `PATCH /api/v1/admin/agencies/:id/kyc`, `POST /api/v1/admin/escrow/release` |

---

## 2. End-to-End Data Flow Architecture

### Flow 1: Ready-Made Package Booking
```mermaid
sequenceDiagram
    autonumber
    actor T as Traveller
    participant FE as React Frontend
    participant API as Express Backend
    participant DB as PostgreSQL (Prisma)
    participant RZP as Razorpay Gateway

    T->>FE: Select Package & Click "Book Package"
    FE->>API: POST /api/v1/bookings (packageId, dates, pax)
    API->>DB: Verify Package Availability & Calculate Amount
    API->>RZP: Create Order (amount, currency)
    RZP-->>API: Order Object (order_id)
    API-->>FE: Order Details (order_id, key_id, amount)
    FE->>RZP: Trigger Razorpay Modal
    T->>RZP: Authorize Payment
    RZP-->>FE: Payment Signature & Payment ID
    FE->>API: POST /api/v1/payments/verify (order_id, payment_id, signature)
    API->>RZP: Server-to-Server Payment Verification
    API->>DB: Transaction: Create Payment, Update Booking to CONFIRMED, Calculate 10% Commission & Escrow Hold
    API-->>FE: Booking Confirmed (Booking Reference Code)
```

### Flow 2: AI-Powered Custom Trip & Quotation Marketplace
```mermaid
sequenceDiagram
    autonumber
    actor T as Traveller
    actor A as Local Agency
    participant FE as React Frontend
    participant API as Express Backend
    participant AI as OpenAI Service
    participant DB as PostgreSQL (Prisma)

    T->>FE: Enter Custom Trip Request Specs
    FE->>API: POST /api/v1/ai/extract-intent (prompt, dates, budget)
    API->>AI: Send Prompt with JSON Schema Enforcement
    AI-->>API: Structured TripSpecJSON
    API->>DB: Save TripRequest (Status: PUBLISHED)
    API->>DB: Query Verified Local Agencies in Target Destination
    API->>DB: Create Lead Records & Trigger Notifications
    A->>FE: View Lead in Agency Portal
    A->>FE: Submit Quotation Line Items
    FE->>API: POST /api/v1/trip-requests/:id/quotes
    API->>DB: Save AgencyQuote & LineItems
    T->>FE: View Compare Quotes Page
    FE->>API: GET /api/v1/trip-requests/:id/quotes
    API->>AI: Calculate Side-by-Side Match Matrix & Recommendations
    API-->>FE: 3 Itemized Quotes + AI Matrix Scores
    T->>FE: Select Winning Quote & Complete Razorpay Checkout
```

---

## 3. Security & Compliance Architecture

1. **Authentication**: Dual-token architecture using HTTP-Only SameSite Cookies for Access Tokens (15 min expiry) and Refresh Tokens (7 days expiry).
2. **Role-Based Access Control (RBAC)**: Middleware enforcing strict checks for `TRAVELLER`, `AGENCY`, `ADMIN`, and `SUPER_ADMIN` roles.
3. **Financial Security**: 100% server-side verification of Razorpay signatures and amount checks; optimistic concurrency lock on Wallet balances to prevent double payout disbursements.
4. **Data Isolation**: Multi-tenant context guards ensuring local agencies can only view leads for their verified operating destinations.

---

## 4. Phase-by-Phase Implementation Roadmap

- **Phase 1**: Architecture & Documentation *(Current)*
- **Phase 2**: Backend Directory Setup (`/backend`), Express + TypeScript + Prisma setup, database schema & seeder
- **Phase 3**: Authentication & Authorization (JWT, Refresh tokens, Password Hashing, RBAC Middleware)
- **Phase 4**: Core Domain APIs (Packages, Destinations, Wishlist, Reviews, Notifications)
- **Phase 5**: AI Engine & Custom Trip Request Pipeline (OpenAI Intent Extractor, Structured Specs)
- **Phase 6**: Agency Lead Inbox, Quote Builder & AI Matrix Scoring Engine
- **Phase 7**: Booking Lifecycle & Razorpay Escrow Integration
- **Phase 8**: Agency KYC Document Management & Admin Approval Workflows
- **Phase 9**: Real-time Messaging, Notifications & Review Moderation
- **Phase 10**: Admin Analytics, GMV Reports & Escrow Disbursement Operations
- **Phase 11**: Non-visual Frontend Integration (Replacing mock data calls with real API clients)
- **Phase 12**: Environment Configuration, Security Middleware, Build Verification & Deployment Docs
