import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../MandateSelector.css';

const MandateSelector = ({ investorId }) => {
  const [mandates, setMandates] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  const popoverRef = useRef(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Define the async function inside the effect
    const fetchMandates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/mandates/user/${userId}`);
        console.log("userMandates", response.data);
        setMandates(response.data);
      } catch (error) {
        console.error('Error fetching mandates:', error);
      }
    };

    fetchMandates(); // Call the async function
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };
  
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);
  
  const handleMandateSelect = (mandateId) => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}/mandates/${mandateId}/addInvestor`, { investorId: investorId })
      .then(() => {
        // Handle success (e.g., show a success message)
        setShowPopover(false); // Close the popover
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => setShowSuccessMessage(false), 3000);

      })
      .catch(error => {
        setShowPopover(false); // Close the popover
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => setShowSuccessMessage(false), 3000);
        console.error(error)
      });
  };

  return (
    <>&nbsp;&nbsp;
      <div style={{position:'relative'}}>
        <button 
          className="btn btn-small btn-secondary float-right"
          onClick={() => setShowPopover(!showPopover)}>
          <strong>+ Add to Mandate</strong>
        </button>
        {showPopover && (
          <div ref={popoverRef} className="popover-menu">
            <ul>
              {mandates.map((mandate, index) => (
                <li key={index} onClick={() => handleMandateSelect(mandate._id)}>
                  {mandate.mandateName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showSuccessMessage && (
      <div className="success-message">
        Added to mandate.
      </div>
    )}
    </>
  );
};

export default MandateSelector;
