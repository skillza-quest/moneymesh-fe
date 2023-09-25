
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import BulkUpload from './pages/BulkUpload';
import InvestorList from './pages/InvestorList';
import InvestorDetail from './pages/InvestorDetail';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';
import { UserIdProvider } from './context/UserIdContext';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import gifSrc from './infinite-loader.gif'


function App() {
  const RedirectToInvestors = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/investors');
    }, [navigate]);
    return null;
  };
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log("User", user);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user['https://moneymesh.com/roles']) {
        const roles = user['https://moneymesh.com/roles'];
        setIsAdmin(roles.includes('Admin'));
      }
      
      fetch('http://65.0.135.92:3001/users/handleuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0UserId: user.sub, 
          username: user.nickname, 
          email: user.email, 
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('userId', user.sub);
      })
      .catch((error) => {
        console.error('Error sending user data to the server:', error);
      });
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div style={{width:'100%', height: '100%', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
    <img src={gifSrc} alt="Loading..." className="centered-gif" width="100px"/>
  </div>;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/" element={<RedirectToInvestors />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
        {isAuthenticated ? (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/investors" element={<InvestorList />} />
            <Route path="/investors/:id" element={<InvestorDetail />} />
          </>
        ) : (
          // Redirect unauthenticated users to the login page
          <Route path="/investors" element={<LoginPage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
