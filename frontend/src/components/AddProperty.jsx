import React, { useState } from 'react';

export default function AddProperty({ user, setView, fetchProperties }) {
  const [propForm, setPropForm] = useState({ 
    title: '', description: '', propertyType: 'PG', city: '', address: '', rent: '', deposit: '', amenities: '' 
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', propForm.title);
      formData.append('description', propForm.description);
      formData.append('propertyType', propForm.propertyType);
      formData.append('city', propForm.city);
      formData.append('locality', propForm.address);
      formData.append('rent', Number(propForm.rent));
      formData.append('deposit', Number(propForm.deposit));

      // Amenities object ko JSON string banakar append karna
      const amenitiesObj = {
        wifi: propForm.amenities.toLowerCase().includes('wifi'),
        ac: propForm.amenities.toLowerCase().includes('ac'),
        foodFacility: propForm.amenities.toLowerCase().includes('food'),
        laundry: propForm.amenities.toLowerCase().includes('laundry')
      };
      formData.append('amenities', JSON.stringify(amenitiesObj));

      // Saari select ki gayi image files ko append karna
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const res = await fetch('/api/properties', {
        method: 'POST',
        body: formData, // ⚠️ Dhyan rahe: FormData bhejte waqt headers mein 'Content-Type' nahi dena hota, browser khud multipart set karta hai.
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create property');

      setSuccessMsg('Property listed successfully!');
      alert('Property listed successfully!');
      
      setView('home');
      if (fetchProperties) fetchProperties();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleCreateProperty} className="bg-white p-8 rounded-xl shadow max-w-xl mx-auto my-6">
      <h2 className="text-2xl font-bold mb-6 text-center">List New Property</h2>
      
      {error && <p className="bg-red-100 text-red-600 p-2 mb-4 rounded text-center text-sm">{error}</p>}
      {successMsg && <p className="bg-green-100 text-green-700 p-2 mb-4 rounded text-center text-sm font-semibold">{successMsg}</p>}

      <input type="text" placeholder="Title (e.g., Luxury 1RK Room)" value={propForm.title} onChange={(e) => setPropForm({...propForm, title: e.target.value})} className="w-full border p-2 mb-4 rounded" required/>
      <textarea placeholder="Description" value={propForm.description} onChange={(e) => setPropForm({...propForm, description: e.target.value})} className="w-full border p-2 mb-4 rounded" required/>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select value={propForm.propertyType} onChange={(e) => setPropForm({...propForm, propertyType: e.target.value})} className="border p-2 rounded">
          <option value="PG">PG</option>
          <option value="Room">Room</option>
          <option value="Flat">Flat</option>
        </select>
        <input type="text" placeholder="City" value={propForm.city} onChange={(e) => setPropForm({...propForm, city: e.target.value})} className="border p-2 rounded" required/>
      </div>
      <input type="text" placeholder="Address / Locality" value={propForm.address} onChange={(e) => setPropForm({...propForm, address: e.target.value})} className="w-full border p-2 mb-4 rounded" required/>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="number" placeholder="Monthly Rent (₹)" value={propForm.rent} onChange={(e) => setPropForm({...propForm, rent: e.target.value})} className="border p-2 rounded" required/>
        <input type="number" placeholder="Security Deposit (₹)" value={propForm.deposit} onChange={(e) => setPropForm({...propForm, deposit: e.target.value})} className="border p-2 rounded" required/>
      </div>
      <input type="text" placeholder="Amenities (e.g. WiFi, AC, Food)" value={propForm.amenities} onChange={(e) => setPropForm({...propForm, amenities: e.target.value})} className="w-full border p-2 mb-4 rounded"/>
      
      {/* File Upload Input for Device Photos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Property Photos (Multiple allowed):</label>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={(e) => setImageFiles(Array.from(e.target.files))} 
          className="w-full border p-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
          required
        />
        <p className="text-xs text-gray-500 mt-1">{imageFiles.length} file(s) selected</p>
      </div>
      
      <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded font-semibold hover:bg-indigo-700 transition">Post Property</button>
    </form>
  );
}