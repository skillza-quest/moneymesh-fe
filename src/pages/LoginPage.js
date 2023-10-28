// LoginPage.js

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-11 col-md-6 col-lg-4"><br /><br />
          <div className="card-ext text-center"><br />
            <strong>Welcome to Spotlight</strong><br /><br />
            Your one stop platform to access up-to-date information regarding the startup ecosystem worldwide.<br /><br />
            <button className="btn btn-primary btn-lg" style={{width: '100%', maxWidth: '320px'}} onClick={() => loginWithRedirect()}><small>Login to access Spotlight</small></button>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default LoginPage;
