// middleware/auth.js
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  console.log("req.headers.cookie---------->",cookie.parse(req.headers.cookie))
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // attach user to request for further use
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}