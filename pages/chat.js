import React, { useState, useEffect } from 'react';
import ChatRoom from '../components/ChatRoom';
import SpeechToText from '../components/SpeechToText';
import axios from 'axios';
import { useRouter } from 'next/router';

const ChatPage = () => {
  const router = useRouter();
  const { username, token } = router.query;
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('/api/chatrooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchRooms();
  }, [token]);

  const createRoom = async () => {
    if (!roomName) return;
    try {
      await axios.post('/api/chatrooms', { roomName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms([...rooms, { roomName, createdBy: username, createdAt: new Date() }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%', paddingRight: '20px' }}>
          <h2>Chat Rooms</h2>
          <ul>
            {rooms.map((room, index) => (
              <li
                key={index}
                onClick={() => setRoomName(room.roomName)}
                style={{ cursor: 'pointer' }}
              >
                {room.roomName}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="New Room Name"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
        </div>
        <div style={{ width: '70%' }}>
          {roomName ? (
            <div>
              <ChatRoom token={token} roomName={roomName} username={username} />
              <SpeechToText onTranscribe={(text) => console.log('Transcribed:', text)} />
            </div>
          ) : (
            <p>Select a room to join the conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
