import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './SessionDetails.module.css'; // reuse same styles

const PublicSessionDetails = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/session/view/${id}`);
        setSession(res.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load session.';
        setError(msg);
      }
    };

    fetchSession();
  }, [id]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!session) return <p className={styles.loading}>Loading session...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🪷 Public Session View</h2>
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
        <Link to="/" className={styles.backBtn}>← Back</Link>
      </div>
    </div>
  );
};

export default PublicSessionDetails;
