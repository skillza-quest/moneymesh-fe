import React, { useState, useEffect } from 'react';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';

const FiltersSidebar = ({ setFilters }) => {
    const [values, setValues] = useState([0, 10000000]);    
    const [selectedIndustries, setSelectedIndustries] = useState([]);    
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [investmentStages, setInvestmentStages] = useState(['Preseed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D']);
    const [selectedInvestmentStages, setSelectedInvestmentStages] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]); 
    const [selectedFounderRatings, setSelectedFounderRatings] = useState([]); // New state for selected founder ratings
    const [selectedInvestorTypes, setSelectedInvestorTypes] = useState([]); // New state for selected investor types

    const [tags, setTags] = useState('');
    const [investmentType, setInvestmentType] = useState('');

    const sliderStyle = {
        position: 'relative',
        left: 20,
        width: '80%',
    };
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
          investmentStages: selectedInvestmentStages,
        }));
    }
    useEffect(() => {
        handleFilterChange();
    }, [selectedRegions, selectedIndustries]);
    const handleFilterChange = () => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          region: selectedRegions,
          industries: selectedIndustries,
          investmentStages: investmentStages,
          grades: selectedGrades,
          founderRatings: selectedFounderRatings,
          investorTypes: selectedInvestorTypes, 
        }));
      };
    const toggleIndustry = (industry) => {
        setSelectedIndustries(prevSelected => {
          if (prevSelected.includes(industry)) {
            return prevSelected.filter(item => item !== industry);
          } else {
            return [...prevSelected, industry];
          }
        });
      };
      const toggleRegion = (region) => {
        setSelectedRegions((prevSelected) => {
          if (prevSelected.includes(region)) {
            return prevSelected.filter((item) => item !== region);
          } else {
            return [...prevSelected, region];
          }
        });
      };
      const toggleInvestmentStage = (stage) => {
        setSelectedInvestmentStages((prevSelected) => {
          if (prevSelected.includes(stage)) {
            return prevSelected.filter((item) => item !== stage);
          } else {
            return [...prevSelected, stage];
          }
        });
      };
      const toggleGrade = (grade) => {
        setSelectedGrades((prevSelected) => {
          if (prevSelected.includes(grade)) {
            return prevSelected.filter((item) => item !== grade);
          } else {
            return [...prevSelected, grade];
          }
        });
      };
      const toggleFounderRating = (rating) => {
        setSelectedFounderRatings((prevSelected) => {
          if (prevSelected.includes(rating)) {
            return prevSelected.filter((item) => item !== rating);
          } else {
            return [...prevSelected, rating];
          }
        });
      };
      const toggleInvestorType = (type) => {
        setSelectedInvestorTypes((prevSelected) => {
          if (prevSelected.includes(type)) {
            return prevSelected.filter((item) => item !== type);
          } else {
            return [...prevSelected, type];
          }
        });
      };
  return (
    <div className="filters-sidebar">
      <div style={{minHeight: 500}}>
        <div className="filter-section">
          <strong>INDUSTRY<br /></strong>
          <label>
          <input
            type="checkbox"
            value="Tech"
            onChange={() => toggleIndustry("Edtech")}
          />&nbsp;
          Edtech
          </label><br />
          <label>
            <input
              type="checkbox"
              value="Health"
              onChange={() => toggleIndustry("Fintech")}
            />&nbsp;
            Fintech
          </label><br />
          <label>
            <input
              type="checkbox"
              value="Finance"
              onChange={() => toggleIndustry("Finance")}
            />&nbsp;
            Finance
          </label><br />
        </div>

        <div className="filter-section"><br />
          <strong>REGION</strong><br />
          <label>
      <input
        type="checkbox"
        value="North America"
        onChange={() => toggleRegion("North America")}
      />&nbsp;
      North America
    </label><br />
    <label>
      <input
        type="checkbox"
        value="Europe"
        onChange={() => toggleRegion("Europe")}
      />&nbsp;
      Europe
    </label><br />
    <label>
      <input
        type="checkbox"
        value="Asia"
        onChange={() => toggleRegion("Asia")}
      />&nbsp;
      Asia
    </label>
        </div>

        <div className="filter-section"><br />
        <strong>INVESTMENT AMOUNT<br /></strong><br />
          <Slider
            rootStyle={sliderStyle}
            domain={[0, 5000000]}
            step={10000}
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
                        {handle.value}
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
        <div className="filter-section">
          <strong>INVESTMENT STAGE</strong><br />
          {investmentStages.map((stage) => (
            <label key={stage}>
              <input
                type="checkbox"
                value={stage}
                onChange={() => toggleInvestmentStage(stage)}
                checked={selectedInvestmentStages.includes(stage)}
              />&nbsp;
              {stage}&nbsp;&nbsp;
            </label>
          ))}
        </div><br />
        <div className="filter-section">
          <strong>INVESTOR GRADE</strong><br />
          <label>
            <input
              type="checkbox"
              value="A"
              onChange={() => toggleGrade("A")}
            />&nbsp;
            A
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="B"
              onChange={() => toggleGrade("B")}
            />&nbsp;
            B
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="C"
              onChange={() => toggleGrade("C")}
            />&nbsp;
            C
          </label>
        </div><br /><br />
        <div className="filter-section">
          <strong>FOUNDER RATING</strong><br />
          <label>
            <input
              type="checkbox"
              value="Best"
              onChange={() => toggleFounderRating("Best")}
            />&nbsp;
            Best
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="Good"
              onChange={() => toggleFounderRating("Good")}
            />&nbsp;
            Good
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="Average"
              onChange={() => toggleFounderRating("Average")}
            />&nbsp;
            Average
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="Bad"
              onChange={() => toggleFounderRating("Bad")}
            />&nbsp;
            Bad
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="Terrible"
              onChange={() => toggleFounderRating("Terrible")}
            />&nbsp;
            Terrible
          </label>&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              value="Unrated"
              onChange={() => toggleFounderRating("Unrated")}
            />&nbsp;
            Unrated
          </label>&nbsp;&nbsp;
        </div><br /><br />
        <div className="filter-section">
          <strong>INVESTOR TYPE</strong><br />
          <label>
            <input
              type="checkbox"
              value="Individual"
              onChange={() => toggleInvestorType("Individual")}
            />&nbsp;
            Individual
          </label><br />
          <label>
            <input
              type="checkbox"
              value="Fund"
              onChange={() => toggleInvestorType("Fund")}
            />&nbsp;
            Fund
          </label><br />
          <label>
            <input
              type="checkbox"
              value="Unknown"
              onChange={() => toggleInvestorType("Unknown")}
            />&nbsp;
            Unknown
          </label><br />
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
