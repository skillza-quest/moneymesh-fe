import { useAuth0 } from '@auth0/auth0-react';
import TopBar from '../components/TopBar';
function ProfilePage() {
  const { user, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <>
        <TopBar />
        <div className="container">
            <div className="row">
                
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
    </>
  ) : null;
}
export default ProfilePage;