import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const Topbar = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  console.log("userRole is", userRole);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light bg-white mb-4">
      <div className="container">
        {/* Logo (left-aligned) */}
        <a className="navbar-brand" href="/mandates">
          <img src={logo} width={130} />
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
            {userRole !== 'Startup' && (
                <>
                    <li className="nav-item">
                        <NavLink to="/limited-partners" className="active-link">
                            LPs
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/investors" className="active-link">
                            Investors
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/people" className="active-link">
                            People
                        </NavLink>
                    </li>
                </>
            )}
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
