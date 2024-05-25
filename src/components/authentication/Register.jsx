/* eslint-disable react/prop-types */
import { useState } from "react";

import useAuth from "../../hooks/useAuth";

import useNotification from "../../hooks/useNotification";
import axios from "axios";

const Register = ({ togglePage }) => {
  const { setUser } = useAuth();
  const { handleNotification } = useNotification();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleNotification.show("info", "Processing");
    try {
      const res = await axios.post(
        "https://api.taronapp.com/authentication-service/api/v1/auth/login",
        formData
      );

      setUser(res.data.data);
      handleNotification.show("success", "signup successfull");
    } catch (e) {
      handleNotification.show("error", e.message);
    }
  };

  return (
    <>
      <form className="register_form">
        <input
          className="register_form_name"
          type="text"
          name="fullname"
          onChange={handleChange}
          value={formData.fullname}
          placeholder="Full Name"
          required
        />
        <input
          className="register_form_name"
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
          placeholder="Username"
          required
        />
        <input
          className="register_form_email"
          type="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email Address"
          required
        />
        <input
          className="register_form_password"
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="password"
          required
        />
        <button className="submit_btn" type="submit" onClick={handleSubmit}>
          Register
        </button>
      </form>
      <div className="toggle_btn_wrapper">
        <button className="toggle_btn" onClick={togglePage}>
          Login Instead
        </button>
      </div>
    </>
  );
};

export default Register;
