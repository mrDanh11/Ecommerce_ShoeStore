const jwt = require('jsonwebtoken');
const {
  createUser,
  getUserByEmail,
  comparePassword,
  findOrCreateOAuthUser,
} = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

//Đăng ký user mới (email/password)
async function register(req, res) {
  const { email, password, name } = req.body;
  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    const user = await createUser({ email, password, name, role: 'user' });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Đăng nhập (email/password)
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    const match = await comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function oauthGoogle(req, res) {
  try {
    const { oauth_id, email, name } = req.body;
    const user = await findOrCreateOAuthUser({ oauth_provider: 'google', oauth_id, email, name });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  oauthGoogle,
};
