import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MandatePage = () => {
  const { mandateId } = useParams();
  const [mandate, setMandate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMandate = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/mandates/${mandateId}`);
        console.log(response.data);
        setMandate(response.data);
      } catch (error) {
        console.error('Could not fetch mandate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMandate();
  }, [mandateId]);

  if (loading) return <p>Loading...</p>;

  if (!mandate) return <p>No such mandate found.</p>;

  return (
    <div className='container mt-3'>
        <h2>{mandate.mandateName}</h2>
        <h3>Collaborators</h3>
        <ul>
        {mandate.collaborators ? mandate.collaborators.map((collaborator, idx) => (
            <li key={idx}>{collaborator.name}</li>
        )) : 'No collaborators.'}
        </ul>
        <h3>Investors</h3>
        <ul>
        {mandate.investors ? mandate.investors.map((investor, idx) => (
            <li 
            onClick={() => navigate(`/mandates/${mandateId}/investor/${investor.investorId._id}`)}
            style={{ cursor: 'pointer' }}
            key={idx}>
            {investor.investorId.name} - {investor.mandateStatus}
            </li>
        )) : 'No investors.'}
        </ul>
    </div>
  );
};

export default MandatePage;
