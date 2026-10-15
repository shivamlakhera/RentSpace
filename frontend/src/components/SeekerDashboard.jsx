import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../pages/OwnerDashboard.css'; // Aap chahein toh seeker ke liye alag CSS bhi bana sakte hain

export default function SeekerDashboard({ user }) {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/bookings/seeker', { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch bookings');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setBookings(data);
            })
            .catch(err => setError('Failed to load your booking requests'));
    }, []);

    return (
        <div className="owner-dashboard-page">
            <Navbar user={user} />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>My Booking Requests</h2>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="bookings-list">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div 
                                key={booking._id} 
                                className="booking-item-card" 
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                            >
                                {/* Property Thumbnail */}
                                <div style={{ width: '130px', height: '130px', minWidth: '130px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                                    <img
                                        src={booking.property?.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5"}
                                        alt="Property"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Booking Details */}
                                <div className="booking-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h4 style={{ fontSize: '1.2rem', margin: 0, color: '#1f2937' }}>
                                        {booking.property?.title || 'Property Removed'}
                                    </h4>
                                    <p className="property-loc" style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
                                        📍 {booking.property?.locality}, {booking.property?.city} (₹{booking.property?.rent}/mo)
                                    </p>
                                    
                                    {booking.message && (
                                        <p className="seeker-message" style={{ margin: 0 }}>
                                            <strong>Your Note:</strong> "{booking.message}"
                                        </p>
                                    )}

                                    {/* Contact Reveal Mechanism */}
                                    {booking.status === 'Accepted' ? (
                                        <div style={{ background: '#d1fae5', padding: '10px 12px', borderRadius: '8px', marginTop: '6px', color: '#065f46', fontSize: '0.9rem', border: '1px solid #a7f3d0' }}>
                                            <p style={{ margin: '0 0 4px 0' }}><strong>🎉 Booking Accepted! Owner Contact Unlocked:</strong></p>
                                            <p style={{ margin: '0 0 2px 0' }}><strong>Name:</strong> {booking.owner?.name}</p>
                                            <p style={{ margin: '0 0 2px 0' }}><strong>Email:</strong> {booking.owner?.email}</p>
                                            <p style={{ margin: 0 }}><strong>Mobile:</strong> {booking.owner?.mobileNo}</p>
                                        </div>
                                    ) : (
                                        <div style={{ background: '#fef3c7', padding: '8px 12px', borderRadius: '8px', marginTop: '6px', color: '#b45309', fontSize: '0.85rem', border: '1px solid #fde68a' }}>
                                            🔒 Owner contact details will appear here once the booking request is accepted.
                                        </div>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="booking-actions">
                                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                          {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-bookings">You haven't made any booking requests yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}