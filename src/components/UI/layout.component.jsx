/* eslint-disable react/prop-types */
import "./layout.css";

import useAuth from "../../hooks/useAuth";

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="container">
      <header>
        <h2 className="logo">Chat application</h2>
        {isAuthenticated === true && (
          <div className="details-wrapper">
            <span>{user.userName}</span>
            <button className="logout-btn" onClick={logout}>
              logout
            </button>
          </div>
        )}
      </header>
      <main>
        <>{children}</>
      </main>
    </div>
  );
};

export default Layout;
