import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Topbar from '../components/TopBar';
import Loader from '../components/Loader';
import icRightArrow from '../assets/ic-right-arrow.png';
import BackButton from '../components/BackButton';
import moment from 'moment';
const MandatePage = () => {
  const { mandateId } = useParams();
  const [mandate, setMandate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const statusOrder = ['Rejected', 'New', 'Pending to send Intro Email', 'Responsed to Intro Email', 'Due Diligence Stage', 'Termsheet Stage', 'Investment Committee Call', 'Partner Call', 'Team Call', 'Pending to Respond']; // Adjust this based on your actual statuses

  const [inviteTokenInfo, setInviteTokenInfo] = useState(null);  // changed to null
  const [inviteLink, setInviteLink] = useState('');
  const { user } = useAuth0();
  const navigate = useNavigate();
  const formatStatusForCSS = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-');
  };
  const generateInvite = async () => {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/mandates/generate-invite/${mandateId}`);
    const { token } = response.data;
    console.log("THE TOKEN IS ", token);
    setInviteLink(`${process.env.REACT_APP_FRONTEND_URL}/accept-invite/${token}`);
    setInviteTokenInfo({ tokenExists: true, tokenExpired: false, token });  // update inviteTokenInfo
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Message disappears after 2 seconds
    }, (err) => {
        console.error('Failed to copy: ', err);
    });
  };

    useEffect(() => {
      const fetchMandate = async () => {
        if (!user) {
          console.error('User is not defined');
          return;  // Exit early if user is not defined
        }
  
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}`, { params: { userId: userId } });
          console.log(response.data);
          setMandate(response.data);
          const inviteTokenResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/invite-token`);
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
  if (loading) return <Loader />;

  if (!mandate) return <p>No such mandate found.</p>;

  return (
    <>
      <Topbar />
      <div className='container mt-3'>
        <div className="row justify-content-between">
        <div className='col-12 col-md-2 text-center'>
            <BackButton />
          </div>
        <div className='col-12 col-md-7'>
          
          <h3>{mandate.mandateName}</h3><br />
          <div className='flat-card'>
            <p><strong>Investors</strong></p><br />
            {mandate.investors && mandate.investors.length > 0 ? (
              <table style={{ width: '100%' }}>
                <tbody>
                  {mandate.investors
                  .sort((a, b) => {
                    return statusOrder.indexOf(b.mandateStatus) - statusOrder.indexOf(a.mandateStatus);
                  })
                  .map((investor, idx) => (
                    <tr 
                      onClick={() => navigate(`/mandates/${mandateId}/investor/${investor.investorId._id}`)} 
                      style={{ cursor: 'pointer', backgroundColor: idx % 2 === 0 ? '#fafafa' : 'transparent' }} 
                      key={idx}>
                      <td style={{ padding: '10px' }}>
                          <strong>{idx + 1}. {investor.investorId.name}</strong><br />
                          <small style={{
                              color: moment().diff(moment(investor.updatedAt), 'days') > 7 ? 'red' : '#ABABAB',
                              fontWeight: moment().diff(moment(investor.updatedAt), 'days') > 7 ? 'bold' : 'normal'
                          }}>
                              Last Activity: {moment(investor.updatedAt).format('MMM Do YYYY, h:mm a')}
                          </small>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                      <span className={`status-box status-${formatStatusForCSS(investor.mandateStatus)}`}>
                          {investor.mandateStatus}
                        </span>&nbsp;&nbsp;&nbsp;
                        <img src={icRightArrow} width="10px" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No investors.</p>
            )}
          </div>
        </div>
        <div className='col-12 col-md-3'><br /><br /><br />
          <div className='flat-card'>
                <p><strong>Collaborators</strong></p>
                Invite a startup to collaborate with you on this investment mandate.
                <br /><br />
                <ul>
                    {mandate.collaborators ? mandate.collaborators.map((collaborator, idx) => (
                        <li key={idx}>{collaborator.name}</li>
                    )) : 'No collaborators.'}
                </ul>
                {(() => {
                    if (!inviteTokenInfo.tokenExists || inviteTokenInfo.tokenExpired) {
                        return <button className='btn btn-secondary' onClick={generateInvite}>Generate Link</button>;
                    } else if (inviteTokenInfo.tokenExists && !inviteTokenInfo.tokenExpired) {
                        return (
                            <div style={{padding:10, backgroundColor:'#EFEFFE'}}>
                                <p>Share this link:</p>
                                <div className="collaborator-link-container">
                                    <input type="text" value={`${process.env.REACT_APP_FRONTEND_URL}/accept-invite/${inviteTokenInfo.token}`} readOnly className="collaborator-link-input" />
                                    <button onClick={() => copyToClipboard(`${process.env.REACT_APP_FRONTEND_URL}/accept-invite/${inviteTokenInfo.token}`)} className="copy-button">
                                        Copy
                                    </button>
                                </div>
                                {copied && <p style={{textAlign: 'right', marginTop: '4px'}}><strong><small>Copied!</small></strong></p>}
                            </div>
                        );
                    }
                })()}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MandatePage;
