import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

export default function AdminLogin({ onLoginSuccess, onNavigateHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setErrorMessage(data.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Unable to connect to the authentication service. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        
        {/* Header */}
        <div className="admin-login-header">
          <img
            src={BUSINESS_CONFIG.logoSrc}
            alt={BUSINESS_CONFIG.brandName}
            className="admin-login-logo"
            width="84"
            height="84"
          />
          <div className="admin-login-badge">
            <ShieldCheck size={14} />
            <span>Admin Portal</span>
          </div>
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">
            Sign in to manage live pickle availability and stock
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="admin-error-banner" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-username">
              Username
            </label>
            <div className="admin-input-wrap">
              <User size={18} className="admin-input-icon" />
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                required
                className="admin-input"
                placeholder="Enter admin username (e.g. uday)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password with Show/Hide */}
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-input-wrap">
              <Lock size={18} className="admin-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="admin-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="admin-toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-submit-btn"
            disabled={isLoading}
            id="admin-login-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back to Public Site */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="admin-back-home-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Public Website</span>
        </button>

      </div>
    </div>
  );
}
