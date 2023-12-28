// AppBar.js
import React from 'react';

const AppBar = ({ pageTitle }) => {
  return (
    <div style={{ backgroundColor: '#2196F3', padding: '10px', color: 'white' }}>
      <h2>{pageTitle}</h2>
    </div>
  );
};

export default AppBar;
