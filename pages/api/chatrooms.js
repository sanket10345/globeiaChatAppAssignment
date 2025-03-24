import { connectToDatabase } from '../../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Verify token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { db } = await connectToDatabase();

    if (req.method === 'POST') {
      // Create a new chat room
      const { roomName } = req.body;
      const newRoom = { roomName, createdBy: decoded.username, createdAt: new Date() };
      await db.collection('chatrooms').insertOne(newRoom);
      res.status(201).json(newRoom);
    } else if (req.method === 'GET') {
      // List all chat rooms
      const rooms = await db.collection('chatrooms').find({}).toArray();
      res.status(200).json(rooms);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
