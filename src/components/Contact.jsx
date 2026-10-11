import React from 'react';
import { MessageCircle, Clock, MapPin, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppGeneralUrl } from '../config/business';

export default function Contact() {
  return (
    <section id="contact" className="contact-section section-padding" aria-label="Contact Andhra Avakaya">
      <div className="container">
        
        <div className="section-header">
          <div className="traditional-badge">
            <Sparkles size={14} />
            <span>Connect With Us</span>
          </div>
          <h2 className="section-title">
            Enquire & Order Direct
          </h2>
          <div className="traditional-divider" aria-hidden="true" />
          <p className="section-subtitle">
            We prepare our pickles in small, fresh batches. Send us a message on WhatsApp for 
            availability, customized spice preferences, and dispatch information.
          </p>
        </div>

        <div className="contact-card-box">
          <div className="contact-info-side">
            <div className="contact-brand-header">
              <img
                src={BUSINESS_CONFIG.logoSrc}
                alt="Andhra Avakaya Logo"
                className="contact-logo"
                width="64"
                height="64"
              />
              <div>
                <h3 className="contact-brand-title">{BUSINESS_CONFIG.brandName}</h3>
                <p className="contact-brand-tagline">{BUSINESS_CONFIG.tagline}</p>
              </div>
            </div>

            <p className="contact-message-body">
              Whether you are craving our signature fiery Avakaya, traditional Gongura, or 
              need fresh pickles prepared for festive celebrations, our family is here to assist you.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-row">
                <div className="contact-detail-icon text-mango">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="contact-detail-label">Enquiry Hours</span>
                  <span className="contact-detail-val">{BUSINESS_CONFIG.operatingHours}</span>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-detail-icon text-green">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="contact-detail-label">Origin & Heritage</span>
                  <span className="contact-detail-val">{BUSINESS_CONFIG.location}</span>
                </div>
              </div>
            </div>

            <div className="contact-guarantee-note">
              <ShieldCheck size={18} className="text-chilli" />
              <span>Direct WhatsApp communication ensures you receive fresh batch updates.</span>
            </div>
          </div>

          <div className="contact-cta-side">
            <div className="whatsapp-box-inner">
              <div className="whatsapp-badge-pill">
                <span className="status-indicator"></span>
                <span>Direct WhatsApp Support</span>
              </div>
              <h4 className="whatsapp-box-title">Start a Conversation</h4>
              <p className="whatsapp-box-desc">
                Have a question about spice level, jar quantities, or packaging? Click below to 
                chat with us instantly on WhatsApp.
              </p>

              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp contact-main-btn"
                id="contact-whatsapp-chat-btn"
              >
                <MessageCircle size={22} />
                <span>Chat with us on WhatsApp</span>
              </a>

              <p className="whatsapp-number-display">
                Registered Contact: <strong>{BUSINESS_CONFIG.displayPhone}</strong>
              </p>
              <span className="whatsapp-notice-sub">
                (Clicking opens WhatsApp with your pre-typed enquiry)
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
