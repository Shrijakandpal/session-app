import React, { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import API from "../services/api.js";
import styles from "./RegistrationPage.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
        console.log('Registration error:', err.response?.data || err.message);
      setError("Registration failed. Try a different email.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />
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
        <button type="submit" className={styles.button}>
          Register
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already a user? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
