/* eslint-disable react/prop-types */
import { useState } from 'react';

import useNotification from '../../hooks/useNotification';

import myAxios from '../../helpers/api/axios';
import useAuth from '../../hooks/useAuth';

function Login({ togglePage }) {
  const { setUser } = useAuth();
  const { handleNotification } = useNotification();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    handleNotification.show('info', 'Loggin in ....');
    try {
      const res = await myAxios.post('/users/login', formData);
      setUser(res.data.users);
      handleNotification.show('success', 'Login was successfull');
    } catch (e) {
      handleNotification.show('error', e.message);
    }
  };

  return (
    <>
      <form className='login_form'>
        <input
          className='login_form_email'
          required
          name='email'
          type='text'
          onChange={handleChange}
          value={formData.email}
          placeholder='Email Address'
        />
        <input
          className='login_form_password'
          required
          name='password'
          type='password'
          onChange={handleChange}
          value={formData.password}
          placeholder='Password'
        />
        <button className='submit_btn' type='Login' onClick={handleSubmit}>
          Login
        </button>
      </form>
      <div className='toggle_wrapper'>
        <button className='toggle_btn' onClick={togglePage}>
          Register Instead
        </button>
      </div>
    </>
  );
}

export default Login;


