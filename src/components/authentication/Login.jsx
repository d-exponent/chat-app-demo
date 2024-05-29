/* eslint-disable react/prop-types */
import { useRef } from "react";
import axios from "axios";

import useNotification from "../../hooks/useNotification";

import useAuth from "../../hooks/useAuth";

function Login({ togglePage }) {
  const { setUser } = useAuth();
  const { handleNotification } = useNotification();

  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current?.value;

    if (!email) {
      handleNotification.show("error", "Please provide your email address");
      return;
    }

    handleNotification.show("info", "Loggin in ....");

    // Just a local server that fetches users by email.
    // Tarons auth url uses email and password which is cumbersome as i only know mine.
    const url = "http://localhost:3000/login";

    try {
      const res = await axios.post(url, { email: email.trim().toLowerCase() });
      setUser(res.data.data);
      handleNotification.show("success", "Login was successfull");
    } catch (e) {
      handleNotification.show("error", e.message);
    }
  };

  return (
    <>
      <form className="login_form">
        <input
          className="login_form_email"
          type="email"
          placeholder="Email Address"
          ref={emailRef}
          required
        />

        <button className="submit_btn" type="Login" onClick={handleSubmit}>
          Login
        </button>
      </form>

      <div className="toggle_btn_wrapper">
        <button className="toggle_btn" onClick={togglePage}>
          Register Instead?
        </button>
      </div>
    </>
  );
}

export default Login;
