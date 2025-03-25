import React, { useState } from 'react';
import axios from 'axios';
import FaceCapture from '../components/FaceCapture';
import styles from '../styles/IndexPage.module.css';

const IndexPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [faceDescriptor, setFaceDescriptor] = useState(null);

  const handleFaceCapture = (descriptor) => {
    setFaceDescriptor(descriptor);
  };

  const handleSubmit = async () => {
    // Basic validations for both sign up and login
    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }
    // Only enforce password length on sign up
    if (isSignup && password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (!faceDescriptor) {
      alert('Please capture your face!');
      return;
    }
    
    // If signing up, check for duplicate username
    if (isSignup) {
      try {
        const checkRes = await axios.post('/api/auth/checkusername', { username });
        if (checkRes.data.exists) {
          alert('Username already exists. Please choose a different one.');
          return;
        }
      } catch (error) {
        console.error('Error checking username:', error);
        alert('Error checking username. Please try again later.');
        return;
      }
    }
    
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const res = await axios.post(endpoint, { username, password, faceDescriptor });
      // Store token and username in localStorage
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('username', username);
      // Redirect to chat page
      window.location.href = '/chat';
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</h1>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* FaceCapture Component */}
        <FaceCapture onCapture={handleFaceCapture} />
        <button onClick={handleSubmit} className={styles.button}>
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
        <button
          onClick={() => setIsSignup(!isSignup)}
          className={styles.switchButton}
        >
          Switch to {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
