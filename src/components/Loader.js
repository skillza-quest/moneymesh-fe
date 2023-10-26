import React from 'react';
import gifSrc from '../infinite-loader.gif';

const Loader = () => {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: 600, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative' 
      }}
    >
      <img src={gifSrc} alt="Loading..." className="centered-gif" width="100px"/>
    </div>
  );
};

export default Loader;
