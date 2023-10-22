import React, { useState } from 'react';
import axios from 'axios';

const NewInvestorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    website: '',
    linkedInProfile: '',
    avgInvestmentAmount: '',
    totalInvestmentsMade: '',
    investedCompanies: '',
    investmentStage: '',
    industryFocus: '',
    geographicFocus: '',
    fundSize: '',
    exitHistory: '',
    primaryContactName: '',
    primaryContactPosition: '',
    contactEmail: '',
    contactPhone: '',
    rating: '',
    reviews: '',
    tags: '',
    timeToDecision: '',
    notes: '',
    status: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const creatorId = localStorage.getItem('userId');
      const payload = {
      ...formData,
      creatorId,
    };
    try {
      const response = await axios.post('http://localhost:3001/investors', payload);
      alert('Investor added successfully');
    } catch (error) {
      alert('Could not add the investor');
      console.error('Could not add the investor:', error);
    }
  };
  

  return (
    <div className="container mt-3">
      <h1>Add New Investor</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <input type="text" className="form-control" name="type" value={formData.type} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Website</label>
          <input type="url" className="form-control" name="website" value={formData.website} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">LinkedIn Profile</label>
          <input type="url" className="form-control" name="linkedInProfile" value={formData.linkedInProfile} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Average Investment Amount</label>
          <input type="number" className="form-control" name="avgInvestmentAmount" value={formData.avgInvestmentAmount} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Investments Made</label>
          <input type="number" className="form-control" name="totalInvestmentsMade" value={formData.totalInvestmentsMade} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Invested Companies</label>
          <input type="text" className="form-control" name="investedCompanies" value={formData.investedCompanies} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Investment Stage</label>
          <input type="text" className="form-control" name="investmentStage" value={formData.investmentStage} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Industry Focus</label>
          <input type="text" className="form-control" name="industryFocus" value={formData.industryFocus} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Geographic Focus</label>
          <input type="text" className="form-control" name="geographicFocus" value={formData.geographicFocus} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fund Size</label>
          <input type="text" className="form-control" name="fundSize" value={formData.fundSize} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Exit History</label>
          <input type="text" className="form-control" name="exitHistory" value={formData.exitHistory} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Primary Contact Name</label>
          <input type="text" className="form-control" name="primaryContactName" value={formData.primaryContactName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Primary Contact Position</label>
          <input type="text" className="form-control" name="primaryContactPosition" value={formData.primaryContactPosition} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Email</label>
          <input type="email" className="form-control" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Phone</label>
          <input type="tel" className="form-control" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input type="number" className="form-control" name="rating" value={formData.rating} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Reviews</label>
          <input type="text" className="form-control" name="reviews" value={formData.reviews} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input type="text" className="form-control" name="tags" value={formData.tags} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Time to Decision</label>
          <input type="text" className="form-control" name="timeToDecision" value={formData.timeToDecision} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input type="text" className="form-control" name="status" value={formData.status} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Add Investor</button>
      </form>
    </div>
  );  
};

export default NewInvestorForm;
