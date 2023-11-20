import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/TopBar';
import Loader from '../components/Loader';
import StyledSelect from '../components/StyledSelect';
import moment from 'moment';
import BackButton from '../components/BackButton';
import icNote from '../assets/ic-note.png';
import icFunnel from '../assets/ic-funnel.png';
const MandateInvestorPage = () => {
  const navigate = useNavigate();
  const { mandateId, investorId } = useParams();
  const [investorData, setInvestorData] = useState(null); 
  const [notes, setNotes] = useState("");
  const [committedAmount, setCommittedAmount] = useState();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notesEvents');
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/investor/${investorId}`);
        setInvestorData(response.data);
        setCommittedAmount(response.data.investorInMandate.committedAmount);
        console.log("Investor removed");
      } catch (error) {
        console.error('Could not fetch investor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorDetails();
  }, [mandateId, investorId]);

  const handleCommittedAmountChange = (e) => {
    setIsSaved(false);
    let newAmount = e.target.value;
  
    // Remove commas from the input
    newAmount = newAmount.replace(/,/g, '');
  
    // Convert the input to a number for validation
    const numericAmount = Number(newAmount);
  
    // Check if the input is a valid number within the specified range
    if (isNaN(numericAmount) || numericAmount < 1 || numericAmount > 10000000) {
      // Invalid input: Do not proceed with the update
      return;
    }
  
    setCommittedAmount(newAmount);
  
    // Clear existing timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
  
    // Set new timeout to update the database after 2 seconds
    const newTimeout = setTimeout(() => {
      updateCommittedAmount(numericAmount); // Pass the numeric amount for updating
    }, 1000);
  
    setUpdateTimeout(newTimeout);
  };
  

const updateCommittedAmount = async (amount) => {
  try {
    // Replace with your API call to update the committed amount
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/investors/${investorId}/committedAmount`, { committedAmount: amount });
    console.log('Committed amount updated');
    setIsSaved(true);
  } catch (error) {
    console.error('Could not update committed amount:', error);
  }
};

  const removeInvestor = async () => {
    if (window.confirm("Are you sure you want to remove this investor and their info from this mandate? This cannot be undone.")) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/investor/${investorId}`);
        navigate('/mandates/' + mandateId); 
        console.log("Investor removed");
      } catch (error) {
        console.error('Error removing investor:', error);
        // Handle error (e.g., show an error message)
      }
    }
  };
  const saveNotes = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/investors/${investorId}/notes`, { notes });
      console.log('Notes added as an event');
  
      const newEvent = {
        timestamp: new Date(),
        eventType: 'Notes',
        notes,
        status: investorData.investorInMandate.mandateStatus,
      };
  
      const updatedEvents = [...investorData.investorInMandate.events, newEvent];
  
      // Update the local state
      setInvestorData({
        ...investorData,
        investorInMandate: {
          ...investorData.investorInMandate,
          events: updatedEvents,
        },
      });
  
      setNotes('');
  
    } catch (error) {
      console.error('Could not add notes', error);
    }
  };
  const updateStatus = async (newStatus) => {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/investors/${investorId}/status`, { status: newStatus });
        console.log('Status updated:', response.data);
        const eventFromServer = response.data.event;

        const event = {
            type: eventFromServer.type,
            notes: eventFromServer.notes,
            date: new Date(eventFromServer.timestamp),
            status: eventFromServer.status,
        };
        console.log(event);
        const updatedEvents = [...investorData.investorInMandate.events, event]
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sorting in descending order

        setInvestorData({
            ...investorData,
            investorInMandate: {
                ...investorData.investorInMandate,
                mandateStatus: newStatus,
                events: updatedEvents
            },
        });
    } catch (error) {
        console.error('Could not update status:', error);
    }
};


  if (loading) return <Loader />;
  if (!investorData) return <p>No such investor found within this mandate.</p>;

  const { investorDetails, investorInMandate } = investorData; // Assuming your API returns data in this structure

  return (
    <>
      <Topbar />
      <div className='container mt-3'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-2 text-center'>
            <BackButton />
          </div>
          <div className='col-12 col-md-7'>
            <div className="flexContainer">
              <h3><strong>{investorDetails.name}</strong></h3>
              <div className="selectContainer">
                <StyledSelect value={investorInMandate.mandateStatus} onChange={(e) => updateStatus(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Due Diligence Stage">Due Diligence Stage</option>
                  <option value="Termsheet Stage">Termsheet Stage</option>
                  <option value="Investment Committee Call">Investment Committee Call</option>
                  <option value="Partner Call">Partner Call</option>
                  <option value="Team Call">Team Call</option>
                  <option value="Responsed to Intro Email">Responsed to Intro Email</option>
                  <option value="Pending to Respond">Pending to Respond</option>
                  <option value="Pending to send Intro Email">Pending to send Intro Email</option>
                  <option value="Call for Money">Call for Money</option>
                  <option value="Capital Transferred">Capital Transferred</option>
                  <option value="Rejected">Rejected</option>
                </StyledSelect>
              </div>
            </div>
            <br /><br />
            <div className="tab-content">
              <div>
                <section>
                <div>
  <label><strong>Committed Amount (USD)</strong></label><br />
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="number"
      className='form-control'
      name="committedAmount"
      style={{ width: 200 }}
      value={committedAmount}
      onChange={handleCommittedAmountChange}
      maxLength="50"
      required
    />
    {isSaved && (
      <span 
        className="text-success" 
        style={{ 
          fontWeight: 'bold', 
          backgroundColor: '#D1FADF', 
          color: '#0CB466', 
          borderRadius: '4px',
          padding: '2px 4px',
          fontSize: 'small'
        }}>
        Saved
      </span>
    )}
  </div>
</div>
<br />
                    <p><strong>Add a note</strong></p>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder='How was your interaction? Any follow up material to be sent? What are the next steps?'
                      rows="4"
                      cols="50"
                    /><br />
                    <button className='btn btn-primary mt-2' onClick={saveNotes}>Save Note</button><br /><br /><br />
                    <p><strong>Events</strong></p>
                    <ul>
                      {investorInMandate.events.reverse().map((event, idx) => (
                          <li key={idx} className="d-flex align-items-center my-2">
                              <div className="media-icon mr-3">
                                  {event.eventType === 'Notes' && <img src={icNote} alt="Note" width="28px" style={{marginRight: 12}} />}
                                  {!event.eventType && <img src={icFunnel} alt="Status" width="28px" style={{marginRight: 12}} />}
                              </div>
                              <div className="media-content">
                                  <span>{event.notes}</span> <br />
                                  <small>{moment(event.timestamp).format('MMM Do YYYY, h:mm a')}</small>
                              </div>
                          </li>
                      ))}
                    </ul>

                    </section>
              </div><hr />
              
              <div>
                <section><br />
                <div className='row'>
                  <div className='col-12'>
                  <strong>Industry Focus</strong><br />
                  {investorDetails.industryFocus && investorDetails.industryFocus.join(', ')}<br /><br />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                  <strong>Portfolio</strong><br />
                  {investorDetails.investedCompanies && investorDetails.investedCompanies.join(', ')}<br /><br /><br />
                  </div>
                </div>
                <div className="row">
                <div className='col-12 col-md-4'>
                  {investorDetails.type && <div><strong>Type:</strong><br /> {investorDetails.type}</div>}
                </div>
                <div className="col-12 col-md-4">
                  <strong>Investment Stages:</strong><br />{investorDetails.investmentStage}<br /><br />
                </div>
                <div className="col-12 col-md-4">
                  <strong>Time To Decision: </strong><br />{investorDetails.timeToDecision} <br /><br />
                </div>
              </div><br />
              <div className="row">
                <div className="col-6 col-md-4"><strong>Avg. Check:</strong><br /> USD {investorDetails.averageInvestmentAmount}</div>
                <div className="col-6 col-md-4"><strong>Fund Size:</strong><br /> {investorDetails.fundSize && <div>{investorDetails.fundSize}</div>}</div>
                <div className="col-6 col-md-4"><strong>Investments Made:</strong><br />  {investorDetails.totalInvestmentsMade && <div>{investorDetails.totalInvestmentsMade}</div>}</div>
              </div>
              <br /><br />
              <div className="row">
                <div className="col-6 col-md-4"><strong>Geographic Focus</strong><br /> {investorDetails.geographicFocus}</div>
                <div className="col-6 col-md-4"><strong>Industries</strong><br /> {investorDetails.industries && investorDetails.industries.join(', ')}</div>
                <div className="col-6 col-md-4"><strong>Tags</strong><br /> {investorDetails.tags && investorDetails.tags.join(', ')}</div>
              </div>
              <br />
                  </section>
                  <br />
                  <hr />
                  <div className='my-3'>
                    <button 
                      className='btn btn-danger' 
                      onClick={removeInvestor}>
                      Remove investor from Mandate
                    </button>
                  </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='card-ext'>
              <strong>People</strong><br /><hr />
              <strong>{investorDetails.primaryContactName}</strong><br />
              {investorDetails.primaryContactPosition}<br />
              {investorDetails.contactEmail}<br />
              <a className='btn btn-secondary mt-2' href={`mailto:${investorDetails.contactEmail}`}><strong>Send an email</strong></a>
            </div>
          </div>
        </div><br /><br />
      </div>
    </>
  );
};

export default MandateInvestorPage;
