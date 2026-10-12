import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Loader2 } from 'lucide-react';
import './AdminStyles.css';

export default function AdminApp({ onNavigateHome }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/check-auth');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setIsAuthenticated(!!data.authenticated);
          }
        } else {
          if (isMounted) setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="admin-loading-screen" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF6EE',
        color: '#4A1E0E',
        gap: '1rem',
        fontFamily: "'Playfair Display', Georgia, serif"
      }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#D9381E' }} />
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Verifying secure session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <AdminLogin
      onLoginSuccess={handleLoginSuccess}
      onNavigateHome={onNavigateHome}
    />
  );
}
