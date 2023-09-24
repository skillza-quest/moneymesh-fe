// Auth0Provider.js

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-hxnqq1jp5xvm1err.us.auth0.com"
      clientId="pwp8X519Jcs33fpWTWzIiofVXQqDlVHT"
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
