import React from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductGrid from './components/ProductGrid';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { BUSINESS_CONFIG, getWhatsAppGeneralUrl } from './config/business';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content">
        <Hero />
        <About />
        <ProductGrid />
        <Contact />
      </main>

      {/* Footer */}
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
    </div>
  );
}

export default App;
