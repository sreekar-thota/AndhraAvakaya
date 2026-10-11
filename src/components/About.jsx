import React from 'react';
import { Sparkles, Utensils, Sun, HeartHandshake, Leaf } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import DepthCarousel from './DepthCarousel';
import { aboutGalleryItems } from '../data/aboutGallery';

export default function About() {
  return (
    <section id="about" className="about-section section-padding" aria-label="About Andhra Avakaya">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="traditional-badge">
            <Sparkles size={14} />
            <span>Our Heritage & Craft</span>
          </div>
          <h2 className="section-title">
            Rooted in the Soul of <span className="text-chilli">Andhra</span>
          </h2>
          <div className="traditional-divider" aria-hidden="true" />
          <p className="section-subtitle">
            Every bottle of Andhra Avakaya is crafted to preserve the centuries-old legacy 
            of Andhra kitchens — unapologetically spicy, intensely aromatic, and prepared with unwavering care.
          </p>
        </div>

        {/* Story Grid */}
        <div className="about-grid">
          
          {/* Left Column: 3D DepthCarousel Showcase */}
          <div className="about-visual-card">
            <div className="about-carousel-container">
              <DepthCarousel
                items={aboutGalleryItems}
                cardWidth={300}
                cardHeight={420}
                radius={20}
                tint="#38271D"
                depth={150}
                spread={65}
                tilt={18}
                tiltDirection="right"
                perspective={1400}
                visibleCards={4}
                falloff={0.16}
                blur={4}
                duration={700}
                autoplay={true}
                autoplayDelay={3500}
                loop={true}
                showControls={true}
                showIndicators={true}
              />
            </div>

            {/* Traditional Culinary Quote */}
            <div className="about-carousel-caption">
              <p className="about-quote-sub">
                “Pickles in Andhra aren't just a condiment — they are the heartbeat of every family feast.”
              </p>
            </div>
          </div>

          {/* Right Column: Text Story & Commitments */}
          <div className="about-narrative">
            <h3 className="narrative-heading">
              Preserving the Real Taste of Home
            </h3>
            <p className="narrative-text">
              At <strong>{BUSINESS_CONFIG.brandName}</strong>, our journey began with a simple belief: 
              modern mass-produced food can never capture the soul of grandmother's kitchen. We set 
              out to revive the original, unadulterated methods of South Indian pickling.
            </p>
            <p className="narrative-text">
              We carefully source firm, fibrous sour mangoes from local orchards, stone-pound pungent 
              mustard seeds to unleash their sharp aroma, and use only sun-dried Guntur chillies renowned 
              for their vibrant red crimson hue and spirited bite. Everything is blended with cold-pressed 
              sesame oil and cured naturally inside traditional earthenware jars (Bharanis).
            </p>

            {/* Quality Commitment Pillars */}
            <div className="about-pillars-grid">
              <div className="pillar-item">
                <div className="pillar-icon-wrap">
                  <Sun size={20} className="pillar-icon text-mango" />
                </div>
                <div>
                  <h4 className="pillar-title">Sun-Cured Naturally</h4>
                  <p className="pillar-desc">Aged in traditional ceramic jars without artificial accelerators.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-wrap">
                  <Leaf size={20} className="pillar-icon text-green" />
                </div>
                <div>
                  <h4 className="pillar-title">Cold-Pressed Oils</h4>
                  <p className="pillar-desc">Only wholesome sesame (til) and groundnut oils for authentic aroma.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-wrap">
                  <Utensils size={20} className="pillar-icon text-chilli" />
                </div>
                <div>
                  <h4 className="pillar-title">Stone-Ground Spices</h4>
                  <p className="pillar-desc">Freshly roasted spices powdered to preserve volatile essential oils.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-wrap">
                  <HeartHandshake size={20} className="pillar-icon text-mango" />
                </div>
                <div>
                  <h4 className="pillar-title">Small-Batch Integrity</h4>
                  <p className="pillar-desc">Prepared in artisan quantities ensuring uncompromised homemade quality.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
