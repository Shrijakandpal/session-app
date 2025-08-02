import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditSession.module.css';
import axios from 'axios';

const EditSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.REACT_APP_BASE_URL}/api/session/my-sessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const session = res.data;
        setTitle(session.title);
        setTags(session.tags.join(', '));
        setJsonFileUrl(session.json_file_url);
        setNotes(session.notes);
      } catch (error) {
        setMessage('Failed to fetch session data.');
      }
    };

    fetchSession();
  }, [id]);

  const handleSaveDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/session/${id}`,
        {
          title,
          tags: tags.split(',').map(tag => tag.trim()),
          json_file_url: jsonFileUrl,
          notes,
          status: 'draft',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Draft saved successfully.');
      navigate('/my-sessions');
    } catch (error) {
      setMessage('Failed to save draft.');
    }
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/session/${id}`,
        {
          title,
          tags: tags.split(',').map(tag => tag.trim()),
          json_file_url: jsonFileUrl,
          notes,
          status: 'published',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Session published successfully.');
      navigate('/my-sessions');
    } catch (error) {
      setMessage('Failed to publish session.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Edit Wellness Session</h2>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="JSON File URL"
          value={jsonFileUrl}
          onChange={(e) => setJsonFileUrl(e.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className={styles['button-group']}>
          <button className={`${styles.button} ${styles.save}`} onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button className={`${styles.button} ${styles.publish}`} onClick={handlePublish}>
            Publish
          </button>
        </div>
        <button
          onClick={() => navigate('/my-sessions')}
          className={styles.backButton}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cancel / Back to My Sessions
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default EditSession;
