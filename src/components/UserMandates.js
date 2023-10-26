import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import TopBar from '../components/TopBar'

const UserMandates = () => {
  const userId = localStorage.getItem('userId');
  const [mandates, setMandates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMandates = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`http://localhost:3001/mandates/user/${userId}`);
        setMandates(response.data);
        
      } catch (error) {
        console.error('Could not fetch mandates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMandates();
  }, [userId]);
  const handleCardClick = (mandateId) => {
    navigate(`/mandates/${mandateId}`);  // Use navigate to go to the specific mandate's page
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <TopBar />
    <div className='container mt-3'>
    <p><strong>&nbsp;&nbsp;Your Mandates</strong></p>
      <ul className='row'>
        <li className='col-12 col-md-6 col-lg-4 mb-3'>
          <div className='card-ext' style={{backgroundColor: '#E7E6FE'}} onClick={() => navigate('/mandates/create')}>
            <div style={{ textAlign: 'center' }}>
              <big>+</big><br />
              <strong>Create Mandate</strong>
            </div>
          </div>
        </li>
        {mandates.map(mandate => (
            <li className='col-12 col-md-6 col-lg-4 mb-3' key={mandate._id}>
                <div className='card-ext' onClick={() => handleCardClick(mandate._id)}>
                <big><strong>{mandate.mandateName}</strong></big><br /><br />
                </div>
            </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default UserMandates;
