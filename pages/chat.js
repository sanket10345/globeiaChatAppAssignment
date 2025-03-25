import React, { useState, useEffect } from 'react';
import ChatRoom from '../components/ChatRoom';
import SpeechToText from '../components/SpeechToText';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/ChatPage.module.css';

const ChatPage = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  // We store the entire selected room object here
  const [selectedRoom, setSelectedRoom] = useState(null);

  // This holds the new room name input for creation
  const [newRoomName, setNewRoomName] = useState('');

  // List of rooms fetched from the server
  const [rooms, setRooms] = useState([]);

  // For displaying errors in the UI
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (!storedToken) {
      router.push('/');
    } else {
      setToken(storedToken);
      setUsername(storedUsername || 'Guest');
    }
  }, [router]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('/api/chatrooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to fetch chat rooms. Please try again later.');
      }
    };
    if (token) {
      fetchRooms();
    }
  }, [token]);

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      setError('Room name cannot be empty');
      return;
    }
    try {
      // Pass the current username as 'createdBy'
      const res = await axios.post(
        '/api/chatrooms',
        { roomName: newRoomName, createdBy: username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // The response should contain the newly created room object
      setRooms([...rooms, res.data]);
      setNewRoomName(''); // Clear input
      setError('');
    } catch (err) {
      console.error('Error creating room:', err);
      setError(err.response?.data?.error || 'Error creating room. Please try again later.');
    }
  };

  // Called when user clicks "Exit Room" in ChatRoom
  const handleExitRoom = () => {
    setSelectedRoom(null);
  };

  if (!token) {
    return null; // Optionally show a loading spinner
  }
  const handleLogout = () => {
      // Store token and username in localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      // Redirect to chat page
      window.location.href = '/';
  };
  return (
    <div className={styles.container}>
  <header className={styles.header}>
    <span>Welcome, {username}</span>
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
   </header>
      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <h2>Chat Rooms</h2>
          {error && <p className={styles.error}>{error}</p>}
          <ul className={styles.roomList}>
            {rooms.map((room, index) => (
              <li
                key={index}
                onClick={() => setSelectedRoom(room)} // store the entire room object
                className={styles.roomItem}
              >
                {room.roomName}
              </li>
            ))}
          </ul>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="New Room Name"
              className={styles.input}
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={createRoom} className={styles.button}>
              Create
            </button>
          </div>
        </aside>

        <section className={styles.content}>
          {selectedRoom ? (
            <>
              <ChatRoom
                token={token}
                roomName={selectedRoom.roomName}
                username={username}
                createdBy={selectedRoom.createdBy}
                onExit={handleExitRoom}
              />
              <SpeechToText onTranscribe={(text) => console.log('Transcribed:', text)} />
            </>
          ) : (
            <p className={styles.placeholder}>
              Select a room to join the conversation.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ChatPage;
