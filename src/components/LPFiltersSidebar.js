import React, { useState, useEffect } from 'react';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import axios from 'axios'
const LPFiltersSidebar = ({ setFilters }) => {
    const [values, setValues] = useState([0, 10000000]);    
    const [selectedIndustryFocus, setSelectedIndustryFocus] = useState([]);
    const [selectedGeographicFocus, setSelectedGeographicFocus] = useState([]);
    const [investmentStages, setInvestmentStages] = useState(['Preseed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D']);
    const [selectedInvestmentStage, setSelectedInvestmentStage] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]); 
    const [selectedFounderRatings, setSelectedFounderRatings] = useState([]); // New state for selected founder ratings
    const [selectedLimitedPartnerType, setSelectedLimitedPartnerType] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [tags, setTags] = useState('');
    const [investmentType, setInvestmentType] = useState('');
    const clearFilters = () => {
      window.location.reload();
    };
    const sliderStyle = {
        position: 'relative',
        left: 20,
        width: '80%',
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
    const onUpdate = (updateValues) => {
        setValues(updateValues);
    }
    const onChange = (newValues) => {
      console.log(typeof newValues[0]);
      console.log(newValues);
        setFilters((prevFilters) => ({
          ...prevFilters,
          minAmount: newValues[0],
          maxAmount: newValues[1],
          investmentStages: selectedInvestmentStage,
        }));
    }
    useEffect(() => {
        handleFilterChange();
      }, [selectedGeographicFocus, selectedIndustryFocus, selectedLimitedPartnerType, selectedInvestmentStage]);
    useEffect(() => {
      const fetchUniqueIndustries = async () => {
          try {
              const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/limited-partners/industries`);
              setIndustries(response.data);
              console.log(response.data);
          } catch (error) {
              console.error('Could not fetch unique industries:', error);
          }
      };
  
      fetchUniqueIndustries();
  }, []);
  const handleFilterChange = () => {
    const geographiesArray = selectedGeographicFocus.map(geo => geo.trim());

    const newFilters = {
      region: geographiesArray,
      industries: selectedIndustryFocus,
      investmentStages: selectedInvestmentStage,
      grades: selectedGrades,
      founderRatings: selectedFounderRatings,
      limitedPartnerTypes: selectedLimitedPartnerType
    };

    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    console.log("Called setFilters from FiltersSidebar with:", newFilters);

};

      const toggleIndustryFocus = (industry) => {
        setSelectedIndustryFocus(prevSelected => {
            if (prevSelected && prevSelected.includes(industry)) {
                return prevSelected.filter(item => item !== industry);
            } else {
                return [...(prevSelected || []), industry];
            }
        });
    };
    const toggleGeographicFocus = (region) => {
      setSelectedGeographicFocus((prevSelected) => {
          if (prevSelected && prevSelected.includes(region)) {
              return prevSelected.filter((item) => item !== region);
          } else {
              return [...prevSelected, region];
          }
      });
  };
      const toggleFounderRating = (rating) => {
        setSelectedFounderRatings((prevSelected) => {
          let updatedRatings;
          const intRating = parseInt(rating); // Convert rating string to integer
    
          if (prevSelected && prevSelected.includes(intRating)) {
            updatedRatings = prevSelected.filter((item) => item !== intRating);
          } else {
            updatedRatings = [...prevSelected, intRating];
          }
    
          // Directly update the filters here
          setFilters(prevFilters => ({
            ...prevFilters,
            founderRatings: updatedRatings
          }));
    
          return updatedRatings;
        });
      };
    
      const toggleLimitedPartnerType = (type) => {
        setSelectedLimitedPartnerType((prevSelected) => {
            if (prevSelected && prevSelected.includes(type)) {
                return prevSelected.filter((item) => item !== type);
            } else {
                return [...prevSelected, type];
            }
        });
    };
    console.log("Selected Founder Ratings in FiltersSidebar:", selectedFounderRatings);

  return (
    <div className="filters-sidebar">
      <div style={{minHeight: 500}}>
      <a onClick={clearFilters} style={{color: 'blue'}}>
          <small><span className='btn btn-secondary'>Clear All Filters</span></small>
      </a><br /><br />
      <div>
          <span className='filter-section'>INVESTOR TYPE<br /></span><br />
          <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Fund of Funds"
                        onChange={() => toggleLimitedPartnerType("Fund of Funds")}
                    />&nbsp;
                    Fund of Funds
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Government Funds"
                        onChange={() => toggleLimitedPartnerType("Government Funds")}
                    />&nbsp;
                    Government Funds
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Corporates"
                        onChange={() => toggleLimitedPartnerType("Corporates")}
                    />&nbsp;
                    Corporates
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Family Offices"
                        onChange={() => toggleLimitedPartnerType("Family Offices")}
                    />&nbsp;
                    Family Offices
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Foundations"
                        onChange={() => toggleLimitedPartnerType("Foundations")}
                    />&nbsp;
                    Foundations
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Impact Funds"
                        onChange={() => toggleLimitedPartnerType("Impact Funds")}
                    />&nbsp;
                    Impact Funds
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="DFIs"
                        onChange={() => toggleLimitedPartnerType("DFIs")}
                    />&nbsp;
                    DFIs
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Banks"
                        onChange={() => toggleLimitedPartnerType("Banks")}
                    />&nbsp;
                    Banks
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="HNIs"
                        onChange={() => toggleLimitedPartnerType("HNIs")}
                    />&nbsp;
                    HNIs
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Endowment Funds"
                        onChange={() => toggleLimitedPartnerType("Endowment Funds")}
                    />&nbsp;
                    Endowment Funds
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Sovereign Funds"
                        onChange={() => toggleLimitedPartnerType("Sovereign Funds")}
                    />&nbsp;
                    Sovereign Funds
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Pension Funds"
                        onChange={() => toggleLimitedPartnerType("Pension Funds")}
                    />&nbsp;
                    Pension Funds
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Investment Banks"
                        onChange={() => toggleLimitedPartnerType("Investment Banks")}
                    />&nbsp;
                    Investment Banks
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Trust Funds"
                        onChange={() => toggleLimitedPartnerType("Trust Funds")}
                    />&nbsp;
                    Trust Funds
                </label>
                
        </div><br />
      <div>
        <span className='filter-section'>INDUSTRY FOCUS<br /></span><br />
        {industries.map(industry => (
          <>
          <label className="custom-checkbox-label" key={industry}>
            &nbsp;&nbsp;<input
              type="checkbox"
              value={industry}
              onChange={() => toggleIndustryFocus(industry)}
            />&nbsp;
            {industry}
          </label>
          </>
        ))}
      </div>

        <div><br />
          <span className='filter-section'>REGION<br /></span><br />
          <label className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="North America"
                        onChange={() => toggleGeographicFocus("North America")}
                    />&nbsp;
                    North America
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="London"
                        onChange={() => toggleGeographicFocus("London")}
                    />&nbsp;
                    London
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="Europe"
                        onChange={() => toggleGeographicFocus("Europe")}
                    />&nbsp;
                    Europe
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="South East Asia"
                        onChange={() => toggleGeographicFocus("South East Asia")}
                    />&nbsp;
                    South East Asia
                </label>
                <label  className="custom-checkbox-label">
                    <input
                        type="checkbox"
                        value="India"
                        onChange={() => toggleGeographicFocus("India")}
                    />&nbsp;
                    India
                </label>
        </div>

        <div><br />
        <span className='filter-section'>INVESTMENT AMOUNT<br /></span><br />
          <Slider
            rootStyle={sliderStyle}
            domain={[0, 500000000]}
            step={1000000}
            mode={2}
            values={values}
            onUpdate={onUpdate}
            onChange={onChange}
          >
            <Rail>
              {({ getRailProps }) => (
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: 4,
                  borderRadius: 4,
                  cursor: 'pointer',
                  backgroundColor: 'rgb(200,200,200)'
                }} {...getRailProps()} />
              )}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div className="slider-handles">
                  {handles.map(handle => (
                    <div
                      key={handle.id}
                      style={{
                        position: 'absolute',
                        left: `${handle.percent}%`,
                        marginLeft: -12,
                        marginTop: -6,
                        zIndex: 2,
                        width: 16,
                        height: 16,
                        border: 0,
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        backgroundColor: '#413DF7',
                        color: '#413DF7',
                      }}
                      {...getHandleProps(handle.id)}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '0px',
                        left: '-15px',
                        width: '50px',
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        fontSize: '10px',
                        padding: '2px'
                      }}>
                        {formatAmount(handle.value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div className="slider-tracks">
                  {tracks.map(({ id, source, target }) => (
                    <div
                      key={id}
                      style={{
                        position: 'absolute',
                        left: `${source.percent}%`,
                        width: `${target.percent - source.percent}%`,
                        height:4,
                        zIndex: 1,
                        borderRadius: 4,
                        backgroundColor: '#413DF7',
                      }}
                      {...getTrackProps()}
                    />
                  ))}
                </div>
              )}
            </Tracks>
          </Slider>
        </div><br /><br />
        <div>
          <span className='filter-section'>RATING<br /></span><br />
          <label className="custom-checkbox-label">
            <input
              type="checkbox"
              value="5"
              onChange={() => toggleFounderRating("5")}
            />&nbsp;
            ★★★★★
          </label>
          <label  className="custom-checkbox-label">
            <input
              type="checkbox"
              value="4"
              onChange={() => toggleFounderRating("4")}
            />&nbsp;
            ★★★★
          </label>
          <label  className="custom-checkbox-label">
            <input
              type="checkbox"
              value="3"
              onChange={() => toggleFounderRating("3")}
            />&nbsp;
            ★★★
          </label>
          <label  className="custom-checkbox-label">
            <input
              type="checkbox"
              value="2"
              onChange={() => toggleFounderRating("2")}
            />&nbsp;
            ★★
          </label>
          <label  className="custom-checkbox-label">
            <input
              type="checkbox"
              value="1"
              onChange={() => toggleFounderRating("1")}
            />&nbsp;
            ★
          </label>
          <label  className="custom-checkbox-label">
            <input
              type="checkbox"
              value="0"
              onChange={() => toggleFounderRating("Unrated")}
            />&nbsp;
            Unrated
          </label>&nbsp;&nbsp;
        </div><br /><br />
        
      </div>
    </div>
  );
};

export default LPFiltersSidebar;
