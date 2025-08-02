import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../services/api.js';
import styles from './LoginPage.module.css';

function LoginPage(){
    const navigate=useNavigate();
    const[formData,setFormData]= useState({email:'', password :''});
    const [error,setError]= useState('');

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      console.log("request url",API)
      const token = res.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
 