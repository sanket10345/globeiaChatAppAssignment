import React, { useState } from 'react';
import axios from 'axios';
import FaceCapture from '../components/FaceCapture';

const IndexPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [token, setToken] = useState(null);

  const handleFaceCapture = (descriptor) => {
    setFaceDescriptor(descriptor);
  };

  const handleSubmit = async () => {
    if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }

    if (!faceDescriptor) {
      alert('Please capture your face!');
      return;
    }

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const res = await axios.post(endpoint, { username, password, faceDescriptor });

      setToken(res.data.token);
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication failed');
    }
  };

  if (token) {
    window.location.href = `/chat?username=${username}&token=${token}`;
    return null;
  }

  return (
    <div>
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      <FaceCapture onCapture={handleFaceCapture} />
      
      <button onClick={handleSubmit}>{isSignup ? 'Sign Up' : 'Login'}</button>
      <button onClick={() => setIsSignup(!isSignup)}>Switch to {isSignup ? 'Login' : 'Sign Up'}</button>
    </div>
  );
};

export default IndexPage;
