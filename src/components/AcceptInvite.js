import axios from 'axios';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const AcceptInvitePage = () => {
  const { token } = useParams();
  console.log("Accept invite token:", token);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    const acceptInvite = async () => {
      try {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/mandates/accept-invite/${token}`,
          { userId: userId }  
        );
        console.log("added as collaborator");
        navigate('/mandates')
      } catch (error) {
        console.error('Failed to accept invite:', error);
      }
    };


    if (!userId) {
      console.log("HIT");
      localStorage.setItem('inviteToken', token);
      return;
    }

    acceptInvite();
  }, [token, navigate]);

  return <p>Processing invite...</p>;
};

export default AcceptInvitePage;
