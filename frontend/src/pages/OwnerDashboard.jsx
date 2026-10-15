import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OwnerDashboard.css';

export default function OwnerDashboard() {
    const [bookings, setBookings] = useState([]);
    const [myProperties, setMyProperties] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'listings'
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const fetchOwnerData = async () => {
        try {
            // Fetch Bookings
            const bookRes = await fetch('/api/bookings/owner', { credentials: 'include' });
            const bookData = await bookRes.json();
            if (bookRes.ok) setBookings(bookData);

            // Fetch My Listings
            const propRes = await fetch('/api/properties/owner/listings', { credentials: 'include' });
            const propData = await propRes.json();
            if (propRes.ok) setMyProperties(propData);
        } catch (err) {
            setError('Failed to load dashboard data');
        }
    };

    useEffect(() => {
        fetchOwnerData();
    }, []);

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to update status');

            setSuccessMsg(`Booking status updated to ${status}`);
            fetchOwnerData();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteProperty = async (propertyId, e) => {
        e.stopPropagation(); // Card click hokar details page par jane se roke
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                const res = await fetch(`/api/properties/${propertyId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to delete property');

                alert('Property deleted successfully!');
                fetchOwnerData();

            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="owner-dashboard-page">
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Owner Portal</h2>
                    <button className="btn-add-prop" onClick={() => navigate('/add-property')}>
                        + Add New Property
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}
                {successMsg && <p className="success-message">{successMsg}</p>}

                {/* Tab Navigation */}
                <div className="dashboard-tabs">
                    <button
                        className={activeTab === 'bookings' ? 'tab-btn active' : 'tab-btn'}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Booking Requests ({bookings.length})
                    </button>
                    <button
                        className={activeTab === 'listings' ? 'tab-btn active' : 'tab-btn'}
                        onClick={() => setActiveTab('listings')}
                    >
                        My Properties ({myProperties.length})
                    </button>
                </div>

                {/* Tab 1: Bookings */}
                {activeTab === 'bookings' && (
                    <div className="bookings-list">
                        {bookings.length > 0 ? (
    bookings.map((booking) => (
        <div key={booking._id} className="booking-item-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            
            {/* Larger Property Thumbnail (140px) */}
            {(() => {
                let propImg = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5";
                const rawImages = booking.property?.images;
                if (rawImages) {
                    if (Array.isArray(rawImages) && rawImages.length > 0) {
                        propImg = rawImages[0];
                    } else if (typeof rawImages === 'string') {
                        const splitImgs = rawImages.split(',').map(s => s.trim());
                        if (splitImgs[0]) propImg = splitImgs[0];
                    }
                }
                return (
                    <div style={{ width: '140px', height: '140px', minWidth: '140px', maxWidth: '140px', minHeight: '140px', maxHeight: '140px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                        <img
                            src={propImg}
                            alt="Property"
                            style={{ width: '140px', height: '140px', minWidth: '140px', minHeight: '140px', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                );
            })()}

            {/* Booking Info with proper spacing */}
            <div className="booking-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '1.25rem', margin: 0, color: '#1f2937' }}>{booking.property?.title || 'Property Removed'}</h4>
                <p className="property-loc" style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>📍 {booking.property?.locality}, {booking.property?.city} (₹{booking.property?.rent}/mo)</p>
                <div className="seeker-details" style={{ margin: 0, padding: '10px 12px' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Seeker:</strong> {booking.seeker?.name}</p>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Email:</strong> {booking.seeker?.email}</p>
                    <p style={{ margin: 0 }}><strong>Mobile:</strong> {booking.seeker?.mobileNo}</p>
                </div>
                {booking.message && <p className="seeker-message" style={{ margin: 0 }}>"{booking.message}"</p>}
            </div>

            {/* Right side actions spread out nicely */}
            <div className="booking-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px' }}>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                {booking.status === 'Pending' && (
                    <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-accept" onClick={() => handleStatusUpdate(booking._id, 'Accepted')}>Accept</button>
                        <button className="btn-reject" onClick={() => handleStatusUpdate(booking._id, 'Rejected')}>Reject</button>
                    </div>
                )}
            </div>
        </div>
    ))
) : (
    <p className="no-bookings">No incoming booking requests yet.</p>
)}
                    </div>
                )}

                {/* Tab 2: My Properties */}
                {activeTab === 'listings' && (
                    <div className="property-grid">
                        {myProperties.length > 0 ? (
                            myProperties.map((prop) => (
                                <div
                                    key={prop._id}
                                    className="property-card"
                                    onClick={() => navigate(`/property/${prop._id}`)}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    <div className="property-img-container">
                                        <img src={prop.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5"} alt={prop.title} />
                                        <span className="property-type-badge">{prop.propertyType}</span>
                                    </div>
                                    <div className="property-details">
                                        <h3>{prop.title}</h3>
                                        <p className="property-location">{prop.locality}, {prop.city}</p>
                                        <div className="property-pricing">
                                            <span className="rent-amount">₹{prop.rent} / mo</span>
                                            <span className="deposit-amount">Deposit: ₹{prop.deposit}</span>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDeleteProperty(prop._id, e)}
                                            style={{
                                                marginTop: '0.75rem',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.85rem',
                                                width: '100%'
                                            }}
                                        >
                                            Delete Property
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-bookings" style={{ gridColumn: '1/-1' }}>You haven't listed any properties yet. Click "+ Add New Property" above!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}