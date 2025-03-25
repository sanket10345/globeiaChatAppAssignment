import { createRouter  } from 'next-connect';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { username, password, faceDescriptor } = req.body;

  if (!faceDescriptor) {
    return res.status(400).json({ error: "Face data is required" });
  }

  const { db } = await connectToDatabase();

  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = {
    username,
    password: hashedPassword,
    faceDescriptor, // Store the face embedding
    createdAt: new Date()
  };

  await db.collection('users').insertOne(user);

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  // Set the token in an HTTP-only cookie
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);
  res.status(200).json({ success: true, user });
}
