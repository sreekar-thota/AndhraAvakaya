import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, ChevronRight } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppGeneralUrl } from '../config/business';

export default function Navbar({ onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoClicksRef = React.useRef(0);
  const clickTimeoutRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => document.body.classList.remove('scroll-locked');
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Our Products', href: '#products' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 3-Click hidden admin access trigger on the logo
  const handleLogoClick = (e) => {
    logoClicksRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (logoClicksRef.current >= 3) {
      e.preventDefault();
      logoClicksRef.current = 0;
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else {
      // Normal visitors: smooth scroll to top
      handleLinkClick(e, '#home');

      // Reset counter after 1.5 seconds if 3rd click is not made
      clickTimeoutRef.current = setTimeout(() => {
        logoClicksRef.current = 0;
      }, 1500);
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'site-header-scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo & Name with 3-click hidden trigger */}
        <a 
          href="#home" 
          className="brand-link" 
          onClick={handleLogoClick}
          aria-label="Andhra Avakaya Home"
          id="navbar-brand-logo-link"
        >
          <img 
            src={BUSINESS_CONFIG.logoSrc} 
            alt="Andhra Avakaya Business Logo" 
            className="brand-logo"
            width="52"
            height="52"
          />
          <div className="brand-text-group">
            <span className="brand-title">{BUSINESS_CONFIG.brandName}</span>
            <span className="brand-tagline">Authentic Homemade</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="nav-item"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* WhatsApp CTA & Mobile Toggle */}
        <div className="nav-actions">
          <a
            href={getWhatsAppGeneralUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp nav-whatsapp-btn"
            aria-label="Enquire with Andhra Avakaya on WhatsApp"
          >
            <MessageCircle size={18} aria-hidden="true" />
            <span className="btn-text">WhatsApp Enquiry</span>
          </a>

          {/* Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <div 
        className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-header">
          <div className="brand-text-group">
            <span className="brand-title">{BUSINESS_CONFIG.brandName}</span>
            <span className="brand-tagline">{BUSINESS_CONFIG.tagline}</span>
          </div>
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav-list">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="mobile-nav-item"
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              <span>{link.name}</span>
              <ChevronRight size={18} className="chevron-icon" />
            </a>
          ))}
        </nav>

        <div className="mobile-menu-footer">
          <p className="mobile-footer-tagline">Traditional Andhra pickles made fresh with love.</p>
          <a
            href={getWhatsAppGeneralUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mobile-whatsapp-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MessageCircle size={20} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
