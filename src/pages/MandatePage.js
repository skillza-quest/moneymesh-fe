import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const MandatePage = () => {
  const { mandateId } = useParams();
  const [mandate, setMandate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteTokenInfo, setInviteTokenInfo] = useState(null);  // changed to null
  const [inviteLink, setInviteLink] = useState('');
  const { user } = useAuth0();

  const navigate = useNavigate();
  const generateInvite = async () => {
    const response = await axios.post(`http://localhost:3001/mandates/generate-invite/${mandateId}`);
    const { token } = response.data;
    console.log("THE TOKEN IS ", token);
    setInviteLink(`http://localhost:3000/accept-invite/${token}`);
    setInviteTokenInfo({ tokenExists: true, tokenExpired: false, token });  // update inviteTokenInfo
  };
    useEffect(() => {
      const fetchMandate = async () => {
        if (!user) {
          console.error('User is not defined');
          return;  // Exit early if user is not defined
        }
  
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.get(`http://localhost:3001/mandates/${mandateId}`, { params: { userId: userId } });
          console.log(response.data);
          setMandate(response.data);
          const inviteTokenResponse = await axios.get(`http://localhost:3001/mandates/${mandateId}/invite-token`);
          const { token, tokenExists, tokenExpired } = inviteTokenResponse.data;  
          setInviteTokenInfo({ token, tokenExists, tokenExpired });
          console.log('inviteTokenInfo:', inviteTokenResponse.data); 
        }catch (error) {
          console.error('Could not fetch mandate:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Request data:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchMandate();
    }, [mandateId, user]);

    useEffect(() => {
      console.log('Updated inviteTokenInfo:', inviteTokenInfo);
   }, [inviteTokenInfo]);
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
        {(() => {
            if (!inviteTokenInfo.tokenExists || inviteTokenInfo.tokenExpired) {
                return <button onClick={generateInvite}>Generate Link</button>;
            } else if (inviteTokenInfo.tokenExists && !inviteTokenInfo.tokenExpired) {
                // if token exists, not expired, and not consumed, don't show button, show url
                return <p>Share this link: {`http://localhost:3000/accept-invite/${inviteTokenInfo.token}`}</p>;
            }
        })()}
    </div>
  );
};

export default MandatePage;
