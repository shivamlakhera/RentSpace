import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check auth status from backend cookie on load
  useEffect(() => {
    fetch('/api/auth/me', {
      credentials: 'include' // Sends the HTTP-only cookie automatically
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h2>RentSpace</h2>
      </div>
      <div className="navbar-links">
        <a href="/" className="nav-link">Home</a>

        {/* Agar user Owner hai */}
        {user?.role === 'owner' && (
          <a href="/owner-dashboard" className="nav-link">Owner Dashboard</a>
        )}

        {/* Agar user Seeker hai */}
        {user?.role === 'seeker' && (
          <a href="/seeker-dashboard" className="nav-link">My Bookings</a>
        )}

        {user ? (
          <button onClick={handleLogout} className="nav-link btn-register" style={{ cursor: 'pointer', border: 'none' }}>
            Logout ({user.name})
          </button>
        ) : (
          <>
            <a href="/login" className="nav-link btn-login">Login</a>
            <a href="/register" className="nav-link btn-register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}