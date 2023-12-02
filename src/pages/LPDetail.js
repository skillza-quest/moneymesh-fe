import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';
import icProfile from '../assets/ic-profile.png'
import BackButton from '../components/BackButton';
import MandateSelector from '../components/MandateSelector';
const LPDetail = () => {
  const { id } = useParams();
  const [limitedPartnerDetails, setLimitedPartnerDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Info'); // Initialize the active tab as 'Info'

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/limited-partners/${id}`)
      .then((response) => {setLimitedPartnerDetails(response.data); console.log("LP Details:", response.data)})
      .catch((error) => console.error(error));
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Define tab content based on the active tab
  const tabContent = {
    Info: (
      <div><br />
      {limitedPartnerDetails.description}<br />    
              <div className='row'>
                <div className='col-12'>
                <strong>Industries</strong><br />
                {limitedPartnerDetails.industryFocus && limitedPartnerDetails.industryFocus.join(', ')}<br /><br />
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                <strong>Portfolio</strong><br />
                {limitedPartnerDetails.investdFunds && limitedPartnerDetails.investedFunds.join(', ')}<br /><br /><br />
                </div>
              </div>
              <div className="row">
                
                <div className='col-12 col-md-4'>
                  {limitedPartnerDetails.type && <div><strong>Type:</strong><br /> {limitedPartnerDetails.type}</div>}
                </div>
                <div className="col-12 col-md-4">
                  <strong>Investment Stages:</strong><br />{limitedPartnerDetails.investmentStage}<br /><br />
                </div>
                <div className="col-12 col-md-4">
                  <strong>AUM: </strong><br />{limitedPartnerDetails.aum} <br /><br />
                </div>
              </div><br />
              <div className="row">
                <div className="col-6 col-md-4"><strong>Avg. Check:</strong><br /> USD {limitedPartnerDetails.averageInvestmentAmount}</div>
                <div className="col-6 col-md-4"><strong>Fund Size:</strong><br /> {limitedPartnerDetails.fundSize && <div>{limitedPartnerDetails.fundSize}</div>}</div>
                <div className="col-6 col-md-4"><strong>Investments Made:</strong><br />  {limitedPartnerDetails.totalInvestmentsMade && <div>{limitedPartnerDetails.totalInvestmentsMade}</div>}</div>
              </div>
              <br /><br />
              <div className="row">
              <div className="col-6 col-md-4"><strong>Headquarters</strong><br /> {limitedPartnerDetails.hq}</div>
              <div className="col-6 col-md-4"><strong>Geographic Focus</strong><br /> {limitedPartnerDetails.geographicFocus}</div>
                <div className="col-6 col-md-4"><strong>Eligible GP Fund Size</strong><br /> {limitedPartnerDetails.eligibleGpFundSize}</div>
              </div><br />
              <div className="row">
                <div className="col-12 col-md-4"><strong>Fund Strategy</strong><br /> {limitedPartnerDetails.fundStrategy}</div>
              </div>
              <br />
             
              
              <br />
              
              <div className="row">
                <div className="col-12">
                  {limitedPartnerDetails.notes}
                </div>
              </div>
              <br /><br /><br />
              <small style={{opacity: 0.3}}>
                <strong>Status: </strong>{limitedPartnerDetails.status} <br />
                <strong>Last Updated:</strong>{new Date(limitedPartnerDetails.lastUpdated).toLocaleString()}
              </small>
      </div>
    ),
    'Reviews': (
      <div className="row">
                <div className="col-12 col-md-6">
                  <strong>Rating:</strong> {limitedPartnerDetails.rating && <div>{limitedPartnerDetails.rating}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <strong>Grade:</strong> {limitedPartnerDetails.grade && <div> {limitedPartnerDetails.grade}</div>}
                </div><br /><br />
                <div className="col-12">
                  <strong>Reviews:</strong><br /> {limitedPartnerDetails.reviews && <div> {limitedPartnerDetails.reviews && limitedPartnerDetails.reviews.join(', ')}</div>}<br />
                </div>
              </div>
    ),
    People: (
      <div className="profile-section">
        <div className="row mt-4">
            <div className="col-12 d-flex align-items-center">
                <img src={icProfile} width="60px" className="mr-3" alt="Profile" />
                <div>
                    {limitedPartnerDetails.primaryContactName && (
                        <div>
                            <strong>{limitedPartnerDetails.primaryContactName}</strong><br />
                            {limitedPartnerDetails.primaryContactPosition}<br />
                        </div>
                    )}
                    {limitedPartnerDetails.contactEmail && <div>{limitedPartnerDetails.contactEmail}</div>}
                    {limitedPartnerDetails.contactPhone && <div>{limitedPartnerDetails.contactPhone}</div>}
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
                        <strong>{limitedPartnerDetails.name}</strong>
                        <MandateSelector limitedPartnerId={id} />
                      </h3>
                      {limitedPartnerDetails.website}<br /><br />
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

export default LPDetail;


