import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SessionDetails.module.css'; 

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/session/view/${id}`);
        setSession(res.data);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || 'Failed to load session details.';
        setError(msg);
      }
    };

    fetchSession();
  }, [id]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!session) return <p className={styles.loading}>Loading session...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🪷 Session Details</h2>
      <div className={styles.card}>
        <h3>{session.title}</h3>
        <p><strong>Tags:</strong> {session.tags.join(', ')}</p>
        <p><strong>Notes:</strong></p>
        <p className={styles.notes}>{session.notes}</p>
        <a
          href={session.json_file_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Open JSON File ↗
        </a>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SessionDetails;
