import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WellnessForm.module.css';

const WellnessForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const timeoutRef = useRef(null);

  const saveDraft = async () => {
    const token = localStorage.getItem('token');
    if (!token || !title.trim() || !jsonFileUrl.trim()) return;

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      setAutoSaving(true);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/session/my-sessions/save-drafts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          tags: tagsArray,
          json_file_url: jsonFileUrl.trim(),
          notes: notes.trim(),
          status: 'draft',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Draft auto-saved');
      } else {
        console.error('❌ Auto-save failed:', result);
      }
    } catch (err) {
      console.error('❌ Auto-save error:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  // Auto-save when user stops typing for 2s
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 2000);
    return () => clearTimeout(timeoutRef.current);
  }, [title, tags, jsonFileUrl, notes]);

  const handleSaveDraft = async () => {
    setMessage('');
    await saveDraft();
    setMessage('✅ Draft saved manually!');
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: '15px',
            padding: '8px 12px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#28a745',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>

        <h2 className={styles.heading}>Create Wellness Session</h2>

        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="JSON File URL"
          value={jsonFileUrl}
          onChange={(e) => setJsonFileUrl(e.target.value)}
          className={styles.input}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={styles.textarea}
        />

        <button
          onClick={handleSaveDraft}
          className={`${styles.button} ${styles.save}`}
        >
          Save Draft
        </button>

        {autoSaving && <p className={styles.message}>⏳ Auto-saving draft...</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default WellnessForm;
