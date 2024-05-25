import { useState } from "react";

import Login from "../../components/authentication/Login";
import Register from "../../components/authentication/Register";

import "./styles.css";

const AuthForms = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleShowLogin = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <div className="wrapper">
      {showLogin && <Login togglePage={toggleShowLogin} />}
      {!showLogin && <Register togglePage={toggleShowLogin} />}
    </div>
  );
};

export default AuthForms;
