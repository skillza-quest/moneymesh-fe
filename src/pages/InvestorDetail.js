import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';

const InvestorDetail = () => {
  const { id } = useParams();
  const [investorDetails, setInvestorDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Info'); // Initialize the active tab as 'Info'

  useEffect(() => {
    axios
      .get(`http://localhost:3001/investors/${id}`)
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
      {investorDetails.description}<br /><br /><br />    
        <div class="row">
                <div class="col-12">
                  <strong>Investment Stages:</strong>{investorDetails.investmentStage}<br /><br />
                </div>
              </div><br />
              <div class="row">
                <div class="col-12 col-md-4"><strong>Avg. Check:</strong> USD {investorDetails.averageInvestmentAmount}</div>
                <div class="col-12 col-md-4"><strong>Fund Size:</strong> {investorDetails.fundSize && <div>{investorDetails.fundSize}</div>}</div>
                <div class="col-12 col-md-4"><strong>Investments Made:</strong>  {investorDetails.totalInvestmentsMade && <div>{investorDetails.totalInvestmentsMade}</div>}</div>
              </div>
              <br />
              <div class="row">
                <div class="col-12 col-md-4"><strong>Geographic Focus</strong> {investorDetails.geographicFocus}</div>
                <div class="col-12 col-md-4"><strong>Industries</strong> {investorDetails.industries && investorDetails.industries.join(', ')}</div>
                <div class="col-12 col-md-4"><strong>Tags</strong> {investorDetails.tags && investorDetails.tags.join(', ')}</div>
              </div>
              <br />
             
              
              <br />
              <div class="row">
                <div class="col-12">
                  <strong>Notes:</strong><br />
                  {investorDetails.notes}
                </div>
              </div>
              <br /><br /><br />
              <small style={{opacity: 0.3}}>
                <strong>Time To Decision: </strong>{investorDetails.timeToDecision} <br />
                <strong>Status: </strong>{investorDetails.status} <br />
                <strong>Last Updated:</strong>{new Date(investorDetails.lastUpdated).toLocaleString()}
              </small>
      </div>
    ),
    'Reviews': (
      <div class="row">
                <div class="col-12 col-md-6">
                  <strong>Rating:</strong> {investorDetails.rating && <div>{investorDetails.rating}</div>}
                </div>
                <div class="col-12 col-md-6">
                  <strong>Grade:</strong> {investorDetails.grade && <div> {investorDetails.grade}</div>}
                </div><br /><br />
                <div class="col-12">
                  <strong>Reviews:</strong><br /> {investorDetails.reviews && <div> {investorDetails.reviews && investorDetails.reviews.join(', ')}</div>}<br />
                </div>
              </div>
    ),
    People: (
      <div>
         <div class="row">
                <div class="col-12">
                  {investorDetails.primaryContactPerson?.name && <div>Primary Contact: {investorDetails.primaryContactPerson.name}, {investorDetails.primaryContactPerson.position}</div>}
                  {investorDetails.contactEmail && <div>Contact Email: {investorDetails.contactEmail}</div>}
                  {investorDetails.contactPhone && <div>Contact Phone: {investorDetails.contactPhone}</div>}<br />
                </div>
              </div><br />
      </div>
    ),
  };

  return (
    <>
      <TopBar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <Link to="#" onClick={() => window.history.back()}>
              <small>Go back to Investor Directory</small>
            </Link>
            <br />
            <br />
            <div class="card-ext" style={{minHeight: 500}}>
              <div className="investor-details-page">
                  <div>
                    <div className="investor-details-page">
                      <h1><strong>{investorDetails.name}</strong></h1>

                      {investorDetails.type && <div>Type: {investorDetails.type}</div>}
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


