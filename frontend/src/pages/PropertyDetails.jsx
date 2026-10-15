import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PropertyDetails.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Image Modal state for fullscreen view
  const [isModalOpen, setIsModalOpen] = useState(false);

  // LocalStorage se logged-in user ki info nikalna
  const storedUser = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    fetch(`/api/properties/${id}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Property not found');
        return res.json();
      })
      .then(data => {
        setProperty(data);
        
        let parsedImages = [];
        if (data.images) {
          if (Array.isArray(data.images)) {
            data.images.forEach(item => {
              if (typeof item === 'string' && item.includes(',')) {
                parsedImages.push(...item.split(',').map(s => s.trim()));
              } else if (item) {
                parsedImages.push(item);
              }
            });
          } else if (typeof data.images === 'string') {
            parsedImages = data.images.split(',').map(s => s.trim());
          }
        }
        
        if (parsedImages.length === 0) {
          parsedImages = ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5"];
        }

        setImagesList(parsedImages);
        setActiveImage(parsedImages[0]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: id, message }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send booking request');

      setSuccess('Booking request sent successfully to the owner!');
      setMessage('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading property details...</div>;
  if (error || !property) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'red' }}>{error || 'Property not found.'}</div>;
// Safe comparison ke liye IDs ko string mein convert karke check karna
const ownerId = typeof property.owner === 'object' ? property.owner?._id || property.owner?.id : property.owner;
const currentUserId = storedUser?._id || storedUser?.id;

const isOwner = Boolean(storedUser && ownerId && String(ownerId) === String(currentUserId));
  return (
    <div className="property-details-page">
      <Navbar />
      <div className="details-container">
        
        {/* Left Side: Multi-Image Gallery & Full Details */}
        <div className="details-main-content">
          <div className="image-gallery-container">
            
            {/* Main Image view with click to zoom modal feature */}
            <div className="main-image-view" onClick={() => setIsModalOpen(true)} style={{ cursor: 'zoom-in', position: 'relative' }} title="Click to view full image">
              <img 
                src={activeImage.startsWith('http') ? activeImage : `${activeImage}`} 
                alt={property.title} 
              />
              <span className="zoom-hint-badge" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>🔍 Click to Zoom</span>
            </div>

            {/* Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div className="thumbnail-strip">
                {imagesList.map((img, index) => {
                  const thumbUrl = img.startsWith('http') ? img : `${img}`;
                  return (
                    <img 
                      key={index}
                      src={thumbUrl} 
                      alt={`Thumbnail ${index + 1}`} 
                      className={activeImage === img ? 'thumbnail-img active' : 'thumbnail-img'}
                      onClick={() => setActiveImage(img)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <h1>{property.title}</h1>
          <p className="property-location-text">📍 {property.locality || property.address}, {property.city} ({property.propertyType})</p>

          <div className="pricing-box">
            <span className="big-rent">₹{property.rent} <small>/ month</small></span>
            <span className="deposit-tag">Security Deposit: ₹{property.deposit}</span>
          </div>

          {/* Amenities Section */}
          <div className="section-block">
            <h3>Amenities</h3>
            <ul className="amenities-list">
              {property.amenities && Object.entries(property.amenities).map(([key, value]) => (
                value ? <li key={key}>✅ {key.toUpperCase()}</li> : null
              ))}
            </ul>
          </div>

          {/* House Rules Section */}
          {property.rules && (
            <div className="section-block">
              <h3>House Rules</h3>
              <p className="rules-text">{property.rules}</p>
            </div>
          )}
        </div>

        {/* Right Side: Conditional Sidebar (Owner vs Seeker) */}
        <div className="booking-sidebar">
          {isOwner ? (
            <div className="booking-card owner-info-card">
              <h3>Owner Controls</h3>
              <p>You own this property listing. Seeker booking options are hidden.</p>
              <button 
                type="button" 
                className="btn-book-now" 
                style={{ background: '#4f46e5', marginTop: '15px' }}
                onClick={() => navigate('/owner-dashboard')}
              >
                Go to Owner Dashboard
              </button>
            </div>
          ) : (
            <div className="booking-card">
              <h3>Interested in this property?</h3>
              <p>Send an enquiry directly to the owner.</p>
              
              {success && <p className="success-msg" style={{ color: 'green', fontSize: '0.9rem' }}>{success}</p>}
              {error && <p className="error-msg" style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Message to Owner</label>
                  <textarea 
                    rows="4" 
                    placeholder="Hi, I am interested. Is this room available for next month?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-book-now">Send Booking Request</button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {isModalOpen && (
        <div className="image-modal-overlay" onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'zoom-out' }}>
          <div className="image-modal-content" style={{ position: 'relative', width: '95vw', height: '95vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '10px', right: '15px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>&times;</button>
            <img 
              src={activeImage.startsWith('http') ? activeImage : `${activeImage}`} 
              alt="Big screen view" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}