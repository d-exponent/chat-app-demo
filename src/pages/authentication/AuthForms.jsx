import { useState } from "react";

import Login from "../../components/authentication/Login";
import Register from "../../components/authentication/Register";

import "./styles.css";

const AuthForms = () => {
  const [showLogin] = useState(true);

  const toggleShowLogin = () => {
    // setShowLogin((prev) => !prev);
  };

  return (
    <div className="wrapper">
      <Login togglePage={toggleShowLogin} />
      {/* {!showLogin && <Register togglePage={toggleShowLogin} />} */}
    </div>
  );
};

export default AuthForms;
