import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';

export default function PropertyCard({ property, user }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Agar user logged-in nahi hai, toh login page par redirect karo
    if (!user) {
      alert("Please login first to view property details!");
      navigate('/login');
    } else {
      // Agar logged-in hai, toh property details page par jao
      navigate(`/property/${property._id}`);
    }
  };

  // Local uploads ke liye backend URL prepend karna
  const rawImg = property.images?.[0];
  const propertyImg = rawImg 
    ? (rawImg.startsWith('http') ? rawImg : `${rawImg}`)
    : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5";

  return (
    <div className="property-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="property-img-container">
        <img src={propertyImg} alt={property.title} />
        <span className="property-type-badge">{property.propertyType}</span>
      </div>
      <div className="property-details">
        <h3>{property.title}</h3>
        <p className="property-location">{property.locality}, {property.city}</p>
        <div className="property-pricing">
          <span className="rent-amount">₹{property.rent} / mo</span>
          <span className="deposit-amount">Dep: ₹{property.deposit}</span>
        </div>
      </div>
    </div>
  );
}