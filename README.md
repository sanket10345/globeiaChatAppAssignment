# Next.js Chat Application

## 📌 Overview
This is a **Next.js-based chat application** that allows users to **sign up or log in** using:
- **Username & Password**
- **Face Recognition**

Once logged in, users can:
- **Create a chat room**
- **Join existing chat rooms**
- **Send and receive messages in real-time**

Messages are stored in a **MongoDB database**. The application also includes **text-to-speech functionality**, allowing users to send voice messages of up to **10 minutes**.

---

## 🏗 Project Structure

```
📂 components
  📄 ChatRoom.js
  📄 FaceCapture.js
  📄 SignUpModal.js
  📄 SpeechToText.js
📂 lib
  📄 jwt.js
📂 models
  📄 ChatRoom.js
  📄 Message.js
  📄 User.js
📄 next.config.js
📄 package-lock.json
📄 package.json
📂 pages
  📄 _app.js
  📂 api
    📂 auth
      📄 checkusername.js
      📄 login.js
      📄 logout.js
      📄 signup.js
    📄 chathistory.js
    📄 chatrooms.js
    📄 sendmessage.js
    📄 socket.js
  📄 chat.js
  📄 index.js
📂 styles
  📄 ChatPage.module.css
  📄 ChatRoom.module.css
  📄 IndexPage.module.css
  📄 globals.css
📄 tes.py
📂 utils
  📄 authMiddleware.js
  📄 db.js
  📄 dbConnect.js
```

---

## 🌐 Environment Variables
The application requires **three environment variables**:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_EXTERNAL_SOCKET_SERVER=wss://<your_server>.onrender.com
```

**🔹 Notes:**
- Replace `<username>`, `<password>`, and `<database>` with actual MongoDB credentials.
- JWT_SECRET is used for authentication.
- NEXT_PUBLIC_EXTERNAL_SOCKET_SERVER can be either **externally hosted** or **internally used**.

---

## ⚡ WebSocket Configuration
WebSockets can be either **externally hosted** or used via the internal API (`pages/api/socket.js`).

### **1️⃣ Using an External WebSocket Server**
Set the environment variable:
```env
NEXT_PUBLIC_EXTERNAL_SOCKET_SERVER=wss://<your_external_server>.onrender.com
```

### **2️⃣ Using Internal WebSocket (via API route)**
Modify `ChatRoom.js`:
```javascript
useEffect(() => {
  socketRef.current = io(window.location.origin, {
    path: '/api/socket',
    transports: ["websocket"],
  });
  socketRef.current.emit('join-room', { roomName, username });

  socketRef.current.on('receive-message', (newMessage) => {
    setChatHistory((prev) => [...prev, { ...newMessage, isOld: false }]);
  });
}, []);
```

---

## 🛢 Database Models
The application uses **MongoDB** with the following collections:

### **1️⃣ Users Collection** (`users`)
```json
{
  "_id": "ObjectId",
  "username": "string",
  "password": "string",
  "faceData": "binary_data"
}
```

### **2️⃣ Chat Rooms Collection** (`chatrooms`)
```json
{
  "_id": "ObjectId",
  "roomName": "string",
  "participants": ["user_id_1", "user_id_2"]
}
```

### **3️⃣ Messages Collection** (`messages`)
```json
{
  "_id": "ObjectId",
  "roomId": "chatroom_id",
  "sender": "user_id",
  "message": "string",
  "timestamp": "ISODate"
}
```

---

## 🚀 Deployment Steps
### **1️⃣ Install Dependencies**
```bash
npm install
```

### **2️⃣ Set Up Environment Variables**
Create a `.env.local` file and add:
```env
MONGODB_URI=mongodb+srv://<your-credentials>
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_EXTERNAL_SOCKET_SERVER=wss://<your-server>.onrender.com
```

### **3️⃣ Run Development Server**
```bash
npm run dev
```

### **4️⃣ Build and Start Production**
```bash
npm run build
npm start
```

---

## 🔥 Features
✅ **Face Recognition Login**  
✅ **JWT-Based Authentication**  
✅ **Real-time Chat using WebSockets**  
✅ **MongoDB Storage**  
✅ **Text-to-Speech (10 min voice support)**  
✅ **External or Internal WebSocket Support**  

---

## 🎯 Future Improvements
🔹 **Add Image & File Sharing in Chat**  
🔹 **Improve UI/UX with animations**  
🔹 **Implement loaders/toast messages**  
🔹 **Implement End-to-End Encryption for messages**  
🔹 **Improve face detection logic and speed**  
🔹 **Database model improvement**  
🔹 **Implement AWS Rekognition**  
🔹 **Fetch online/offline status of users**  
🔹 **Google Speech-to-Text API for transcription**  

---

## 🤝 Contributions
Feel free to fork this repo and submit **pull requests**! 🚀

---

## 📜 License
This project is **open-source** under the **MIT License**.