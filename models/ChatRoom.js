// models/ChatRoom.js
import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite on hot-reload in development
export default mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);
