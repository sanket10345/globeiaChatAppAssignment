// pages/api/chatrooms.js
import dbConnect from '../../utils/dbConnect';
import ChatRoom from '../../models/ChatRoom';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const chatrooms = await ChatRoom.find({}).sort({ createdAt: 1 });
      return res.status(200).json(chatrooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === 'POST') {
    const { roomName, createdBy } = req.body;
    if (!roomName || !createdBy) {
      return res.status(400).json({ error: "Room name and createdBy are required" });
    }
    try {
      // Check for duplicate room name
      const existing = await ChatRoom.findOne({ roomName });
      if (existing) {
        return res.status(400).json({ error: "Chat room already exists" });
      }
      const newRoom = await ChatRoom.create({ roomName, createdBy });
      return res.status(201).json(newRoom);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
