import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from '../styles/ChatRoom.module.css';

const ChatRoom = ({ token, roomName, username, createdBy, onExit }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  // Helper to mark fetched messages as "old"
  const markOldMessages = (messages) =>
    messages.map((msg) => ({ ...msg, isOld: true }));

  // Initialize the socket connection on client side
  useEffect(() => {
    // Only run on client; use window.location.origin to connect to the same host.
    socketRef.current = io(window.location.origin, {
      path: '/api/socket',
    });

    socketRef.current.emit('join-room', { roomName, username });

    socketRef.current.on('receive-message', (newMessage) => {
      setChatHistory((prev) => [...prev, { ...newMessage, isOld: false }]);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-room', { roomName, username });
        socketRef.current.off('receive-message');
        socketRef.current.disconnect();
      }
    };
  }, [roomName, username]);

  // Fetch chat history when roomName changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`/api/chathistory?roomName=${roomName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatHistory(markOldMessages(res.data));
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (roomName) {
      fetchChatHistory();
    }
  }, [roomName, token]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const messageObj = { roomName, username, message };
    try {
      // Emit the message via Socket.io
      socketRef.current.emit('send-message', messageObj);

      // Store the message in the database via API
      const res = await axios.post(
        '/api/sendmessage',
        messageObj,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Append message to chat history
      setChatHistory((prev) => [...prev, { ...res.data, isOld: false }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const isAdmin = createdBy === username;

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatHeader}>
        <h3>
          Chat Room - {roomName}{' '}
          {isAdmin ? ` (Admin: ${createdBy})` : ` (Created by: ${createdBy})`}
        </h3>
        <button onClick={onExit} className={styles.exitButton}>
          Exit Room
        </button>
      </div>

      <div className={styles.chatBody}>
        <div className={styles.leftPanel}>
          <h4>Online Users</h4>
          <ul className={styles.userList}>
            <li className={styles.userItem}>
              <strong>{username} (You)</strong> 🟢
            </li>
            {/* Implement real presence tracking here */}
          </ul>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.chatHistory}>
            <ul>
              {chatHistory.map((msg, index) => (
                <li
                  key={index}
                  className={`${styles.chatMessage} ${
                    msg.isOld ? styles.oldMessage : ''
                  }`}
                >
                  <strong>{msg.username}: </strong>
                  <span>{msg.message}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.input}
            />
            <button onClick={sendMessage} className={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
