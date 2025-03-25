// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  faceDescriptor: { type: [Number], required: true }, // storing face embeddings as an array of numbers
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite on hot-reload in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
