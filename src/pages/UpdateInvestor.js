import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateInvestorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState({});
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchInvestor = async () => {
      const response = await axios.get(`http://localhost:3001/investors/${id}`);
      setInvestor(response.data);
      setLoading(false);
    };
    fetchInvestor();
  }, [id]);

  const handleChange = (e) => {
    setInvestor({ ...investor, [e.target.name]: e.target.value });
  };

  const updateInvestor = async (e) => {
    try {
      await axios.put(`http://localhost:3001/investors/${id}`, investor);
      alert('Investor updated successfully');
    } catch (error) {
      console.error('Could not update the investor:', error);
    }
  };

  const deleteInvestor = async () => {
    try {
      await axios.delete(`http://localhost:3001/investors/${id}`);
      alert('Investor deleted successfully');
      navigate('/investors');
    } catch (error) {
      console.error('Could not delete the investor:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-3">
<form onSubmit={(e) => { e.preventDefault(); updateInvestor(); }}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={investor.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <input type="text" className="form-control" name="type" value={investor.type} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Website</label>
          <input type="url" className="form-control" name="website" value={investor.website} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">LinkedIn Profile</label>
          <input type="url" className="form-control" name="linkedInProfile" value={investor.linkedInProfile} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Average Investment Amount</label>
          <input type="number" className="form-control" name="avgInvestmentAmount" value={investor.avgInvestmentAmount} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Investments Made</label>
          <input type="number" className="form-control" name="totalInvestmentsMade" value={investor.totalInvestmentsMade} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Invested Companies</label>
          <input type="text" className="form-control" name="investedCompanies" value={investor.investedCompanies} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Investment Stage</label>
          <input type="text" className="form-control" name="investmentStage" value={investor.investmentStage} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Industry Focus</label>
          <input type="text" className="form-control" name="industryFocus" value={investor.industryFocus} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Geographic Focus</label>
          <input type="text" className="form-control" name="geographicFocus" value={investor.geographicFocus} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fund Size</label>
          <input type="text" className="form-control" name="fundSize" value={investor.fundSize} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Exit History</label>
          <input type="text" className="form-control" name="exitHistory" value={investor.exitHistory} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Primary Contact Name</label>
          <input type="text" className="form-control" name="primaryContactName" value={investor.primaryContactName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Primary Contact Position</label>
          <input type="text" className="form-control" name="primaryContactPosition" value={investor.primaryContactPosition} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Email</label>
          <input type="email" className="form-control" name="contactEmail" value={investor.contactEmail} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Phone</label>
          <input type="tel" className="form-control" name="contactPhone" value={investor.contactPhone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input type="number" className="form-control" name="rating" value={investor.rating} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Reviews</label>
          <input type="text" className="form-control" name="reviews" value={investor.reviews} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input type="text" className="form-control" name="tags" value={investor.tags} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Time to Decision</label>
          <input type="text" className="form-control" name="timeToDecision" value={investor.timeToDecision} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea className="form-control" name="notes" value={investor.notes} onChange={handleChange} rows="3"></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input type="text" className="form-control" name="status" value={investor.status} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update Investor</button>
      </form>      
      <button onClick={deleteInvestor}>Delete Investor</button>
    </div>
  );
};

export default UpdateInvestorForm;
