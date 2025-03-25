import React,{ useState } from 'react';
import ChatRoom from '../components/ChatRoom';
import SpeechToText from '../components/SpeechToText';
import axios from 'axios';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import styles from '../styles/ChatPage.module.css';

const ChatPage = ({ user, roomsRes, error: initialError }) => {
  const router = useRouter();

  // We store the entire selected room object here
  const [selectedRoom, setSelectedRoom] = useState(null);

  // This holds the new room name input for creation
  const [newRoomName, setNewRoomName] = useState('');

  // List of rooms fetched from the server
  const [rooms, setRooms] = useState([...roomsRes]);

  // For displaying errors in the UI
  const [error, setError] = useState('');

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('authToken');
  //   const storedUsername = localStorage.getItem('username');
  //   if (!storedToken) {
  //     router.push('/');
  //   } else {
  //     setToken(storedToken);
  //     setUsername(storedUsername || 'Guest');
  //   }
  // }, [router]);

  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     try {
  //       const res = await axios.get('/api/chatrooms', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setRooms(res.data);
  //       setError('');
  //     } catch (err) {
  //       console.error('Error fetching rooms:', err);
  //       setError('Failed to fetch chat rooms. Please try again later.');
  //     }
  //   };
  //   if (token) {
  //     fetchRooms();
  //   }
  // }, [token]);

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      setError('Room name cannot be empty');
      return;
    }
    try {
      // Pass the current username as 'createdBy'
      const res = await axios.post(
        '/api/chatrooms',
        { roomName: newRoomName, createdBy: user.username }
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

  // Handle logout on client-side by calling a logout API route (optional) or simply redirect.
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout'); // optional server-side cookie clearing
    } catch (error) {
      console.error('Logout error:', error);
    }
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>Welcome, {user.username}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>
      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <h2>Chat Rooms</h2>
          {initialError && <p className={styles.error}>{initialError}</p>}
          <ul className={styles.roomList}>
            {rooms.map((room, index) => (
              <li
                key={index}
                onClick={() => setSelectedRoom(room)}
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
                token={''}
                roomName={selectedRoom.roomName}
                username={user.username}
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

export async function getServerSideProps(context) {
  const { req, res } = context;
  // Parse cookies
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token || null;

  // If token not found, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Verify token (ensure process.env.JWT_SECRET is set)
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Invalid token; clear cookie and redirect to login if desired
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Fetch chat room data from your API
  let rooms = [];
  let error = '';
  try {
    const roomsRes = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:3000'}/api/chatrooms`,
      {
        headers: {
          cookie: req.headers.cookie, // Forward the cookies to your API route
        },
      }
    );
    rooms = roomsRes.data;
  } catch (err) {
    //console.error('Error fetching rooms:', err);
    error = 'Failed to fetch chat rooms. Please try again later.';
  }

  return {
    props: {
      user, // decoded token containing username, id, etc.
      roomsRes: rooms,
      error,
    },
  };
}

export default ChatPage;
