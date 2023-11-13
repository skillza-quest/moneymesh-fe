import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/TopBar';
import Loader from '../components/Loader';
import StyledSelect from '../components/StyledSelect';
import moment from 'moment';

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
                      placeholder='How was your interaction? Any follow up material to be sent? What are the next steps?'
                      rows="4"
                      cols="50"
                    /><br />
                    <button className='btn btn-primary mt-2' onClick={saveNotes}>Save Note</button><br /><br /><br />
                    <p><strong>Events</strong></p>
                    <ul>
                    {investorInMandate.events.reverse().map((event, idx) => (
                        <li key={idx}>
                        <i>{`${event.notes}`} <br /><small>{moment(event.timestamp).format('MMM Do YYYY, h:mm a')}</small></i><br /><br />
                        </li>
                    ))}
                    </ul>
                    </section>
              </div>
              <div className={`tab-pane fade ${activeTab === 'investorDetails' ? 'show active' : ''}`}>
                <section><br />
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
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='card-ext'>
              <strong>{investorDetails.primaryContactName}</strong><br />
              {investorDetails.primaryContactPosition}<br />
              {investorDetails.contactEmail}<br />
              <a href={`mailto:${investorDetails.contactEmail}`}><strong>Send an email</strong></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MandateInvestorPage;
