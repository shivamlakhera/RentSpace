import React from 'react';

export default function PropertyList({ 
  properties, 
  cityFilter, 
  setCityFilter, 
  typeFilter, 
  setTypeFilter, 
  maxRentFilter, 
  setMaxRentFilter, 
  fetchProperties, 
  setSelectedProperty, 
  setView 
}) {
  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          type="text" 
          placeholder="Filter by city (e.g., Delhi, Mumbai)" 
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)} 
          className="border p-2 rounded">
          <option value="">All Types</option>
          <option value="PG">PG</option>
          <option value="Room">Room</option>
          <option value="Flat">Flat</option>
        </select>
        <input 
          type="number" 
          placeholder="Max Rent (₹)" 
          value={maxRentFilter}
          onChange={(e) => setMaxRentFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <button 
          onClick={fetchProperties} 
          className="bg-indigo-600 text-white rounded p-2 font-semibold">
          Apply Filters
        </button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map(p => (
          <div key={p._id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between">
            <div>
              <img src={p.image || "https://via.placeholder.com/400x250"} alt={p.title} className="w-full h-48 object-cover"/>
              <div className="p-4">
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded">{p.propertyType}</span>
                <h3 className="text-lg font-bold mt-2">{p.title}</h3>
                <p className="text-gray-500 text-sm">{p.city}, {p.address}</p>
                <p className="text-xl font-extrabold text-indigo-600 mt-2">
                  ₹{p.rent} <span className="text-xs font-normal text-gray-500">/ month</span>
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button 
                onClick={() => { setSelectedProperty(p); setView('details'); }}
                className="w-full bg-gray-900 text-white py-2 rounded text-center block hover:bg-gray-800">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
