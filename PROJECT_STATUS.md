# Project Status & Handoff Audit Report: Traveller MVP

**Inspection Date**: October 30, 2026  
**Auditor**: Antigravity AI Engineering  
**Repository Working Directory**: `c:\Users\1608s\OneDrive\Desktop\traveller mvp`  
**Git Branch**: `main` (Up to date with `origin/main`)  
**Audit Scope**: Read-only repository audit, architectural assessment, code tracing, static analysis, and build verification.

---

## 1. Project Summary

**Traveller** is an AI-powered local travel marketplace designed to connect travellers planning Himalayan vacations (specifically pilot corridors in Sikkim & Gangtok and Shimla & Kufri) directly with verified native destination tour operators. The platform's primary goal is to eliminate traditional Online Travel Agency (OTA) middleman markups (typically 30–40%) by allowing travellers to publish custom travel requests, receive itemized quotes directly from local agencies, evaluate options using an AI-driven quote comparison matrix, and transact via payment escrow protection. This project intent is **documented** in detail across `docs/backend-integration-plan.md`, `docs/api-documentation.md`, and reflected throughout the user interface in `src/pages/HomePage.tsx` and `src/pages/AboutPage.tsx`.

---

## 2. Tech Stack and Architecture

### Languages, Frameworks & Libraries
- **Frontend**:
  - React 19.2.8 (`react`, `react-dom`)
  - Build Tool: Vite 8.2.0 (`@vitejs/plugin-react` 6.0.4)
  - Styling: Tailwind CSS v4.3.3 (`@tailwindcss/vite` 4.3.3, `clsx` 2.1.1, `tailwind-merge` 3.6.0)
  - Icons & UI: `lucide-react` 1.30.0, `framer-motion` 13.0.0
  - Linter: `oxlint` 1.75.0
  - TypeScript: ~6.0.2 (`tsconfig.app.json`, `tsconfig.node.json`)
- **Backend**:
  - Runtime: Node.js (tested on v24.19.0) with `tsx` 4.19.2 (development execution)
  - Framework: Express 4.21.2 (`@types/express` 5.0.0)
  - Database ORM: Prisma Client & CLI 6.3.1 (`@prisma/client`, `prisma`)
  - Authentication: JSON Web Token (`jsonwebtoken` 9.0.2), Password Hashing (`bcryptjs` 2.4.3), Cookie parsing (`cookie-parser` 1.4.7)
  - Security & Utilities: `helmet` 8.0.0, `cors` 2.8.5, `express-rate-limit` 7.5.0, `morgan` 1.10.0, `zod` 3.24.2, `dotenv` 16.4.7
  - External SDKs installed: `openai` 4.85.1, `razorpay` 2.9.5 (unused in code)
- **Database**:
  - **Implemented**: SQLite (`backend/prisma/dev.db` via `file:./dev.db`).
  - **Documented**: PostgreSQL 16+ specified in `docs/database-design.md`.

### System Architecture & Connection Diagram

```
[Browser / Client]
       │
       ▼
[React 19 Frontend (SPA on Vite / Port 5173)]
   │                                   │
   ├─► History API Hash Router         ├─► Static Fallbacks (src/data/mockData.ts)
   │   (App.tsx: #/<route>)            │   [Used by 85%+ of pages directly]
   │                                   ▼
   └─► HTTP Client (src/services/apiClient.ts)
       [Uses fetch() with silent try/catch fallback to mock data]
                                       │
                                       ▼ HTTP JSON (Port 5000 / /api/v1)
[Express 4.21 Backend API]
   ├─► Security Layer: Helmet, CORS, RateLimiter (200 req/15min)
   ├─► Auth Middleware: authGuard.ts (Mounted ONLY on /auth/me; missing on all other routes)
   ├─► Modular Routes (/api/v1/*) -> Controllers -> Services
   └─► Prisma ORM (v6.3.1)
           │
           ├─► SQLite Database (backend/prisma/dev.db) [4 users, 2 agencies, 2 destinations seeded]
           ├─► OpenAI Service (Fallback mock generator active; AI_API_KEY is placeholder)
           └─► Razorpay Service (Mock payment generation active; SDK client not instantiated)
```

---

## 3. Folder and File Map

```
traveller-mvp/
├── .gitignore                      # Git exclusion rules for node_modules, build artifacts, dev.db
├── .oxlintrc.json                  # Oxlint configuration for React/TypeScript rules
├── index.html                      # Frontend HTML shell and mount entry point
├── package.json                    # Root/Frontend dependencies and npm scripts
├── package-lock.json               # Frontend dependency lockfile
├── README.md                       # Default Vite boilerplate README (unmodified)
├── tsconfig.json                   # Root TypeScript project references configuration
├── tsconfig.app.json               # Frontend application TypeScript compiler settings
├── tsconfig.node.json              # Vite configuration TypeScript compiler settings
├── vite.config.ts                  # Vite bundler configuration with Tailwind CSS v4 integration
│
├── public/                         # Static web assets
│   ├── favicon.svg                 # SVG browser tab icon
│   └── icons.svg                   # SVG icon symbol definitions
│
├── docs/                           # Architecture and design specifications
│   ├── api-documentation.md        # REST API endpoint specs and request/response contracts
│   ├── authentication.md           # Dual-token JWT authentication flow and RBAC matrix
│   ├── backend-integration-plan.md # 12-phase system architecture and integration roadmap
│   └── database-design.md          # PostgreSQL database schema and ER diagram blueprint
│
├── src/                            # React 19 Frontend Source Code
│   ├── main.tsx                    # React DOM client entry point
│   ├── App.tsx                     # Main shell, custom HashRouter, dynamic SEO head, theme manager
│   ├── App.css                     # Component style overrides
│   ├── index.css                   # Tailwind v4 directives, glass-card styles, orb animations
│   ├── assets/                     # Static graphics (hero.png, react.svg, vite.svg)
│   ├── components/layout/          # Reusable structural components
│   │   ├── AIChatbotWidget.tsx     # Floating simulated AI assistant (regex/keyword matching)
│   │   ├── Footer.tsx              # Global footer with regional office details and escrow notice
│   │   ├── Navbar.tsx              # Header with navigation links, branding, and dark mode toggle
│   │   └── SEOHead.tsx             # Document head and meta tag injector
│   ├── data/
│   │   └── mockData.ts             # Static datasets: destinations, packages, quotes, blogs, FAQs
│   ├── pages/                      # Application route views (14 pages)
│   │   ├── AboutPage.tsx           # Company mission, trust pillars, and metric counters
│   │   ├── AdminPanelPage.tsx      # Admin portal: agency verification, GMV, escrow (local mock state)
│   │   ├── AgencyDashboardPage.tsx # Agency portal: leads, quote builder, wallet (local mock state)
│   │   ├── AITripPlannerPage.tsx   # 4-step trip request wizard; calls ApiClient.createTripRequest
│   │   ├── BecomeAgencyPage.tsx    # Agency landing page and revenue calculator (unwired modal)
│   │   ├── BlogPage.tsx            # Travel journal articles with search/category filter (mock data)
│   │   ├── CompareQuotesPage.tsx   # Quote comparison grid & escrow checkout; calls ApiClient
│   │   ├── ContactPage.tsx         # Contact info for Sikkim/Shimla hubs & support form (unwired)
│   │   ├── DestinationsPage.tsx    # Destination browser with search (reads mockData.ts directly)
│   │   ├── ExplorePackagesPage.tsx # Package catalog with price/destination filter; calls ApiClient
│   │   ├── HomePage.tsx            # Landing page with hero search, pilot hubs, testimonials, FAQs
│   │   ├── LoginPage.tsx           # Login form with role toggle (pure setTimeout simulation)
│   │   ├── SignupPage.tsx          # Account creation form (pure setTimeout simulation)
│   │   └── TravellerDashboardPage.tsx # 11-tab user portal: trips, chat, wishlist (local mock state)
│   ├── services/
│   │   └── apiClient.ts            # Frontend HTTP client with silent mock fallbacks
│   └── types/
│       └── index.ts                # TypeScript interfaces for routes, packages, quotes, and tabs
│
└── backend/                        # Express + TypeScript + Prisma Backend API
    ├── .env                        # Local environment variables (active configuration)
    ├── .env.example                # Template environment variables documentation
    ├── package.json                # Backend dependencies and scripts
    ├── package-lock.json           # Backend dependency lockfile
    ├── tsconfig.json               # Backend TypeScript compiler configuration
    ├── prisma/
    │   ├── dev.db                  # Active SQLite database file (seeded with test data)
    │   ├── schema.prisma           # 15 Prisma data models configured for SQLite provider
    │   └── seed.ts                 # Database seeder script (admin, traveller, 2 agencies, packages)
    └── src/
        ├── server.ts               # Server bootstrap listening on port 5000
        ├── app.ts                  # Express application configuration and middleware stack
        ├── config/
        │   └── index.ts            # Central configuration loader with fallback defaults
        ├── lib/
        │   └── prisma.ts           # PrismaClient singleton instance
        ├── middleware/
        │   ├── authGuard.ts        # JWT validation (requireAuth) & role guard (requireRole)
        │   └── errorHandler.ts     # Global Express error handler (Zod, Prisma, HTTP errors)
        ├── utils/
        │   └── response.ts         # Standardized JSON response envelope utilities
        ├── routes/                 # API route definitions
        │   ├── index.ts            # Root API v1 router mounting all sub-routes
        │   ├── admin.routes.ts     # Analytics, agency KYC approval, escrow release routes
        │   ├── agency.routes.ts    # Leads, wallet, payout, KYC document upload routes
        │   ├── auth.routes.ts      # Register, login, logout, me routes
        │   ├── booking.routes.ts   # Booking creation, payment verify, my-bookings routes
        │   ├── message.routes.ts   # Booking conversation and message routes
        │   ├── notification.routes.ts # User notification fetch and read-status routes
        │   ├── package.routes.ts   # Public package and destination browsing routes
        │   ├── review.routes.ts    # Review submission and agency review retrieval routes
        │   ├── tripRequest.routes.ts # AI intent extraction, trip requests, agency quotes routes
        │   ├── user.routes.ts      # Profile updates and password change routes
        │   └── wishlist.routes.ts  # User wishlist CRUD routes
        ├── controllers/            # HTTP request handlers (11 controllers)
        │   ├── admin.controller.ts, agency.controller.ts, auth.controller.ts,
        │   ├── booking.controller.ts, message.controller.ts, notification.controller.ts,
        │   ├── package.controller.ts, review.controller.ts, tripRequest.controller.ts,
        │   └── user.controller.ts, wishlist.controller.ts
        └── services/               # Business logic & database operations (11 services)
            ├── agency.service.ts, ai.service.ts, auth.service.ts, booking.service.ts,
            ├── message.service.ts, notification.service.ts, package.service.ts,
            ├── review.service.ts, tripRequest.service.ts, user.service.ts, wishlist.service.ts
```

---

## 4. How to Set Up and Run

### Environment Variables
Configure `backend/.env` (reference `backend/.env.example`):
- `PORT`: Express server port (default: `5000`)
- `NODE_ENV`: Execution environment (`development` | `production`)
- `FRONTEND_URL`: Allowed CORS origin (default: `http://localhost:5173`)
- `DATABASE_URL`: Prisma connection string (currently `file:./dev.db`)
- `JWT_ACCESS_SECRET`: Secret string for short-lived access tokens
- `JWT_REFRESH_SECRET`: Secret string for long-lived refresh tokens
- `AI_API_KEY`: OpenAI API key
- `RAZORPAY_KEY_ID`: Razorpay public key ID
- `RAZORPAY_KEY_SECRET`: Razorpay secret key
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Media storage keys

*Note: Frontend has no `.env` file; `API_BASE_URL` is hardcoded as `'http://localhost:5000/api/v1'` in `src/services/apiClient.ts`.*

### Setup Commands
1. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```
2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Database Initialization & Seeding**:
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:seed
   ```
4. **Run Development Servers**:
   - Backend:
     ```bash
     cd backend
     npm run dev
     # Runs tsx watch src/server.ts on http://localhost:5000
     ```
   - Frontend:
     ```bash
     npm run dev
     # Runs Vite development server on http://localhost:5173
     ```

### Verification Results When Executed During Audit
- **Frontend Linter (`npm run lint`)**: **SUCCESSFUL** (0 errors, 15 warnings across 66 files). Warnings are unused catch parameters in `apiClient.ts`, unused variables in `seed.ts`, and a missing `currentRoute` dependency in `src/App.tsx#L65`.
- **Frontend Build (`npm run build`)**: **SUCCESSFUL** (`tsc -b && vite build` built production bundle in 305ms: `dist/index.html` 0.46 kB, JS 401.45 kB, CSS 82.92 kB).
- **Backend Build (`cd backend && npm run build`)**: **FAILED** (Exit code 1). TypeScript compiler (`tsc`) emitted 7 compilation errors in controller files:
  - `src/controllers/admin.controller.ts:39:18` (TS2322: `Type 'string | string[]' is not assignable to type 'string | undefined'`)
  - `src/controllers/message.controller.ts:9:65` (TS2345)
  - `src/controllers/notification.controller.ts:19:58` (TS2345)
  - `src/controllers/package.controller.ts:23:55` (TS2345)
  - `src/controllers/review.controller.ts:19:60` (TS2345)
  - `src/controllers/tripRequest.controller.ts:30:67` (TS2345)
  - `src/controllers/wishlist.controller.ts:30:56` (TS2345)  
  *Root Cause: `@types/express` v5 types `req.params` as `string | string[]`. Direct parameter passing to Prisma queries expecting `string` fails type checking.*
- **Backend Runtime (`tsx`)**: Works in dev mode (`npm run dev`) because `tsx` bypasses strict type-checking, but production build (`npm run build`) fails.
- **Automated Tests**: **CANNOT RUN / NOT IMPLEMENTED**. No test runner (Vitest, Jest, Supertest) or test scripts exist in either `package.json`.

---

## 5. Feature Status Table

| Feature / Module | Status | Evidence (Files) | What's Missing or Wrong |
| :--- | :--- | :--- | :--- |
| **Marketing Pages** (Home, About, Contact, Blog, Destinations) | **Partial** | `src/pages/HomePage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `BlogPage.tsx`, `DestinationsPage.tsx` | All views consume static data from `src/data/mockData.ts`. Contact inquiry form and newsletter subscriptions have no API wiring. |
| **User Authentication (Frontend)** | **Broken / Simulated** | `src/pages/LoginPage.tsx#L15-L21`, `src/pages/SignupPage.tsx#L21-L27` | Submitting login or signup executes `setTimeout()` and routes to home/planner without calling `apiClient.ts` or backend. Tokens are never stored; session state does not exist. |
| **User Authentication (Backend)** | **Partial** | `backend/src/routes/auth.routes.ts`, `backend/src/services/auth.service.ts` | Register, login, and `/me` endpoints work via bcrypt and JWT. However, `/refresh` route is missing from `auth.routes.ts` (despite docs), no password complexity rules exist, and default JWT secret fallbacks exist in code. |
| **Package Catalog** | **Done** (with fallback) | `src/pages/ExplorePackagesPage.tsx#L17-L25`, `backend/src/routes/package.routes.ts` | Wired to `ApiClient.fetchPackages()`. Loads packages, supports destination and price filtering, displays detail modal. Clicking "Customize" navigates to planner. |
| **AI Trip Request Wizard** | **Partial** | `src/pages/AITripPlannerPage.tsx#L28-L34`, `backend/src/routes/tripRequest.routes.ts` | 4-step wizard calls `ApiClient.createTripRequest()` and saves record in DB. However, the generated request ID is not carried forward to `CompareQuotesPage`; navigation just opens static quote view. |
| **AI Intent Extraction Engine** | **Partial** | `backend/src/services/ai.service.ts#L9-L55` | OpenAI integration is implemented with fallback structured output. Because `AI_API_KEY` is a placeholder, it always executes the hardcoded Sikkim/Shimla JSON fallback. |
| **Quote Comparison Engine** | **Partial** | `src/pages/CompareQuotesPage.tsx#L27-L43`, `backend/src/services/tripRequest.service.ts#L52-L58` | UI renders side-by-side matrix. `ApiClient.fetchQuotesForRequest()` defaults to `'seed-id'`. AI match score is hardcoded via ternary operator (`totalPrice <= 45000 ? 96 : 89`) in `AIService.compareQuotes`. |
| **Razorpay Checkout & Escrow** | **Broken / Mock** | `src/pages/CompareQuotesPage.tsx#L181-L255`, `backend/src/services/booking.service.ts#L6-L71` | Real Razorpay checkout SDK is NOT loaded. Clicking "Authorize Razorpay Payment" triggers custom HTML modal. Backend creates mock payment records with random `order_` IDs and instantly marks bookings `CONFIRMED`. |
| **Traveller Dashboard** | **Broken / Simulated** | `src/pages/TravellerDashboardPage.tsx` | All 11 tabs (overview, trips, chat, wishlist, bookings, payments) operate entirely on hardcoded React `useState`. Hardcoded as user "Rohan Verma". Zero backend integration. |
| **Agency Portal & Dashboard** | **Broken / Simulated** | `src/pages/AgencyDashboardPage.tsx` | 8 portal tabs operate entirely on local mock state. Lead inbox, quote submission, KYC upload, and payout requests do not call backend APIs. |
| **Agency Backend APIs** | **Broken / Unauthenticated** | `backend/src/routes/agency.routes.ts`, `backend/src/controllers/agency.controller.ts` | Routes have NO `requireAuth` guard. Controllers default `agencyId` to `'agency-seed-id-101'` which does not exist in SQLite DB, crashing with foreign key violation errors when called without auth. |
| **Admin Control Panel** | **Broken / Simulated** | `src/pages/AdminPanelPage.tsx#L322`, `backend/src/routes/admin.routes.ts`, `backend/src/controllers/admin.controller.ts` | Frontend uses local mock state and browser `alert()`. Backend `/admin/*` routes have NO authentication or role guards. Analytics returns hardcoded GMV numbers (`4850000.0`). Escrow release endpoint is unprotected. |
| **Messaging & Notifications** | **Partial** | `backend/src/routes/message.routes.ts`, `backend/src/routes/notification.routes.ts`, `backend/src/services/message.service.ts` | Prisma models and DB services exist. Controllers lack auth guards and default to hardcoded non-existent UUIDs. No WebSockets or real-time transport implemented. Frontend chat is a local `setTimeout` loop. |
| **Reviews & Wishlist** | **Partial** | `backend/src/routes/review.routes.ts`, `backend/src/routes/wishlist.routes.ts` | Backend CRUD services exist in Prisma. Routes lack auth guards. Frontend uses static mock data. |

---

## 6. Current Progress Summary

- **Estimated Overall Progress**: **~45% complete**
  - **Frontend UI / UX**: **~95% complete**. Modern, fully responsive, dark-mode compatible interface with rich glassmorphic cards and interactive multi-step wizards across all 14 views.
  - **Backend Domain Services**: **~60% complete**. 15 Prisma models, seed data, and service classes implemented for all core domains.
  - **System Integration**: **~15% complete**. Only 3 views make network calls; authentication, user sessions, dashboards, and payment processing remain entirely disconnected from the backend.
- **Most Recently Worked On (Git History)**:
  - Commit `4210ab0` (*Sun Sep 20 2026*): Frontend styling updates in `src/index.css` and `src/pages/DestinationsPage.tsx`, adjusting gradient utilities and copy.
  - Preceding commits (`7990d5b`, `5559a9c`, `f2c308d`): Homepage redesign, hero section updates, and visual refinements.
  - Commit `8f23c50` (*Sun Sep 6 2026*): Backend controllers, routes, and services created for agencies, messages, notifications, reviews, users, and wishlist.
- **Uncommitted Changes in Working Tree**:
  - `src/index.css`: Replaced rose button glow with blue primary glow; added floating background orb keyframe animations (`float-slow`, `float-medium`, `float-fast`).
  - `src/pages/HomePage.tsx`: Added 3 animated background orb divs in the hero section; updated badge styling from rose to blue accents.
- **Likely In Progress When Work Stopped**:
  Fine-tuning visual polish on `HomePage.tsx` (the uncommitted CSS/orb changes) before proceeding to wire authentication and dashboard data layers.

---

## 7. Bugs, Risks, and Technical Debt

### High Severity
1. **Backend TypeScript Build Failure (`tsc`)**:
   - *Evidence*: `backend/src/controllers/*.ts` (lines in `admin.controller.ts:39`, `message.controller.ts:9`, `notification.controller.ts:19`, `package.controller.ts:23`, `review.controller.ts:19`, `tripRequest.controller.ts:30`, `wishlist.controller.ts:30`).
   - *Impact*: `npm run build` fails in `backend/`. Production deployments cannot compile. Caused by `@types/express` v5 typing `req.params` values as `string | string[]`.
2. **Missing Authentication and Role Guards on Sensitive Backend Routes**:
   - *Evidence*: `backend/src/routes/admin.routes.ts`, `agency.routes.ts`, `booking.routes.ts`, `user.routes.ts`, `wishlist.routes.ts`.
   - *Impact*: In `backend/src/routes/`, only `/auth/me` imports and uses `requireAuth`. Endpoints like `POST /admin/escrow/release`, `PATCH /admin/agencies/:id/kyc`, `POST /agency/payouts`, `GET /agency/wallet`, and `PATCH /user/profile` are completely public and accessible without any token.
3. **Database Foreign Key Constraint Violations from Fallback Seed IDs**:
   - *Evidence*: `backend/src/controllers/agency.controller.ts#L9`, `backend/src/controllers/booking.controller.ts#L9`, `backend/src/controllers/tripRequest.controller.ts#L20`.
   - *Impact*: Controllers fall back to `'rohan-verma-seed-id'` or `'agency-seed-id-101'` when `req.user` is undefined. The database is seeded with valid UUIDs (`8467e35f-6a7f-4dad-a5e5-e8ab215d717e` and `58ce6b3f-bee7-4a2c-a9e0-5e6c27f7c40f`), so hitting these unauthenticated routes causes Prisma to throw foreign key constraint errors (`P2003`).
4. **Fictitious Payment & Escrow Processing**:
   - *Evidence*: `src/pages/CompareQuotesPage.tsx#L245`, `backend/src/services/booking.service.ts#L44-L53`.
   - *Impact*: No real Razorpay gateway transaction takes place. The backend creates random `order_` IDs and instantly marks payments `SUCCESS`. Users cannot actually pay, and agencies cannot receive real escrow transfers.
5. **Hardcoded Fallback JWT Secrets**:
   - *Evidence*: `backend/src/config/index.ts#L11-L12`.
   - *Impact*: If environment variables are absent in production, predictable default secrets (`traveller_access_secret_key_2026`) are used, allowing token forgery.

### Medium Severity
6. **Architecture Mismatch (SQLite vs. PostgreSQL Specification)**:
   - *Evidence*: `docs/database-design.md` specifies PostgreSQL 16+ with ENUMs; `backend/prisma/schema.prisma` implements SQLite with plain text strings.
   - *Impact*: Production deployments intending to use PostgreSQL will encounter dialect discrepancies (JSON handling, ENUM definitions, migrations).
7. **Silent Network Failure Masking in `ApiClient`**:
   - *Evidence*: `src/services/apiClient.ts` (10 instances of `catch (e) { ... return fallback }`).
   - *Impact*: Network crashes, 401 Unauthorized errors, and 500 Internal Server errors are swallowed silently, returning mock data and obscuring bugs.
8. **Missing Refresh Token Endpoint**:
   - *Evidence*: `docs/authentication.md#L29` documents `POST /auth/refresh`, but `backend/src/routes/auth.routes.ts` has no `/refresh` route.
9. **Non-Standard HTTP Status Code**:
   - *Evidence*: `backend/src/services/auth.service.ts#L71` throws `{ statusCode: 444, message: 'User not found' }` instead of 404.
10. **Hardcoded Admin Metrics and AI Match Scores**:
    - *Evidence*: `backend/src/controllers/admin.controller.ts#L18-L24`, `backend/src/services/ai.service.ts#L60-L65`.
    - *Impact*: Admin GMV is hardcoded to ₹48,50,000; AI quote scoring is a hardcoded `<=` ₹45,000 comparison.

### Low Severity
11. **Zero Test Automation**: Neither frontend nor backend contains unit, integration, or end-to-end tests.
12. **Unused Dependencies in Backend**: `lucide-react` is installed in `backend/package.json#L24` (a React UI icon library inside a Node API).
13. **Vite Deprecation Warning**: `vite.config.ts#L11` uses `__dirname` which generates a build warning under modern Vite native config loaders.

---

## 8. Code Conventions and Patterns

### Patterns Identified in Codebase
- **Component File Structure**: React components are placed in `src/pages/` or `src/components/layout/` as PascalCase named functional components with explicit interface props (e.g., `export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => { ... }`).
- **Routing Pattern**: Custom hash-based routing synced to browser history using `window.history.pushState` and `window.history.replaceState` listening on `popstate` in `src/App.tsx`.
- **Backend Architecture**: Layered architecture: Router (`routes/*.routes.ts`) -> Controller (`controllers/*.controller.ts`) -> Service (`services/*.service.ts`) -> Database (`lib/prisma.ts`).
- **Response Format**: Wrapped in a standard envelope via `backend/src/utils/response.ts`:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully"
  }
  ```
- **Styling Conventions**: Tailwind CSS utility classes combined with custom glassmorphism layers (`glass-card`, `glass-card-hover`, `ai-gradient-text`, `btn-primary-glow`) defined in `src/index.css`.

### Pattern Examples

#### 1. Backend Controller / Service Pattern
*From `backend/src/controllers/package.controller.ts` & `backend/src/services/package.service.ts`:*
```typescript
// Controller
export class PackageController {
  static async getPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { destination, maxPrice, page, limit } = req.query;
      const result = await PackageService.getAllPackages({
        destination: destination as string,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      return sendSuccess(res, result, 'Packages fetched');
    } catch (error) {
      next(error);
    }
  }
}
```

#### 2. Frontend API Service Pattern
*From `src/services/apiClient.ts`:*
```typescript
export class ApiClient {
  private static getHeaders() {
    const token = localStorage.getItem('traveller_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async fetchPackages(destination?: string, maxPrice?: number) {
    try {
      let url = `${API_BASE_URL}/packages?`;
      if (destination) url += `destination=${encodeURIComponent(destination)}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.packages) return json.data.packages;
      }
    } catch (e) {
      console.warn('API offline or unreachable, using local data fallback.');
    }
    return PACKAGES.filter(...);
  }
}
```

---

## 9. Remaining Work and Recommended Next Steps

| Step | Priority | Task Description | Target Files | Dependencies | Difficulty |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **1** | **P0 (Blocker)** | **Fix Backend Compilation Errors**: Cast `req.params.id as string` or normalize `Array.isArray(req.params.id)` across all 7 affected controllers to ensure `npm run build` succeeds under Express 5 types. | `backend/src/controllers/*.controller.ts` | None | **S** |
| **2** | **P0 (Security)** | **Enforce Route Authentication**: Apply `requireAuth` and `requireRole` middleware to all protected routes in `admin.routes.ts`, `agency.routes.ts`, `booking.routes.ts`, `user.routes.ts`, `wishlist.routes.ts`, and `message.routes.ts`. Remove fallback mock string IDs (`rohan-verma-seed-id`). | `backend/src/routes/*.routes.ts`, `backend/src/controllers/*.ts` | None | **M** |
| **3** | **P1 (Core Auth)** | **Wire Frontend Authentication & Session State**: Connect `LoginPage.tsx` and `SignupPage.tsx` to `ApiClient.loginUser()` and `registerUser()`. Implement a React AuthContext or store token in `localStorage` to persist logged-in user and role. | `src/pages/LoginPage.tsx`, `SignupPage.tsx`, `src/App.tsx`, `src/services/apiClient.ts` | Step 2 | **M** |
| **4** | **P1 (Missing API)** | **Implement Refresh Token Route**: Add `POST /auth/refresh` in `auth.routes.ts` reading HTTP-only cookie, and fix non-standard `444` error code in `auth.service.ts` to `404`. | `backend/src/routes/auth.routes.ts`, `backend/src/services/auth.service.ts` | None | **S** |
| **5** | **P1 (Core Flow)** | **Connect Trip Planner to Quote Comparison**: Pass the generated `tripRequestId` from `AITripPlannerPage` to `CompareQuotesPage` via navigation state or URL hash (e.g. `#/compare-quotes?id=...`) so live quotes are queried for the actual request. | `src/pages/AITripPlannerPage.tsx`, `src/pages/CompareQuotesPage.tsx`, `src/App.tsx` | Step 1, 2 | **M** |
| **6** | **P2 (Portals)** | **Connect Dashboards to Real APIs**: Replace hardcoded state in `TravellerDashboardPage.tsx`, `AgencyDashboardPage.tsx`, and `AdminPanelPage.tsx` with calls to their respective backend endpoints. | `src/pages/TravellerDashboardPage.tsx`, `AgencyDashboardPage.tsx`, `AdminPanelPage.tsx` | Step 2, 3 | **L** |
| **7** | **P2 (Payment)** | **Integrate Live / Test Razorpay SDK**: Implement frontend Razorpay checkout modal via `https://checkout.razorpay.com/v1/checkout.js` and server-side order generation with signature verification. | `src/pages/CompareQuotesPage.tsx`, `backend/src/services/booking.service.ts` | Valid Razorpay test keys | **L** |
| **8** | **P2 (AI)** | **Connect Real OpenAI Engine**: Configure valid `AI_API_KEY` and enhance `AIService.extractTripIntent` to prompt-engineer itemized quote comparison instead of static pricing threshold. | `backend/src/services/ai.service.ts` | Valid OpenAI API Key | **M** |
| **9** | **P3 (Database)** | **PostgreSQL Production Alignment**: Decide whether to migrate from SQLite to PostgreSQL 16+ as documented in `docs/database-design.md`, generating PostgreSQL migration scripts. | `backend/prisma/schema.prisma`, `backend/.env` | PostgreSQL instance | **M** |
| **10** | **P3 (Quality)** | **Establish Automated Test Suite**: Install Vitest for frontend component testing and Jest/Supertest for backend integration tests. | Root and backend `package.json` | Step 1 | **M** |

---

## 10. Open Questions for the Owner

1. **Target Production Database**: Should the platform remain on SQLite for MVP / single-instance deployment, or should it immediately be migrated to PostgreSQL 16+ as outlined in `docs/database-design.md`?
2. **Escrow & Payment Architecture**: Is Razorpay Route (Marketplace / Split Payments) intended for direct agency account transfers minus platform commission, or will all funds flow into a central company account with manual bank payouts initiated from the Admin Panel?
3. **API Keys & Credentials**: When will test/sandbox credentials for OpenAI (`gpt-4o-mini`) and Razorpay (`rzp_test_...`) be provisioned?
4. **Session / Global State Strategy**: Would you approve introducing a lightweight state manager (e.g., Zustand or React Context) to manage user authentication, current role (`TRAVELLER` vs `AGENCY` vs `ADMIN`), and active trip request context across pages?
5. **Media Storage for Agency KYC & Packages**: Cloudinary is referenced in docs and `.env` but has zero implementation. Should KYC documents and package photos be uploaded to Cloudinary, AWS S3, or local disk storage?

---

## 11. Handoff Checklist

### Top Files the Next Engineer Must Read First
1. `docs/backend-integration-plan.md`: The complete master architectural roadmap for the platform.
2. `backend/src/controllers/admin.controller.ts`: Immediate source of backend compilation failure (`tsc`).
3. `backend/src/routes/index.ts` & `backend/src/middleware/authGuard.ts`: Core routing hub and auth middleware that must be linked.
4. `backend/prisma/schema.prisma`: The central data contract defining all 15 system models.
5. `src/services/apiClient.ts`: Frontend HTTP client defining all backend communication points and fallbacks.
6. `src/App.tsx`: Routing engine, dynamic SEO configuration, and page mount controller.
7. `src/pages/AITripPlannerPage.tsx` & `src/pages/CompareQuotesPage.tsx`: The primary revenue-generating trip request to checkout user flow.
8. `src/data/mockData.ts`: Schema reference for all datasets currently powering the frontend.

### Fragile Components — Handle with Care
- **Custom Hash Router in `src/App.tsx`**: Uses direct `window.history.pushState` and `window.history.replaceState` coupled with a `popstate` listener. Do not casually replace with `react-router-dom` without ensuring all hash-based links across 14 pages and the navbar are preserved or migrated cleanly.
- **Tailwind v4 Setup in `src/index.css` & `vite.config.ts`**: Uses the newer `@tailwindcss/vite` v4 plugin rather than traditional `tailwind.config.js` or PostCSS configurations.
- **Prisma Schema Relations**: Models have cascading constraints (`User` -> `Profile`, `Agency`, `Wallet`). Manually modifying IDs in controllers will trigger foreign key violations.

### Items Unverified (Due to Environment / Missing Credentials)
- **Live OpenAI Trip Spec Extraction**: Unverified with live API due to placeholder `AI_API_KEY`.
- **Live Razorpay Payment Capture & Webhook Processing**: Unverified due to placeholder keys and absent Razorpay SDK instance.
- **WebSocket / Live Chat Communication**: Real-time communication between agency and traveller is currently unverified as WebSockets are not yet implemented.

