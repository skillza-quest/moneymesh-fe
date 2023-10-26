import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FiltersSidebar from '../components/FiltersSidebar';
import TopBar from '../components/TopBar';
import Loader from '../components/Loader';
const CreateMandate = () => {
  const userId = localStorage.getItem('userId');
  const [originalInvestors, setOriginalInvestors] = useState([]); 
  const [filteredInvestors, setFilteredInvestors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mandateName, setMandateName] = useState("");
  const [filters, setFilters] = useState({ });
  const [investmentStageFilter, setInvestmentStageFilter] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/investors/`);
        const fetchedInvestors = response.data;
        setOriginalInvestors(fetchedInvestors);
        setFilteredInvestors(fetchedInvestors);
        console.log(response.data);
        console.log("Original Investors", originalInvestors);
      } catch (error) {
        console.error("There was an error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const newFilters = {...filters, searchTerm: searchTerm};
    const filteredList = filterInvestors(originalInvestors, newFilters);
    setFilteredInvestors(filteredList);
    console.log(newFilters.minAmount, newFilters.maxAmount)
    console.log("Updated filters in InvestorList:", filters);
  }, [filters, originalInvestors, searchTerm, investmentStageFilter]);
 
  const filterInvestors = (investors, filters) => {
    console.log("Filters being used in InvestorList:", filters);

    return investors.filter((investor) => {
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
  const createMandate = async () => {
    const investorData = filteredInvestors.map((investor) => {
      return {
        investorId: investor._id,
        mandateStatus: 'new',  
        events: [], 
        notes: ''  
      };
    });
    
    const newMandate = {
      mandateName: mandateName,
      creatorId: userId,
      investors: investorData 
    };
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/mandates/create`, newMandate);
      console.log('New mandate created:', response.data);
    } catch (error) {
      console.error('Could not create mandate:', error);
    }
  };
  
  if (loading) return <Loader />;
  return (
    <>
    <TopBar />
    <div className="container-fluid">
        <div className="row justify-content-center">
            <div className="col-12 col-md-4 col-lg-4 col-xl-3">
                <div className="sidebar">
                    <FiltersSidebar setFilters={setFilters} />
                </div>
            </div>
            <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                <div className='row justify-content-center'>
                <div className='col-12 col-md-12 mb-2'>
                  <div className='flat-card' style={{position:'relative'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className='mb-2'>
                        <big><strong>Create a Mandate</strong></big><br />
                        Use the filters on this page to create a custom list of investors that you can then collaborate on with your startups.<br />
                      </div>
                      <input 
                        type="text" 
                        className='form-control mb-2'
                        style={{ flex: 1, maxWidth: 300 }}  // Takes up available space
                        placeholder="Give this mandate a name" 
                        value={mandateName} 
                        onChange={(e) => setMandateName(e.target.value)}  // Set mandateName
                      />
                    <button className='btn btn-primary' style={{width: 300}} onClick={createMandate}>Create mandate with {filteredInvestors.length} Investors</button>
                    </div>
                    <div className="illustration"></div>
                  </div>
                </div>
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
                <ul className='row'>
                    {filteredInvestors.map(filteredInvestor => (
                      <li className='col-12 col-md-6 mb-3' key={filteredInvestor._id}>
                        <div className='card-ext'>
                          <Link to={`/investors/${filteredInvestor._id}`}>
                            <big><strong>{filteredInvestor.name}</strong></big><br />
                              {filteredInvestor.website}<br />
                              <strong>Avg. Check:</strong> USD {filteredInvestor.avgInvestmentAmount}
                          </Link>
                        </div>
                      </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    </>
  );
};

export default CreateMandate;
