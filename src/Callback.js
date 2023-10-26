import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Callback = () => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      // Loading state, you can display a loading spinner here.
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, you can redirect to a protected route or home page.
      // For example, use react-router-dom's history to navigate:
      history.push('/dashboard');
    }

    if (error) {
      // Handle authentication error, e.g., show an error message.
      console.error('Authentication error:', error);
    }

    // If not loading, not authenticated, and no error, initiate the login.
    loginWithRedirect();
  }, [isLoading, isAuthenticated, error, loginWithRedirect]);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && !isAuthenticated && <p>Redirecting to login...</p>}
      {/* You can also display error messages here */}
    </div>
  );
};

export default Callback;
