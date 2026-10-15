import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

export default function Home({ user }) { // Yahan { user } prop accept karna zaroori hai
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxRent, setMaxRent] = useState('');

  // Fetch properties from backend API with filters
  const fetchProperties = async () => {
    try {
      let url = '/api/properties?';
      if (city) url += `city=${city}&`;
      if (propertyType) url += `propertyType=${propertyType}&`;
      if (maxRent) url += `maxRent=${maxRent}&`;

      const res = await fetch(url);
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="home-page">
      <Navbar user={user} />
      
      {/* Hero / Search Section */}
      <section className="hero-section">
        <h1>Find Your Perfect Student Accommodation or PG</h1>
        <form className="search-bar-form" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search by City..." 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
          />
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">All Types</option>
            <option value="PG">PG</option>
            <option value="Single Room">Single Room</option>
            <option value="Flat">Flat</option>
          </select>
          <input 
            type="number" 
            placeholder="Max Rent (₹)" 
            value={maxRent} 
            onChange={(e) => setMaxRent(e.target.value)} 
          />
          <button type="submit" className="btn-search">Search</button>
        </form>
      </section>

      {/* Property List Section */}
      <section className="listings-section">
        <h2>Available Properties</h2>
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} user={user} />
            ))
          ) : (
            <p className="no-results">No properties match your filter criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
}