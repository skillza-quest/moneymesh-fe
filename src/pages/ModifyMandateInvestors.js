import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import FiltersSidebar from '../components/FiltersSidebar';
import TopBar from '../components/TopBar';
import Loader from '../components/Loader';
import icDetails from '../assets/ic-details.png';
import moment from 'moment';
import { useAuth0 } from '@auth0/auth0-react';
import BackButton from '../components/BackButton';

const ModifyMandateInvestors = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const userId = localStorage.getItem('userId');
  const [originalInvestors, setOriginalInvestors] = useState([]); 
  const [filteredInvestors, setFilteredInvestors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mandateName, setMandateName] = useState("");
  const [filters, setFilters] = useState({ });
  const [investmentStageFilter, setInvestmentStageFilter] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const { mandateId } = useParams();
  const [mandateInvestors, setMandateInvestors] = useState([]);
  const handleSort = (field) => {
    if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortField(field);
        setSortDirection('asc');
    }
};
function formatAmount(amount) {
  if (amount >= 1000000) {
      const inMillions = amount / 1000000;
      return (inMillions % 1 === 0 ? inMillions.toFixed(0) : inMillions.toFixed(1)) + 'M';
  } else if (amount >= 1000) {
      const inThousands = amount / 1000;
      return (inThousands % 1 === 0 ? inThousands.toFixed(0) : inThousands.toFixed(1)) + 'k';
  } else {
      return amount.toString();
  }
}
const handleInvestorSelection = (event, investorId) => {
  event.stopPropagation();
  if (event.target.checked) {
      setSelectedInvestors([...selectedInvestors, investorId]);
  } else {
      setSelectedInvestors(selectedInvestors.filter(id => id !== investorId));
  }
};


const sortedInvestors = useMemo(() => {
    if (!sortField) return filteredInvestors;

    return [...filteredInvestors].sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });
}, [filteredInvestors, sortField, sortDirection]);
const handleSelectDeselectAll = (event) => {
  if (event.target.checked) {
      setSelectedInvestors(filteredInvestors.map(investor => investor._id));
  } else {
      setSelectedInvestors([]);
  }
};

const addInvestorsToMandate = async () => {
  if (selectedInvestors.length === 0) {
    alert("No investors selected. Please select at least one investor.");
    return;
  }

  try {
    const mandateResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}?userId=${userId}`);
    let mandate = mandateResponse.data;

    // Extract current investor IDs
    let currentInvestorIds = mandate.investors.map(investor => investor.investorId);

    // Identify new investors to be added (those not already in the mandate)
    const newInvestorsToAdd = filteredInvestors
      .filter(investor => selectedInvestors.includes(investor._id) && !currentInvestorIds.includes(investor._id))
      .map(investor => ({
        investorId: investor._id, // Use the string ID directly
        mandateStatus: 'new',
        events: [],
        notes: '',
        committedAmount: 0 // Default values for new investors
      }));

    // Add only new investors to the existing ones
    mandate.investors = [...mandate.investors.filter(investor => currentInvestorIds.includes(investor.investorId)), ...newInvestorsToAdd];

    const updateResponse = await axios.put(`${process.env.REACT_APP_SERVER_URL}/mandates/update/${mandateId}`, mandate);
    navigate('/mandates/' + updateResponse.data._id);
  } catch (error) {
    console.error('Could not update mandate:', error);
  }
};




useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all investors
      const investorsResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/investors/`);
      setOriginalInvestors(investorsResponse.data);

      // Fetch current mandate investors
      const mandateResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}`, {
        params: { userId: userId }
      })
      const currentInvestorIds = mandateResponse.data.investors.map(investor => investor.investorId._id);
      console.log("currentInvestorIds", currentInvestorIds);

      setMandateInvestors(currentInvestorIds);
    } catch (error) {
      console.error("There was an error fetching the data", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [mandateId]);

useEffect(() => {
  const newFilters = {...filters, searchTerm: searchTerm};
  const filteredList = filterInvestors(originalInvestors, newFilters);
  setFilteredInvestors(filteredList);
}, [filters, originalInvestors, searchTerm, investmentStageFilter, mandateInvestors]); // Add mandateInvestors as a dependency

  const filterInvestors = (investors, filters) => {
    console.log("Filters being used in InvestorList:", filters);

    return investors.filter((investor) => {
      if (mandateInvestors.includes(investor._id)) {
        return false;
      }
      if (
        (filters.minAmount !== undefined && investor.avgInvestmentAmount < filters.minAmount) ||
        (filters.maxAmount !== undefined && investor.avgInvestmentAmount > filters.maxAmount)
      ) {
        return false;
      }
      
  
      // Filter by Invested Companies
      if (
        filters.investedCompanies && !filters.investedCompanies.some((company) =>
          investor.investedCompanies.includes(company)
        )
      ) {
        return false;
      }

      // Filter by industries
      if (
        filters.industries && filters.industries.length > 0 &&
        !filters.industries.some((industryFocus) => investor.industryFocus.includes(industryFocus))
      ) {
        return false;
      }
  // Filter by Region
  if (filters.region && filters.region.length > 0) {
    const investorRegions = investor.geographicFocus.split(',').map(region => region.trim()); // Split by comma and trim each value
    const hasMatchingRegion = filters.region.some(filterRegion => investorRegions.includes(filterRegion)); // Check if any filter matches any investor region
    if (!hasMatchingRegion) {
      return false;
    }
  }
  if (
    filters.grades &&
    filters.grades.length > 0 &&
    !filters.grades.includes(investor.grade)
  ) {
    return false;
  }

  // Filter by Tags
  if (
    filters.tags &&
    !filters.tags.some((tag) => investor.tags.includes(tag))
  ) {
    return false;
  }

   // Filter by Reviews
   if (filters.hasReviews && investor.reviews.length === 0) {
    return false;
  }

  // Filter by Contact Person
  if (
    filters.contactPerson &&
    investor.primaryContactName.toLowerCase() !== filters.contactPerson.toLowerCase()
  ) {
    return false;
  }

  // Filter by Investment Stage
  const investorStages = investor.investmentStage.split(',').map(stage => stage.trim());
  if (
    filters.investmentStages &&
    filters.investmentStages.length > 0 &&
    !filters.investmentStages.some(stage => investorStages.includes(stage))
  ) {
    return false;
  }

  // General Search Term
  if (filters.founderRatings && filters.founderRatings.length > 0 && filters.founderRatings.includes(0) && investor.rating === 0) {
    console.log(filters.founderRatings);
    return true;
  }
  
  if (
    filters.founderRatings &&
    filters.founderRatings.length > 0 &&
    !filters.founderRatings.includes(investor.rating)
  ) {
    console.log("Filtering out investor due to rating mismatch:", investor.name, investor.rating);
    return false;
  }
  if (
    investor.type && filters.investorTypes && filters.investorTypes.length > 0 &&
    !filters.investorTypes.includes(investor.type)
  ) {
    return false;
  }
      
      return true;
    });
  };
  const getButtonText = () => {
    const numberOfInvestors = selectedInvestors.length;
    if (numberOfInvestors === 0) {
      return "Pick at least 1 investor to proceed";
    } else {
      return `Add ${numberOfInvestors} investor${numberOfInvestors > 1 ? 's' : ''} to mandate`;
    }
  };
  
  if (loading) return <Loader />;
  return (
    <>
    <TopBar />
    <div className="container">
        <div className="row justify-content-center">
          <div className='col-12 col-md-1 mb-2'>
            <center><BackButton /></center>
          </div>
          <div className='col-12 col-md-11 mb-2'>
            <div className='row'>
            <div className='col-12 col-md-6 mb-2'>
              <div>
                <h3>Add investors to this mandate</h3><br />
              </div>
            </div>
            <div className='col-12 col-md-6 mb-2 text-end'>
            <button 
              className='btn btn-primary'
              disabled={selectedInvestors.length === 0}
              onClick={addInvestorsToMandate}
            >
              {getButtonText()}
            </button>
            </div>
            </div>
            <div className='row justify-content-center'>
                <div className="col-12 col-md-3">
                    <div className="sidebar">
                        <FiltersSidebar setFilters={setFilters} />
                    </div>
                </div>
                <div className="col-12 col-md-9">
                    <div className='row justify-content-center'>
                      <div className='col-12 d-none'>
                        <div className="search-container">
                          <div className="search-icon">
                            <i className="fa fa-search" style={{color: 'rgb(65, 61, 247)'}}></i> 
                          </div>
                          <input type="text" placeholder="Search Investors" className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className='col-12'>
                    <p><strong>&nbsp;&nbsp;Displaying {filteredInvestors.length} investors below:</strong></p>
                    </div>
                    <span style={{ verticalAlign: 'middle' }}>
                      <input
                            type="checkbox"
                            checked={selectedInvestors.length === filteredInvestors.length}
                            onChange={handleSelectDeselectAll}
                        />
                      </span> 
                      <span style={{ verticalAlign: 'middle' }}>
                        &nbsp;Select All Investors Below
                      </span>
                    <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                        <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}></th>
                            <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('name')}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell', cursor: 'pointer' }} onClick={() => handleSort('type')}>Type</th>
                            <th style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell', cursor: 'pointer' }} onClick={() => handleSort('investmentStage')}>Stage</th>
                            <th style={{ padding: '10px', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('avgInvestmentAmount')}>Avg. Check</th>
                            <th style={{ padding: '10px', textAlign: 'right', cursor: 'pointer' }}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                      {console.log(filteredInvestors)}
                        {sortedInvestors.map((filteredInvestor, idx) => (
                          <tr 
                              style={{ cursor: 'pointer', backgroundColor: idx % 2 === 0 ? '#fafafa' : 'transparent' }} 
                              key={filteredInvestor._id}
                          >
                            <td  style={{ padding: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedInvestors.includes(filteredInvestor._id)}
                                    onChange={(e) => handleInvestorSelection(e, filteredInvestor._id)}
                                />
                            </td>
                              <td style={{ padding: '10px' }}>
                                  <strong>{filteredInvestor.name}</strong>
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell' }}>
                                  {filteredInvestor.type}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell' }}>
                                  {filteredInvestor.investmentStage}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                  USD {formatAmount(filteredInvestor.avgInvestmentAmount)}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                  <a href={`/investors/${filteredInvestor._id}`} target='_blank'><img src={icDetails} width="20px" /></a>
                              </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default ModifyMandateInvestors;
