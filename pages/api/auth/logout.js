// pages/api/auth/login.js
import { createRouter  } from 'next-connect';

const handler = createRouter();

handler.post(async (req, res) => {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;');
    res.status(200).json({ success: true });
});

export default handler.handler();
