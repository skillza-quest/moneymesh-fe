import axios from 'axios';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const AcceptInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();  // Added loginWithRedirect

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        await axios.post(`http://localhost:3001/accept-invite/${token}`);
        alert('You have been added as a collaborator.');
        navigate('/your-redirect-path');
      } catch (error) {
        console.error('Failed to accept invite:', error);
      }
    };

    if (!isAuthenticated) {
      localStorage.setItem('inviteToken', token);
      loginWithRedirect();  // Added this line to actually redirect
      return;
    }

    acceptInvite();
  }, [isAuthenticated, token, navigate]);

  return <p>Processing invite...</p>;
};

export default AcceptInvitePage;
