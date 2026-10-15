import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import OwnerDashboard from './pages/OwnerDashboard';
import AddProperty from './pages/AddProperty';
import SeekerDashboard from './components/SeekerDashboard';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Auth check hone tak ka loading state

  // App load hote hi cookie check karo ki kaun logged-in hai
  useEffect(() => {
    fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include' // HTTP-only cookie ke liye zaroori hai
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        setUser(data);
        setAuthLoading(false);
      })
      .catch(() => {
        setUser(null);
        setAuthLoading(false);
      });
  }, []);

  // Jab tak backend se pata nahi chal jata ki user logged-in hai ya nahi, tab tak rukho
  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem', color: '#555' }}>Loading RentSpace...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/property/:id" element={<PropertyDetails user={user} />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard user={user} />} />
        <Route path="/seeker-dashboard" element={<SeekerDashboard user={user} />} />
        <Route path="/add-property" element={<AddProperty user={user} />} />
      </Routes>
    </Router>
  );
}