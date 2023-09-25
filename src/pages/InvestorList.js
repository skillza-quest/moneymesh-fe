import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FiltersSidebar from '../components/FiltersSidebar';
import TopBar from '../components/TopBar'
const InvestorList = () => {
  const userId = localStorage.getItem('userId');
  const [originalInvestors, setOriginalInvestors] = useState([]); // original dataset
  const [filteredInvestors, setFilteredInvestors] = useState([]); // filtered dataset
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ /* your filter state here */ });
  const [investmentStageFilter, setInvestmentStageFilter] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://skillza.quest/investors/');
        setOriginalInvestors(response.data);
        console.log(response.data);
        console.log("Original Investors", originalInvestors);
        setFilteredInvestors(response.data);
      } catch (error) {
        console.error("There was an error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const newFilters = {...filters, searchTerm: searchTerm, investmentStages: investmentStageFilter};
    const filteredList = filterInvestors(originalInvestors, newFilters);
    setFilteredInvestors(filteredList);
    console.log(newFilters.minAmount, newFilters.maxAmount)
    console.log(filteredList);
  }, [filters, originalInvestors, searchTerm]);
 

  const filterInvestors = (investors, filters) => {
    return investors.filter((investor) => {
      // Filter by Average Investment Amount
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
      if (
        filters.investmentStages &&
        filters.investmentStages.length > 0 &&
        !filters.investmentStages.includes(investor.investmentStage)
      ) {
        return false;
      }
  
      // Filter by industries
      if (
        filters.industries && filters.industries.length > 0 &&
        !filters.industries.some((industries) => investor.industries.includes(industries))
      ) {
        return false;
      }
  
      // Filter by Region
      if (filters.region && filters.region.length > 0 && !filters.region.includes(investor.region)) {
        return false;
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
  
      // Filter by Rating
      if (filters.minRating && investor.rating < filters.minRating) {
        return false;
      }
      if (filters.maxRating && investor.rating > filters.maxRating) {
        return false;
      }
  
      // Filter by Reviews
      if (filters.hasReviews && investor.reviews.length === 0) {
        return false;
      }
  
      // Filter by Contact Person
      if (
        filters.contactPerson &&
        investor.contactPerson.toLowerCase() !== filters.contactPerson.toLowerCase()
      ) {
        return false;
      }
  
      // Filter by Investment Stage
      if (
        filters.investmentStage &&
        !filters.investmentStage.includes(investor.investmentStage)
      ) {
        return false;
      }
  
      // Filter by Investment Type
      if (
        filters.investmentType &&
        !filters.investmentType.includes(investor.investmentType)
      ) {
        return false;
      }
  
      // General Search Term
      if (
        filters.searchTerm &&
        !Object.values(investor).some((value) =>
          value.toString().toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
      if (
        filters.founderRatings &&
        filters.founderRatings.length > 0 &&
        !filters.founderRatings.includes(investor.founderRating)
      ) {
        return false;
      }
      if (
        filters.investorTypes &&
        filters.investorTypes.length > 0 &&
        !filters.investorTypes.includes(investor.investorType)
      ) {
        return false;
      }
      return true;
    });
  };

  if (loading) return <p>Loading...</p>;
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
                <div className="search-container">
                  <div className="search-icon">
                    <i className="fa fa-search" style={{color: 'rgb(65, 61, 247)'}}></i> 
                  </div>
                  <input type="text" placeholder="Search Investors" className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <ul>
                    {filteredInvestors.map(filteredInvestor => (
                      <li className='card-ext' key={filteredInvestor._id}>
                        <Link to={`/investors/${filteredInvestor._id}`}>
                          <big><strong>{filteredInvestor.name}</strong></big><br />
                          <small>
                            {filteredInvestor.website}<br />
                            {filteredInvestor.description}<br /><br />
                            <strong>Avg. Check:</strong> USD {filteredInvestor.averageInvestmentAmount}
                          </small>
                        </Link>
                      </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    </>
  );
};

export default InvestorList;
