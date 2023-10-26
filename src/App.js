import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import BulkUpload from './pages/BulkUpload';
import InvestorList from './pages/InvestorList';
import InvestorDetail from './pages/InvestorDetail';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ProfilePage from './pages/ProfilePage';
import Loader from './components/Loader';
import './App.css';

import { UserIdProvider } from './context/UserIdContext';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import gifSrc from './infinite-loader.gif'
import UserMandates from './components/UserMandates';
import MandatePage from './pages/MandatePage';
import MandateInvestorPage from './pages/MandateInvestorPage';
import NewInvestorForm from './pages/NewInvestor';
import UpdateInvestorForm from './pages/UpdateInvestor';
import AcceptInvitePage from './components/AcceptInvite';
import CreateMandate from './pages/CreateMandatePage';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    if (isAuthenticated && user && user['https://moneymesh.com/roles']) {
      const roles = user['https://moneymesh.com/roles'];
      setUserId(user.sub);
      localStorage.setItem('userId', user.sub);

      if (roles.includes('Admin')) {
        setUserRole('Admin');
        localStorage.setItem('userRole', 'Admin');
        navigate('/bulk-upload');
      } else if (roles.includes('Investor')) {
        setUserRole('Investor');
        localStorage.setItem('userRole', 'Investor');
        navigate('/mandates/create');
      } else if (roles.includes('Startup')) {
        setUserRole('Startup');
        localStorage.setItem('userRole', 'Startup');
        navigate('/mandates');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/investors" element={<InvestorList />} />
        <Route path="/investors/new" element={<NewInvestorForm />} />
        <Route path="/investors/update/:id" element={<UpdateInvestorForm />} />
        <Route path="/investors/:id" element={<InvestorDetail />} />
        <Route path="/mandates" element={<UserMandates />} />
        <Route path="/mandates/create" element={<CreateMandate />} />
        <Route path="/mandates/:mandateId" element={<MandatePage />} />
        <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
        <Route path="/mandates/:mandateId/investor/:investorId" element={<MandateInvestorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

