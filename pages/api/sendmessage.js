// pages/api/sendmessage.js
import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';
// pages/api/protectedRoute.js
import { authenticate } from '../../utils/authMiddleware';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  authenticate(req, res, async () => {
    // Connect to the database
    await dbConnect();

    // Extract message details from the request body
    const { roomName, username, message } = req.body;
    // Validate fields
    if (!roomName || !username || !message) {
      return res.status(400).json({ error: 'roomName, username, and message are required' });
    }

    try {
      // Create a new message document in MongoDB
      const newMessage = await Message.create({
        roomName,
        username,
        message,
      });

      // Return the newly created message
      return res.status(201).json(newMessage);
    } catch (err) {
      console.error('Error creating message:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  })
}
