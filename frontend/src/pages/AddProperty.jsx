import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AddProperty.css';

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    locality: '',
    propertyType: 'PG',
    rent: '',
    deposit: '',
    amenities: { wifi: false, ac: false, foodFacility: false, laundry: false },
    rules: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        amenities: { ...prev.amenities, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation Checks on relevant fields
    if (!formData.title.trim()) {
      setError('Please enter a property title.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter the city name.');
      return;
    }
    if (!formData.locality.trim()) {
      setError('Please enter the locality or area.');
      return;
    }
    if (Number(formData.rent) <= 0) {
      setError('Rent must be a valid positive number.');
      return;
    }
    if (Number(formData.deposit) < 0) {
      setError('Security deposit cannot be negative.');
      return;
    }
    if (imageFiles.length === 0) {
      setError('Please select at least one property photo.');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('city', formData.city);
      data.append('locality', formData.locality);
      data.append('propertyType', formData.propertyType);
      data.append('rent', Number(formData.rent));
      data.append('deposit', Number(formData.deposit));
      data.append('amenities', JSON.stringify(formData.amenities));
      data.append('rules', formData.rules);

      // Multiple image files ko append karna
      imageFiles.forEach(file => {
        data.append('images', file);
      });

      const res = await fetch('/api/properties', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to create property');
      
      setSuccessMsg('Property listed successfully!');
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-property-page">
      <Navbar />
      <div className="form-container">
        <form className="property-form" onSubmit={handleSubmit}>
          <h2>Add New Rental Property</h2>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>Property Title</label>
            <input type="text" name="title" placeholder="e.g. Sunrise Luxury PG for Students" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="e.g. Indore" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Locality / Area</label>
              <input type="text" name="locality" placeholder="e.g. Vijay Nagar" value={formData.locality} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
                <option value="PG">PG</option>
                <option value="Single Room">Single Room</option>
                <option value="Flat">Flat</option>
              </select>
            </div>
            <div className="form-group">
              <label>Monthly Rent (₹)</label>
              <input type="number" name="rent" placeholder="6000" min="1000" value={formData.rent} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Security Deposit (₹)</label>
              <input type="number" name="deposit" placeholder="10000" min="0" value={formData.deposit} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="wifi" checked={formData.amenities.wifi} onChange={handleChange} /> Wi-Fi</label>
              <label><input type="checkbox" name="ac" checked={formData.amenities.ac} onChange={handleChange} /> AC</label>
              <label><input type="checkbox" name="foodFacility" checked={formData.amenities.foodFacility} onChange={handleChange} /> Food / Mess</label>
              <label><input type="checkbox" name="laundry" checked={formData.amenities.laundry} onChange={handleChange} /> Laundry</label>
            </div>
          </div>

          <div className="form-group">
            <label>House Rules</label>
            <textarea name="rules" rows="3" placeholder="e.g. No smoking, gates close at 10 PM" value={formData.rules} onChange={handleChange} />
          </div>

          {/* File Upload Input */}
          <div className="form-group">
            <label>Property Photos (Select multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              required
            />
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>{imageFiles.length} file(s) selected</small>
          </div>

          <button type="submit" className="btn-submit">Publish Property</button>
        </form>
      </div>

      {/* Custom Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">🎉</div>
            <h3>Success!</h3>
            <p>{successMsg || 'Property listed successfully!'}</p>
            <button 
              onClick={() => {
                setShowModal(false);
                navigate('/owner-dashboard');
              }}
              className="btn-modal-close"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}