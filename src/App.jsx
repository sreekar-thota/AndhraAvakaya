import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import WelcomeIntro from './components/WelcomeIntro';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductGrid from './components/ProductGrid';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminApp from './components/admin/AdminApp';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboardModal from './components/admin/AdminDashboardModal';
import { StockProvider } from './context/StockContext';
import { BUSINESS_CONFIG, getWhatsAppGeneralUrl } from './config/business';
import './App.css';
import './components/admin/AdminStyles.css';

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  // adminModalState: null | 'login' | 'dashboard'
  const [adminModalState, setAdminModalState] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hidden 3-click logo handler: Check session and open appropriate in-page modal
  const handleOpenAdminFromLogo = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/check-auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setAdminModalState('dashboard');
          return;
        }
      }
    } catch (err) {
      console.warn('Session check error:', err);
    }
    setAdminModalState('login');
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (adminModalState) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => document.body.classList.remove('scroll-locked');
  }, [adminModalState]);

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin') || window.location.hash === '#admin';

  return (
    <StockProvider>
      {isAdminRoute ? (
        <AdminApp onNavigateHome={navigateHome} />
      ) : (
        <div className="app-layout">
          {/* Initial Welcome Screen Intro */}
          <WelcomeIntro />

          {/* Top Navigation with hidden 3-click logo trigger */}
          <Navbar onOpenAdmin={handleOpenAdminFromLogo} />

          {/* Main Content Landmark */}
          <main id="main-content">
            <Hero />
            <About />
            <ProductGrid />
            <Contact />
          </main>

          {/* Footer (No admin links displayed) */}
          <Footer />

          {/* Persistent Floating WhatsApp Quick-Action */}
          <a
            href={getWhatsAppGeneralUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Instant WhatsApp Enquiry"
            title="Chat with us on WhatsApp"
            id="floating-whatsapp-action"
          >
            <MessageCircle size={24} />
            <span className="whatsapp-float-label">Enquire on WhatsApp</span>
          </a>

          {/* Admin Login Modal (Triggered by 3 clicks on logo) */}
          <AdminLoginModal
            isOpen={adminModalState === 'login'}
            onClose={() => setAdminModalState(null)}
            onLoginSuccess={() => setAdminModalState('dashboard')}
          />

          {/* Admin Inventory Dashboard Modal */}
          <AdminDashboardModal
            isOpen={adminModalState === 'dashboard'}
            onClose={() => setAdminModalState(null)}
            onLogout={() => setAdminModalState(null)}
          />
        </div>
      )}
    </StockProvider>
  );
}

export default App;
