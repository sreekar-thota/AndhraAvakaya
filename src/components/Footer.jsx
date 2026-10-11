import React from 'react';
import { MessageCircle, Heart, ArrowUp } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppGeneralUrl } from '../config/business';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-logo-wrap">
            <img
              src={BUSINESS_CONFIG.logoSrc}
              alt="Andhra Avakaya Emblem"
              className="footer-logo"
              width="50"
              height="50"
            />
            <span className="footer-brand-title">{BUSINESS_CONFIG.brandName}</span>
          </div>
          <p className="footer-brand-desc">
            Traditional Andhra homemade pickles prepared with reverence to authentic family recipes, 
            stone-pounded spices, and pure unadulterated passion.
          </p>
          <div className="footer-whatsapp-action">
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-link"
              aria-label="Direct WhatsApp Message"
            >
              <MessageCircle size={18} />
              <span>Enquire via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-col">
          <h4 className="footer-heading">Quick Navigation</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a>
            </li>
            <li>
              <a href="#about" onClick={(e) => scrollToSection(e, '#about')}>About Our Story</a>
            </li>
            <li>
              <a href="#products" onClick={(e) => scrollToSection(e, '#products')}>Discover Our Pickles</a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Contact & Orders</a>
            </li>
          </ul>
        </div>

        {/* Authentic Heritage Note Column */}
        <div className="footer-note-col">
          <h4 className="footer-heading">Authentic Heritage</h4>
          <p className="footer-note-text">
            Handcrafted in Andhra Pradesh, India. All pickle recipes undergo traditional sunlight 
            and Bharani maturation for enduring flavor and wholesome purity.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            &copy; {currentYear} {BUSINESS_CONFIG.brandName}. All rights reserved.
          </p>
          <p className="footer-credit">
            Crafted with traditional love for authentic Andhra taste.
          </p>
        </div>
      </div>
    </footer>
  );
}
