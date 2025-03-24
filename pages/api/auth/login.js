import { createRouter  } from 'next-connect';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../utils/db';
import jwt from 'jsonwebtoken';

const handler = createRouter();

handler.post(async (req, res) => {
  const { username, password, faceDescriptor } = req.body;

  if (!faceDescriptor) {
    return res.status(400).json({ error: "Face data is required" });
  }

  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ username });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Compare face descriptors using Euclidean distance
  const distance = Math.sqrt(
    user.faceDescriptor.reduce((sum, val, i) => sum + (val - faceDescriptor[i]) ** 2, 0)
  );

  if (distance > 0.6) { // Threshold for matching
    return res.status(400).json({ error: "Face not recognized" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

export default handler.handler();
