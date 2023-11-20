import React, { useEffect, useState, useMemo } from 'react';
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
  const statusOrder = ['Rejected', 'New', 'Pending to send Intro Email', 'Responsed to Intro Email', 'Due Diligence Stage', 'Termsheet Stage', 'Investment Committee Call', 'Partner Call', 'Team Call', 'Pending to Respond', 'Call for Money', 'Capital Transferred']; // Adjust this based on your actual statuses
  const totalInvestment = mandate && mandate.investors.reduce((sum, investor) => sum + investor.avgInvestmentAmount, 0);
  const [inviteTokenInfo, setInviteTokenInfo] = useState(null);  // changed to null
  const [inviteLink, setInviteLink] = useState('');
  const { user } = useAuth0();
  const statusBuckets = {
    'Under discussion': [
      'Due Diligence Stage',
      'Termsheet Stage',
      'Investment Committee Call',
      'Partner Call',
      'Team Call',
      'Responsed to Intro Email'
    ],
    'Investors Yet to Revert': [
      'Pending to Respond',
      'Pending to send Intro Email',
      'New'
    ],
    'Rejected': ['Rejected']
  };
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();
  
  
  const getStatusBuckets = (investors) => {
    const buckets = {
        'Under discussion': 0,
        'Investors Yet to Revert': 0,
        'Rejected': 0
    };
    investors.forEach(investor => {
        if (statusBuckets['Under discussion'].includes(investor.mandateStatus)) {
            buckets['Under discussion']++;
        } else if (statusBuckets['Investors Yet to Revert'].includes(investor.mandateStatus)) {
            buckets['Investors Yet to Revert']++;
        } else if (statusBuckets['Rejected'].includes(investor.mandateStatus)) {
            buckets['Rejected']++;
        }
    });

    return buckets;
  };
  const statusBucketCounts = mandate ? getStatusBuckets(mandate.investors) : null;

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
  const deleteMandate = async () => {
    if (window.confirm("Are you sure you want to delete this mandate? This cannot be undone.")) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}`);
        navigate('/mandates'); 
      } catch (error) {
        console.error('Error deleting mandate:', error);
        // Handle error (e.g., show an error message)
      }
    }
  };
  const navigateToModifyInvestors = () => {
    navigate(`/mandates/${mandateId}/modify-investors`);
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedInvestors = useMemo(() => {
    // Check if mandate or mandate.investors is null or undefined
    if (!mandate || !mandate.investors) {
      return [];
    }
  
    if (!sortField) {
      return mandate.investors;
    }
  
    return [...mandate.investors].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' ? a.investorId.name.localeCompare(b.investorId.name) : b.investorId.name.localeCompare(a.investorId.name);
      }
      if (sortField === 'lastActivity') {
        return sortDirection === 'asc' ? moment(a.updatedAt).diff(moment(b.updatedAt)) : moment(b.updatedAt).diff(moment(a.updatedAt));
      }
      if (sortField === 'status') {
        return sortDirection === 'asc' ? statusOrder.indexOf(a.mandateStatus) - statusOrder.indexOf(b.mandateStatus) : statusOrder.indexOf(b.mandateStatus) - statusOrder.indexOf(a.mandateStatus);
      }
      return 0;
    });
  }, [mandate, sortField, sortDirection]); // Add mandate as a dependency
  
  
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
          <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <td><strong>Investors in mandate:</strong> {mandate ? mandate.investors.length : 0}</td>
                  <td><strong>Total Capital Pool:</strong> {totalInvestment ? `${totalInvestment} USD` : 'N/A'}</td>

                </tr>
                <tr>  
                <td><strong>Created Date:</strong> {mandate ? moment(mandate.createdAt).format('MMM Do YYYY') : 'N/A'}</td>
                  <td><strong>Updated Date:</strong> {mandate ? moment(mandate.updatedAt).format('MMM Do YYYY') : 'N/A'}</td>
                </tr>
              </tbody>
            </table><br />
          <div className='flat-card'>
            <div className='d-flex justify-content-between mb-3'>
              <div>
                <h5>Investors</h5>
              </div>
              <div>
                <button onClick={navigateToModifyInvestors}
                  className='btn btn-secondary' >
                  + Add Investors
                </button>
              </div>
            </div>
            
            <table style={{width: '100%'}}>
              <tbody>
              <tr>
                <td>Under discussion: <span className='status-box status-team-call'>{statusBucketCounts ? statusBucketCounts['Under discussion'] : 0}</span></td>
                <td>Investors Yet to Revert: <span className='status-box status-new'>{statusBucketCounts ? statusBucketCounts['Investors Yet to Revert'] : 0}</span></td>
                <td style={{textAlign: 'right'}}>Rejected: <span className='status-box status-cold'>{statusBucketCounts ? statusBucketCounts['Rejected'] : 0}</span></td>
              </tr>
              </tbody>
            </table><br />
            {mandate.investors && mandate.investors.length > 0 ? (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('name')}>Investor</th>
                    <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('lastActivity')}>Last Activity</th>
                    <th style={{ padding: '10px', textAlign: 'end', cursor: 'pointer' }} onClick={() => handleSort('status')}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvestors.map((investor, idx) => (
                    <tr 
                      onClick={() => navigate(`/mandates/${mandateId}/investor/${investor.investorId._id}`)} 
                      style={{ cursor: 'pointer', backgroundColor: idx % 2 === 0 ? '#fafafa' : 'transparent' }} 
                      key={idx}>
                      <td style={{ padding: '10px' }}>
                          <strong>{idx + 1}. {investor.investorId.name}</strong><br />
                      </td>
                      <td style={{ padding: '10px' }}>
                          <small style={{
                              color: moment().diff(moment(investor.updatedAt), 'days') > 7 ? 'red' : '#121212',
                              fontWeight: moment().diff(moment(investor.updatedAt), 'days') > 7 ? 'bold' : 'normal'
                          }}>
                              {moment(investor.updatedAt).format('MMM Do YYYY, h:mm a')}
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
          <div className='my-3'>
            <button 
              className='btn btn-danger' 
              onClick={deleteMandate}>
              Delete this Mandate
            </button>
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
