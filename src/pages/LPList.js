import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LPFiltersSidebar from '../components/LPFiltersSidebar';
import TopBar from '../components/TopBar'
import Loader from '../components/Loader';
const LPList = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const [originalLimitedPartners, setOriginalLimitedPartners] = useState([]); 
  const [filteredLPs, setFilteredLPs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ });
  const [investmentStageFilter, setInvestmentStageFilter] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
      if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
          setSortField(field);
          setSortDirection('asc');
      }
  };
  const sortedLimitedPartners = useMemo(() => {
      if (!sortField) return filteredLPs;

      return [...filteredLPs].sort((a, b) => {
          if (a[sortField] < b[sortField]) {
              return sortDirection === 'asc' ? -1 : 1;
          }
          if (a[sortField] > b[sortField]) {
              return sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
      });
  }, [filteredLPs, sortField, sortDirection]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/limited-partners/`);
        const fetchedLimitedPartners = response.data;
        setOriginalLimitedPartners(fetchedLimitedPartners);
        setFilteredLPs(fetchedLimitedPartners);
        console.log(response.data);
        console.log("Original LimitedPartners", originalLimitedPartners);
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
    const filteredList = filterLPs(originalLimitedPartners, newFilters);
    setFilteredLPs(filteredList);
    console.log(newFilters.minAmount, newFilters.maxAmount)
    console.log("Updated filters in LimitedPartnerList:", filters);
  }, [filters, originalLimitedPartners, searchTerm, investmentStageFilter]);
 

  const filterLPs = (limitedPartners, filters) => {
    console.log("Filters being used in LimitedPartnerList:", filters);

    return limitedPartners.filter((limitedPartner) => {
      const term = searchTerm.toLowerCase();
      if (searchTerm && 
          !(limitedPartner.name && limitedPartner.name.toLowerCase().includes(term))
      ) {
        return false;
      }
      if (
        (filters.minAmount !== undefined && limitedPartner.avgInvestmentAmount < filters.minAmount) ||
        (filters.maxAmount !== undefined && limitedPartner.avgInvestmentAmount > filters.maxAmount)
      ) {
        return false;
      }
      
  
      // Filter by Invested Companies
      if (
        filters.investedCompanies && !filters.investedCompanies.some((company) =>
          limitedPartner.investedCompanies.includes(company)
        )
      ) {
        return false;
      }

      // Filter by industries
      if (
        filters.industries && filters.industries.length > 0 &&
        !filters.industries.some((industryFocus) => limitedPartner.industryFocus.includes(industryFocus))
      ) {
        return false;
      }
  // Filter by Region
  if (filters.region && filters.region.length > 0) {
    const limitedPartnerRegions = limitedPartner.geographicFocus.split(',').map(region => region.trim()); // Split by comma and trim each value
    const hasMatchingRegion = filters.region.some(filterRegion => limitedPartnerRegions.includes(filterRegion)); // Check if any filter matches any limitedPartner region
    if (!hasMatchingRegion) {
      return false;
    }
  }
  if (
    filters.grades &&
    filters.grades.length > 0 &&
    !filters.grades.includes(limitedPartner.grade)
  ) {
    return false;
  }

  // Filter by Tags
  if (
    filters.tags &&
    !filters.tags.some((tag) => limitedPartner.tags.includes(tag))
  ) {
    return false;
  }

   // Filter by Reviews
   if (filters.hasReviews && limitedPartner.reviews.length === 0) {
    return false;
  }

  // Filter by Contact Person
  if (
    filters.contactPerson &&
    limitedPartner.primaryContactName.toLowerCase() !== filters.contactPerson.toLowerCase()
  ) {
    return false;
  }

  // Filter by Investment Stage
  const limitedPartnerStages = limitedPartner.investmentStage.split(',').map(stage => stage.trim());
  if (
    filters.investmentStages &&
    filters.investmentStages.length > 0 &&
    !filters.investmentStages.some(stage => limitedPartnerStages.includes(stage))
  ) {
    return false;
  }

  if (filters.founderRatings && filters.founderRatings.length > 0 && filters.founderRatings.includes(0) && limitedPartner.rating === 0) {
    console.log(filters.founderRatings);
    return true;
  }
  
  if (
    filters.founderRatings &&
    filters.founderRatings.length > 0 &&
    !filters.founderRatings.includes(limitedPartner.rating)
  ) {
    console.log("Filtering out limitedPartner due to rating mismatch:", limitedPartner.name, limitedPartner.rating);
    return false;
  }
  if (
    limitedPartner.type && filters.limitedPartnerTypes && filters.limitedPartnerTypes.length > 0 &&
    !filters.limitedPartnerTypes.includes(limitedPartner.type)
  ) {
    return false;
  }
      
      return true;
    });
  };
  console.log("Rerendering LimitedPartnerList. Current filters state:", filters);

  if (loading) return <Loader />;
  return (
    <>
    <TopBar />
    <div className="container">
      <div className='row'>
        <div className='col-12'>
            <div className='mb-2'>
                        <h3>Browse LPs</h3><br />
            </div>
          </div>
      </div>
        <div className="row justify-content-center">
            <div className="col-12 col-md-4 col-lg-4 col-xl-3">
                <div className="sidebar">
                    <LPFiltersSidebar setFilters={setFilters} />
                </div>
            </div>
            <div className="col-12 col-md-8 col-lg-8 col-xl-9">
                <div className='row justify-content-center'>
                  <div className='col-12'>
                    <div className="search-container">
                      <div className="search-icon">
                        <i className="fa fa-search" style={{color: 'rgb(65, 61, 247)'}}></i> 
                      </div>
                      <input type="text" placeholder="Search LimitedPartners" className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                </div>
                <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('name')}>Name</th>
                        <th style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell', cursor: 'pointer' }} onClick={() => handleSort('type')}>Type</th>
                        <th style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell', cursor: 'pointer' }} onClick={() => handleSort('investmentStage')}>Stage</th>
                        <th style={{ padding: '10px', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('avgInvestmentAmount')}>Avg. Check</th>
                    </tr>
                </thead>
                <tbody>
                  {console.log(filteredLPs)}
                    {sortedLimitedPartners.map((filteredLP, idx) => (
                      <tr 
                          onClick={() => navigate(`/limited-partners/${filteredLP._id}`)} 
                          style={{ cursor: 'pointer', backgroundColor: idx % 2 === 0 ? '#fafafa' : 'transparent' }} 
                          key={filteredLP._id}
                      >
                          <td style={{ padding: '10px' }}>
                              <strong>{filteredLP.name}</strong>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell' }}>
                              {filteredLP.type}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', display: 'none', display: 'lg-table-cell' }}>
                              {filteredLP.investmentStage}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                              USD {filteredLP.avgInvestmentAmount}
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  );
};

export default LPList;
