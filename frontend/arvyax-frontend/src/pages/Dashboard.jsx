import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import './Dashboard.css';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchSessions = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/session/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSessions(res.data);
  } catch (err) {
    console.error(err);
    setError('Failed to fetch sessions. Please login again.');
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this session?');
  if (!confirmDelete) return;

  try {
    setLoading(true);
    await axios.delete(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/session/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSessions((prev) => prev.filter((s) => s._id !== id));
  } catch (err) {
    console.error(err);
    alert('Failed to delete session. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/register'); // ← as per your instruction
  };
 useEffect(() => {
    fetchSessions();
  }, [token]);
  return (
    <div className="container">
      <div className="dashboard-box">
        <p className="quote">“Self-care is how you take your power back.”</p>
        <h2 className="dashboard-title">🪷 Explore Your Healing Sessions</h2>

        <div className="button-bar">
          <Link to="/create-session" className="create-button">
            ➕ Create New Session
          </Link>
          <Link to="/my-sessions" className="my-sessions-button">
            📋 My Sessions
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        {sessions.length === 0 ? (
          <p className="no-sessions">No sessions found.</p>
        ) : (
          <div className="session-list">
            {sessions.map((session) => (
              <div className="session-card" key={session._id}>
                <h3 className="session-title">{session.title}</h3>
                <p className="session-tags">Tags: {session.tags.join(', ')}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/session/view/${session._id}`} className="session-link">
                    View
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(session._id)}
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
