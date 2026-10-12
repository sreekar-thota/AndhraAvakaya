import React, { useState, useEffect } from 'react';
import { BUSINESS_CONFIG } from '../config/business';
import './WelcomeIntro.css';

/**
 * WelcomeIntro
 * Displays an elegant full-screen heritage welcome screen for Andhra Avakaya.
 * Features the official brand logo prominently centered, followed by
 * "Welcome to Andhra Avakaya", then smoothly reveals the website after 3-4s.
 */
const WelcomeIntro = () => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Respect accessibility settings for reduced motion
    const mediaQuery = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const prefersReducedMotion = mediaQuery ? mediaQuery.matches : false;

    if (prefersReducedMotion) {
      const reducedTimer = setTimeout(() => {
        setIsComplete(true);
      }, 350);
      return () => clearTimeout(reducedTimer);
    }

    // Temporarily lock body scroll while the full-screen intro is visible
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Start fading out logo, text, and background together after ~2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Complete the intro and cleanly unmount from DOM around ~3.5 seconds
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      document.body.style.overflow = originalOverflow;
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (isComplete) {
    return null;
  }

  // Logo asset from business configuration (points to /images/andhra_avakaya_logo.jpg)
  const logoSrc = BUSINESS_CONFIG.logoSrc || '/images/andhra_avakaya_logo.jpg';

  return (
    <div
      className={`welcome-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Welcome to Andhra Avakaya"
    >
      <div className="welcome-intro-content">
        {/* Prominent Centered Brand Logo */}
        <div className="welcome-intro-logo-wrapper">
          <img
            src={logoSrc}
            alt="Andhra Avakaya Brand Logo"
            className="welcome-intro-logo"
            width="200"
            height="200"
          />
        </div>

        {/* Welcome Title */}
        <h1 className="welcome-intro-title">
          <span className="welcome-intro-prefix">Welcome to</span>{' '}
          <span className="welcome-intro-brand">Andhra Avakaya</span>
        </h1>
      </div>
    </div>
  );
};

export default WelcomeIntro;
