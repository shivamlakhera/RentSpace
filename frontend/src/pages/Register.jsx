import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation Checks on relevant fields
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNo)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobileNo, password, role }),
        credentials: 'include'
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to register');

      localStorage.setItem('user', JSON.stringify(data.user));
      // Show Success Modal instead of immediate redirect
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Create a RentSpace Account</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Mobile Number (10 digits)</label>
            <input 
              type="text" 
              maxLength="10"
              value={mobileNo} 
              onChange={(e) => setMobileNo(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password (min 6 chars)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>I am a:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="seeker">Property Seeker (Student / Bachelor)</option>
              <option value="owner">Property Owner / Manager</option>
            </select>
          </div>
          <button type="submit" className="btn-auth">Register</button>
          <p className="auth-redirect">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>

      {/* Custom Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">🎉</div>
            <h3>Registration Successful!</h3>
            <p>Welcome to RentSpace. Your account has been created successfully.</p>
            <button 
              onClick={() => {
                setShowModal(false);
                navigate(role === 'owner' ? '/owner-dashboard' : '/');
              }}
              className="btn-modal-close"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}