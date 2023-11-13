import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = "dev-hxnqq1jp5xvm1err.us.auth0.com";
  const clientId = "pwp8X519Jcs33fpWTWzIiofVXQqDlVHT";
  const redirectUri = process.env.REACT_APP_AUTH0_REDIRECT_URI || window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirectUri}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
