import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './MySessions.module.css';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Please login first.');
      return;
    }

    const fetchMySessions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/session/my-sessions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your sessions. Please login again.');
      }
    };

    fetchMySessions();
  }, [token]);

  const handleEdit = (id) => {
    console.log("Editing session with ID:", id);
    navigate(`/session/edit/${id}`);
  };

  const handlePublish = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/session/publish/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === id ? { ...session, status: 'published' } : session
        )
      );

      alert('Session published successfully!');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish session. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Wellness Sessions</h2>

      <button
        onClick={handleBackToDashboard}
        className={styles.backButton}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#ccffcc',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back to Dashboard
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {sessions.length === 0 ? (
        <p className={styles.noSessions}>No sessions found. Create some!</p>
      ) : (
        <div className={styles.sessionList}>
          {sessions.map((session) => (
            <div className={styles.sessionCard} key={session._id}>
              <h3 className={styles.sessionTitle}>{session.title}</h3>
              <p className={styles.sessionStatus}>Status: {session.status}</p>
              <p className={styles.sessionTags}>Tags: {session.tags.join(', ')}</p>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleEdit(session._id)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                {session.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(session._id)}
                    className={styles.publishButton}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
