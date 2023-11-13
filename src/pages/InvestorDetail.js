import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';
import icProfile from '../assets/ic-profile.png'
import BackButton from '../components/BackButton';
import MandateSelector from '../components/MandateSelector';
const InvestorDetail = () => {
  const { id } = useParams();
  const [investorDetails, setInvestorDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Info'); // Initialize the active tab as 'Info'

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/investors/${id}`)
      .then((response) => setInvestorDetails(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Define tab content based on the active tab
  const tabContent = {
    Info: (
      <div><br />
      {investorDetails.description}<br />    
              <div className='row'>
                <div className='col-12'>
                <strong>Industries</strong><br />
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
                <div className="col-6 col-md-4"><strong>Tags</strong><br /> {investorDetails.tags && investorDetails.tags.join(', ')}</div>
              </div>
              <br />
             
              
              <br />
              
              <div className="row">
                <div className="col-12">
                  {investorDetails.notes}
                </div>
              </div>
              <br /><br /><br />
              <small style={{opacity: 0.3}}>
                <strong>Status: </strong>{investorDetails.status} <br />
                <strong>Last Updated:</strong>{new Date(investorDetails.lastUpdated).toLocaleString()}
              </small>
      </div>
    ),
    'Reviews': (
      <div className="row">
                <div className="col-12 col-md-6">
                  <strong>Rating:</strong> {investorDetails.rating && <div>{investorDetails.rating}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <strong>Grade:</strong> {investorDetails.grade && <div> {investorDetails.grade}</div>}
                </div><br /><br />
                <div className="col-12">
                  <strong>Reviews:</strong><br /> {investorDetails.reviews && <div> {investorDetails.reviews && investorDetails.reviews.join(', ')}</div>}<br />
                </div>
              </div>
    ),
    People: (
      <div className="profile-section">
        <div className="row mt-4">
            <div className="col-12 d-flex align-items-center">
                <img src={icProfile} width="60px" className="mr-3" alt="Profile" />
                <div>
                    {investorDetails.primaryContactName && (
                        <div>
                            <strong>{investorDetails.primaryContactName}</strong><br />
                            {investorDetails.primaryContactPosition}<br />
                        </div>
                    )}
                    {investorDetails.contactEmail && <div>{investorDetails.contactEmail}</div>}
                    {investorDetails.contactPhone && <div>{investorDetails.contactPhone}</div>}
                </div>
            </div>
        </div>
     </div>
    ),
  };

  return (
    <>
      <TopBar />
      <div className="container">
        <div className="row justify-content-center">
          <div className='col-12 col-md-1'><br />
            <BackButton />
          </div>
          <div className="col-12 col-md-8">
            <div className="flat-card" style={{minHeight: 500}}>
              <div className="investor-details-page">
                  <div>
                    <div className="investor-details-page">
                      <h3>
                        <strong>{investorDetails.name}</strong>
                        <MandateSelector investorId={id} />
                      </h3>
                      {investorDetails.website}<br /><br />
                    </div>
                  </div>
              </div>
              <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'Info' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('Info')}
                    >
                      Info
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'Reviews and Ratings' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('Reviews and Ratings')}
                    >
                      Reviews and Ratings
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === 'People' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('People')}
                    >
                      People
                    </button>
                  </li>
                </ul>
                {/* Render the active tab content */}
                {tabContent[activeTab]}
            </div>      
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorDetail;


