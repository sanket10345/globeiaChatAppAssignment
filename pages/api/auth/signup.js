import { createRouter  } from 'next-connect';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../utils/db';
import jwt from 'jsonwebtoken';

const handler = createRouter();

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

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
}
