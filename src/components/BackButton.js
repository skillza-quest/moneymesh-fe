import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <div className="back-button" onClick={() => navigate(-1)}>
            <div className="icon-wrapper">
                <svg viewBox="0 0 24 24" className="arrow-icon">
                    {/* Line arrow icon */}
                    <path d="M10 6l-6 6 6 6M4 12h16" stroke="#333333" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="text">Go Back</div>
        </div>
    );
};

export default BackButton;
