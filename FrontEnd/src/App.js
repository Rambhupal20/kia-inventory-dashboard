import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({ partName: '', quantity: '', status: 'In Stock' });
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      // FIX 1: Removed "http://localhost:5000" (The proxy handles it now)
      const res = await axios.get('/api/parts'); 
      setParts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error: Could not connect to Backend. Is 'node server.js' running?");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.partName || !form.quantity) return alert("Please fill all fields");
    
    try {
      // FIX 2: Relative path here too
      await axios.post('/api/parts', form);
      setForm({ partName: '', quantity: '', status: 'In Stock' }); 
      fetchParts(); 
    } catch (error) {
      alert("Failed to save. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Confirm delete?")) {
      try {
        // FIX 3: Ensure you use BACKTICKS (`) not single quotes (')
        await axios.delete(`/api/parts/${id}`);
        fetchParts();
      } catch (error) {
        alert("Failed to delete.");
      }
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Kia Motors Inventory Dashboard</h1>
      </header>

      <div className="container">
        {/* Form Section */}
        <div className="card form-section">
          <h3>Add New Component</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Part Name (e.g., Brake Pad)" 
              value={form.partName}
              onChange={(e) => setForm({...form, partName: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Qty" 
              value={form.quantity}
              onChange={(e) => setForm({...form, quantity: e.target.value})}
            />
            <select 
              value={form.status} 
              onChange={(e) => setForm({...form, status: e.target.value})}
            >
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <button type="submit" className="btn add-btn">Add to Inventory</button>
          </form>
        </div>

        {/* Table Section */}
        <div className="card list-section">
          <h3>Current Stock</h3>
          <table>
            <thead>
              <tr>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="4">Connecting to Server...</td></tr>
              ) : parts.length === 0 ? (
                <tr><td colSpan="4">No parts found (or server is down)</td></tr>
              ) : (
                parts.map((part) => (
                  <tr key={part.id}>
                    <td>{part.partName}</td>
                    <td>{part.quantity}</td>
                    <td>
                      <span className={`status-badge ${part.status ? part.status.toLowerCase().replace(/ /g, '-') : ''}`}>
                        {part.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(part.id)} className="btn delete-btn">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;