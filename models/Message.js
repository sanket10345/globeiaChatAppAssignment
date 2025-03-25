// models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite upon hot-reloading in development
export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
