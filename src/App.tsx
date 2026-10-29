import { useState, useEffect } from 'react';
import type { PageRoute } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SEOHead } from './components/layout/SEOHead';
import { AIChatbotWidget } from './components/layout/AIChatbotWidget';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { ExplorePackagesPage } from './pages/ExplorePackagesPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { BecomeAgencyPage } from './pages/BecomeAgencyPage';
import { AITripPlannerPage } from './pages/AITripPlannerPage';
import { CompareQuotesPage } from './pages/CompareQuotesPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { TravellerDashboardPage } from './pages/TravellerDashboardPage';
import { AgencyDashboardPage } from './pages/AgencyDashboardPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

const VALID_ROUTES: PageRoute[] = [
  'home', 'about', 'contact', 'blog', 'packages', 'destinations',
  'become-agency', 'ai-planner', 'compare-quotes', 'login', 'signup',
  'traveller-dashboard', 'agency-dashboard', 'admin-panel'
];

const getRouteFromHash = (): PageRoute => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return VALID_ROUTES.includes(hash as PageRoute) ? (hash as PageRoute) : 'home';
};

function AppContent() {
  const [currentRoute, setCurrentRouteState] = useState<PageRoute>(getRouteFromHash);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { sessions, loading } = useAuth();

  // Sync route with browser history (PushState & PopState for Undo / Redo Navigation)
  const handleNavigate = (route: PageRoute) => {
    setCurrentRouteState(route);
    const targetHash = `#/${route}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState({ route }, '', targetHash);
    }
  };

  // Handle Browser Back / Forward (Undo / Redo navigation)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const route = (e.state && e.state.route) ? e.state.route : getRouteFromHash();
      setCurrentRouteState(route);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state if none exists
    const initialRoute = getRouteFromHash();
    if (!window.history.state) {
      window.history.replaceState({ route: initialRoute }, '', `#/${initialRoute}`);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Route protection redirect
  useEffect(() => {
    if (loading) return;

    if (currentRoute === 'traveller-dashboard' && !sessions.traveller) {
      handleNavigate('login');
    } else if (currentRoute === 'agency-dashboard' && !sessions.agency) {
      handleNavigate('login');
    } else if (currentRoute === 'admin-panel' && !sessions.admin) {
      handleNavigate('login');
    }
  }, [currentRoute, sessions, loading]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Dynamic SEO Data for Each Page
  const getSEOConfig = () => {
    switch (currentRoute) {
      case 'home':
        return {
          title: 'Direct-to-Local AI Travel Marketplace',
          description: 'Post your customized trip request to Sikkim & Shimla. Receive itemized quotes directly from verified local travel agencies, compared by AI.',
        };
      case 'traveller-dashboard':
        return {
          title: 'Traveller Dashboard — Manage Requests, Quotes & Escrow',
          description: 'Access active trip requests, side-by-side quote comparison matrix, Razorpay escrow holds, and agency messages.',
        };
      case 'agency-dashboard':
        return {
          title: 'Agency Portal — Lead Inbox, Quote Builder & Wallet',
          description: 'Receive direct customer leads, build custom quotations, manage bookings, and request bank payouts.',
        };
      case 'admin-panel':
        return {
          title: 'Admin Control Portal — Agency KYC & Escrow Operations',
          description: 'Approve local agency KYC verification, manage platform GMV, and release Razorpay escrow payments.',
        };
      case 'about':
        return {
          title: 'About Our Mission & Pilot Launch',
          description: 'Learn how Traveller is eliminating middleman travel commission fees and empowering local mountain agencies in Sikkim and Himachal Pradesh.',
        };
      case 'contact':
        return {
          title: 'Contact Support & Regional Offices',
          description: 'Get 24/7 support from Traveller destination team in Gangtok & Shimla. Sub-45 minute response SLA.',
        };
      case 'blog':
        return {
          title: 'Himalayan Travel Guides & Advice Journal',
          description: 'Read local travel guides, Nathula Pass permit tips, and direct booking hacks from native Sikkimese operators.',
        };
      case 'packages':
        return {
          title: 'Explore Verified Sikkim & Shimla Packages',
          description: 'Browse pre-built local packages published by top-rated Sikkim and Shimla travel agencies.',
        };
      case 'destinations':
        return {
          title: 'Himalayan Pilot Destinations — Sikkim & Shimla',
          description: 'Discover Gangtok, Yumthang Valley, Nathula Pass, Shimla, and Kufri retreats.',
        };
      case 'become-agency':
        return {
          title: 'Register Travel Agency — Receive Verified Leads',
          description: 'Join 50+ verified local travel agencies receiving high-intent customer leads in Gangtok and Shimla.',
        };
      case 'ai-planner':
        return {
          title: 'AI Trip Request Wizard & Intent Extractor',
          description: 'Structured OpenAI intent extraction for custom travel requests. Broadcasts directly to native destination agencies.',
        };
      case 'compare-quotes':
        return {
          title: 'Compare 3 Live Agency Quotations Side-by-Side',
          description: 'AI quote matrix comparing hotel star ratings, Innova vehicle guarantees, included permits, and price breakdowns.',
        };
      case 'login':
        return {
          title: 'Sign In — Traveller & Agency Portal',
          description: 'Access your trip requests, quotation comparison matrix, or agency lead dashboard.',
        };
      case 'signup':
        return {
          title: 'Create Account — Traveller or Local Agency',
          description: 'Register for free to start posting custom trip requests or receiving agency leads.',
        };
      default:
        return {
          title: 'AI Travel Marketplace',
          description: 'Book directly with verified local travel agencies.',
        };
    }
  };

  const seo = getSEOConfig();

  // Render Portals cleanly without marketing layout wrapper
  if (currentRoute === 'traveller-dashboard') {
    if (!sessions.traveller && !loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <LoginPage onNavigate={handleNavigate} initialRole="traveller" />
        </div>
      );
    }
    return (
      <>
        <SEOHead title={seo.title} description={seo.description} />
        <TravellerDashboardPage onNavigate={handleNavigate} />
      </>
    );
  }

  if (currentRoute === 'agency-dashboard') {
    if (!sessions.agency && !loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <LoginPage onNavigate={handleNavigate} initialRole="agency" />
        </div>
      );
    }
    return (
      <>
        <SEOHead title={seo.title} description={seo.description} />
        <AgencyDashboardPage onNavigate={handleNavigate} />
      </>
    );
  }

  if (currentRoute === 'admin-panel') {
    if (!sessions.admin && !loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <LoginPage onNavigate={handleNavigate} initialRole="admin" />
        </div>
      );
    }
    return (
      <>
        <SEOHead title={seo.title} description={seo.description} />
        <AdminPanelPage onNavigate={handleNavigate} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-300">
      
      {/* SEO Head Manager */}
      <SEOHead title={seo.title} description={seo.description} />

      {/* Glassmorphism Header */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Router */}
      <main className="flex-grow">
        {currentRoute === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentRoute === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'blog' && <BlogPage />}
        {currentRoute === 'packages' && <ExplorePackagesPage onNavigate={handleNavigate} />}
        {currentRoute === 'destinations' && <DestinationsPage onNavigate={handleNavigate} />}
        {currentRoute === 'become-agency' && <BecomeAgencyPage onNavigate={handleNavigate} />}
        {currentRoute === 'ai-planner' && <AITripPlannerPage onNavigate={handleNavigate} />}
        {currentRoute === 'compare-quotes' && <CompareQuotesPage onNavigate={handleNavigate} />}
        {currentRoute === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentRoute === 'signup' && <SignupPage onNavigate={handleNavigate} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating 24/7 AI Travel Support Chatbot Widget */}
      <AIChatbotWidget onNavigate={handleNavigate} />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
