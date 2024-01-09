// Layout.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppBar from './AppBar';
import Home from './Home';
import Invoice from './Invoice';
import Payrun from './Payrun';
import AddReport from './AddReport';
import AddPayrun from './AddPayrun';
import ReportDetail from './components/ReportDetail';
import ShiftNotePage from './ShiftNotePage';

const Layout = () => {
  const [pageTitle, setPageTitle] = useState('Client Notes');

  const handleMenuClick = (title) => {
    setPageTitle(title);
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'row' ,overflowY: 'auto', height: '100vh' }}>
        {/* Left Column for Menu */}
        <div style={{ width: '200px', background: '#f0f0f0', padding: '10px', overflowY: 'auto', height: '100vh' }}>
          <h3>Menu</h3>
          <ul>
            <li>
              <Link to="/" onClick={() => handleMenuClick('Client Notes')}>
              Client Notes
              </Link>
            </li>
            <li>
              <Link to="/invoice" onClick={() => handleMenuClick('Invoice')}>
                Invoice
              </Link>
            </li>
            <li>
              <Link to="/payrun" onClick={() => handleMenuClick('Payrun')}>
              Payrun
              </Link>
            </li>
            <li>
              <Link to="/allnote" onClick={() => handleMenuClick('All Notes')}>
                All Notes
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column for AppBar and Content */}
        <div style={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <AppBar pageTitle={pageTitle} />
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/allnote" element={<Home />} />
              <Route path="/" element={<ShiftNotePage />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/payrun" element={<Payrun />} />
              <Route path="/addreport" element={<AddReport />} />
              <Route path="/addpayrun" element={<AddPayrun />} />
              <Route path="/reportdetail/:id" element={<ReportDetail />} /> {/* 映射 ReportDetail 组件 */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Layout;
