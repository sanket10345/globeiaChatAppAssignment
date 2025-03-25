// pages/api/auth/login.js
import { createRouter  } from 'next-connect';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  const { username, password, faceDescriptor } = req.body;

  if (!faceDescriptor) {
    return res.status(400).json({ error: "Face data is required" });
  }

  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
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

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  // Set the token in an HTTP-only cookie
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);
  res.status(200).json({ success: true, user });
}

