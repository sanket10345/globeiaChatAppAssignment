// pages/api/chathistory.js
import dbConnect from '../../utils/dbConnect';
import Message from '../../models/Message';

export default async function handler(req, res) {
  // Connect to the database
  await dbConnect();

  if (req.method === 'GET') {
    const { roomName } = req.query;

    if (!roomName) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    try {
      // Retrieve messages for the room, sorted by createdAt in ascending order
      const messages = await Message.find({ roomName }).sort({ createdAt: 1 });
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
