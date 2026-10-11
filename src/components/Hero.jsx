import React from 'react';
import { ArrowDownRight, MessageCircle, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppGeneralUrl } from '../config/business';
import AccordionGallery from './AccordionGallery';
import { avakayaGalleryItems } from '../data/gallery';

export default function Hero() {
  const scrollToProducts = (e) => {
    e.preventDefault();
    const element = document.getElementById('products');
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section" aria-label="Welcome to Andhra Avakaya">
      <div className="container hero-container">
        
        {/* Hero Left Content Column */}
        <div className="hero-content">
          <div className="traditional-badge hero-badge">
            <Sparkles size={14} className="badge-sparkle" />
            <span>Handmade in Small Batches</span>
          </div>

          <h1 className="hero-title">
            The Authentic Taste of <span className="text-chilli hero-highlight">Andhra</span>
          </h1>

          <p className="hero-description">
            Experience the fiery, pungent, and soulful flavours of traditional Andhra Pradesh. 
            Prepared with hand-cut unripened mangoes, stone-pounded Guntur red chillies, fragrant 
            mustard paste, and pure cold-pressed sesame oil, each recipe brings the warmth of 
            authentic homemade culinary heritage straight to your dining table.
          </p>

          {/* Action CTAs */}
          <div className="hero-ctas">
            <a
              href="#products"
              onClick={scrollToProducts}
              className="btn btn-primary hero-btn-primary"
              id="hero-explore-products-btn"
            >
              <span>Explore Our Products</span>
              <ArrowDownRight size={18} />
            </a>

            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary hero-btn-whatsapp"
              id="hero-whatsapp-enquire-btn"
            >
              <MessageCircle size={18} className="whatsapp-icon-color" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>

          {/* Value Highlights Pill Row */}
          <div className="hero-features-row">
            <div className="hero-feature-pill">
              <span className="feature-dot"></span>
              <span>100% Traditional Recipe</span>
            </div>
            <div className="hero-feature-pill">
              <span className="feature-dot"></span>
              <span>Pure Cold-Pressed Oils</span>
            </div>
            <div className="hero-feature-pill">
              <span className="feature-dot"></span>
              <span>Ceramic Bharani Matured</span>
            </div>
          </div>
        </div>

        {/* Hero Right Visual Column — Interactive AccordionGallery */}
        <div className="hero-visual">
          <div className="hero-gallery-wrapper">
            <AccordionGallery
              items={avakayaGalleryItems}
              defaultIndex={0}
              accentColor="#F2B544"
              overlayColor="#38271D"
              textColor="#FFF8EC"
              height={400}
              gap={8}
              radius={22}
              expandRatio={0.58}
              trigger="hover"
              grayscale={false}
              showLabels={true}
              duration={0.6}
              tilt={0}
              parallax={0.25}
            />

            {/* Floating Brand Stamp Card */}
            <div className="hero-floating-card">
              <div className="floating-stamp-icon">
                <img 
                  src={BUSINESS_CONFIG.logoSrc} 
                  alt="Andhra Avakaya Emblem" 
                  width="40" 
                  height="40" 
                />
              </div>
              <div className="floating-stamp-content">
                <span className="stamp-title">Matured to Perfection</span>
                <span className="stamp-sub">Uncompromised Andhra Heat</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Bottom Wave / Border Accent */}
      <div className="hero-bottom-accent" aria-hidden="true" />
    </section>
  );
}
