import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/TopBar';
import Loader from '../components/Loader';
import StyledSelect from '../components/StyledSelect';
const MandateInvestorPage = () => {
  const { mandateId, investorId } = useParams();
  const [investorData, setInvestorData] = useState(null); 
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notesEvents');

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/investor/${investorId}`);
        setInvestorData(response.data); // Updated this line
      } catch (error) {
        console.error('Could not fetch investor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorDetails();
  }, [mandateId, investorId]);

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

        const event = {
            type: "status",
            details: `Status changed from ${investorData.investorInMandate.mandateStatus} to ${newStatus}`,
            date: new Date(),
            status: `${newStatus}`
        };
        setInvestorData({
            ...investorData,
            investorInMandate: {
                ...investorData.investorInMandate,
                mandateStatus: newStatus,
                events: [...investorData.investorInMandate.events, event] // Add the new event to the events array
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
                <option value="Rejected">Rejected</option>
              </StyledSelect>
            </div>
        </div>
          <br /><br />
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'notesEvents' ? 'active' : ''}`} onClick={() => setActiveTab('notesEvents')}>Notes & Events</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'investorDetails' ? 'active' : ''}`} onClick={() => setActiveTab('investorDetails')}>Investor Details</button>
            </li>
          </ul><br />
          <div className="tab-content">
    <div className={`tab-pane fade ${activeTab === 'notesEvents' ? 'show active' : ''}`}>
      <section>
          <p><strong>Add a note</strong></p>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            cols="50"
          /><br />
          <button className='btn btn-primary mt-2' onClick={saveNotes}>Save Note</button><br /><br /><br />
          <p><strong>Events</strong></p>
          <ul>
          {investorInMandate.events.reverse().map((event, idx) => (
              <li key={idx}>
              <i>{`${event.notes}`} <br /><small>{`${new Date(event.timestamp).toLocaleString()}`}</small></i><br /><br />
              </li>
          ))}
          </ul>
          </section>
    </div>
    <div className={`tab-pane fade ${activeTab === 'investorDetails' ? 'show active' : ''}`}>
      <section>
          <h5>Investor Details</h5>
          <p>Email: <a href={`mailto:${investorDetails.contactEmail}`}>{investorDetails.contactEmail}</a></p>
        <p>Phone: {investorDetails.contactPhone}</p>
        <p>Avg Investment Amount: {investorDetails.avgInvestmentAmount}</p>
        <p>Fund Size: {investorDetails.fundSize}</p>
        <p>Geographic Focus: {investorDetails.geographicFocus}</p>
        <p>Investment Stage: {investorDetails.investmentStage}</p>
        <p>Primary Contact Name: {investorDetails.primaryContactName}</p>
        <p>Primary Contact Position: {investorDetails.primaryContactPosition}</p>
        <p>Rating: {investorDetails.rating}</p>
        <p>Total Investments Made: {investorDetails.totalInvestmentsMade}</p>
        <p>Type: {investorDetails.type}</p>
        <p>Website: {investorDetails.website}</p>
        <p>Time to Decision: {investorDetails.timeToDecision}</p>
          <h4>Exit History</h4>
          <ul>
            {investorDetails.exitHistory.map((exit, idx) => (
              <li key={idx}>{exit}</li>
            ))}
          </ul>
          <h4>Invested Companies</h4>
        <ul>
          {investorDetails.investedCompanies.map((company, idx) => (
            <li key={idx}>{company}</li>
          ))}
        </ul>
        
        <h4>Industry Focus</h4>
        <ul>
          {investorDetails.industryFocus.map((industry, idx) => (
            <li key={idx}>{industry}</li>
          ))}
        </ul>
        
        <h4>Reviews</h4>
        <ul>
          {investorDetails.reviews.map((review, idx) => (
            <li key={idx}>{review}</li>
          ))}
        </ul>
        </section>
    </div>
  </div>
      </div>
      </div>
          <div className='col-12 col-md-4'>
            &nbsp;
          </div>
        </div>
    </>
  );
};

export default MandateInvestorPage;
