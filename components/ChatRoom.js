import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const ChatRoom = ({ token, roomName, username }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket = io({ path: '/api/socket' });

    socket.emit('joinRoom', roomName);

    socket.on('receiveMessage', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomName]);

  const sendMessage = () => {
    socket.emit('sendMessage', { room: roomName, message, username });
    setMessage('');
  };

  return (
    <div>
      <h2>Room: {roomName}</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}{' '}
            <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
