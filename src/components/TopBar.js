import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light bg-white mb-4">
      <div className="container">
        {/* Logo (left-aligned) */}
        <a className="navbar-brand" href="#">
          <strong style={{ color: 'rgb(65, 61, 247)', fontWeight: 800 }}>moneymesh</strong>
        </a>

        {/* Menu button (hamburger icon) */}
        <button className="navbar-toggler" type="button">
          <i className="fa fa-bars"></i>
        </button>

        {/* Right-aligned links */}
        <div className="navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            
            {/* New Links */}
            <li className="nav-item">
              <NavLink to="/mandates" className="active-link">
                Mandates
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/investors" className="active-link">
                Investors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/startups" className="active-link">
                 Startups
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/people" className="active-link">
                People
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className="active-link">
                Profile
              </NavLink>
            </li>
            <li className="nav-item" onClick={() => logout()}>
              <NavLink to="/profile" className="active-link">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
