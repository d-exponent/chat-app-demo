/* eslint-disable react/prop-types */
import './layout.css';

import useAuth from '../../hooks/useAuth';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className='container'>
      <header>
        <h2>Chat application</h2>
        <div>
          <span>{(user && user.username) && user.username}</span>
          {isAuthenticated && (
            <button className='logout-btn' onClick={logout}>
              logout
            </button>
          )}
        </div>
      </header>
      <main>
        <>{children}</>
      </main>
    </div>
  );
};

export default Layout;
