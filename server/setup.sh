#!/bin/bash
mkdir -p models routes middleware
cat > server.js << 'MAIN'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
const MONGODB_URI = 'mongodb+srv://ahmad1zeinodin_db_user:rmnAeWwG9mgYnxwR@qeshm-db.fuccltc.mongodb.net/qeshm?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI).then(() => console.log('MongoDB connected')).catch(err => console.error(err));
import authRoutes from './routes/auth.js';
import skillsRoutes from './routes/skills.js';
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
MAIN
cat > middleware/authMiddleware.js << 'AUTHM'
import jwt from 'jsonwebtoken';
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'qeshm-secret-key', (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
}
AUTHM
cat > models/User.js << 'USERM'
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  nationalId: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker', 'admin'], default: 'client' },
  adminRoleTitle: { type: String, default: '' },
  adminPermissions: { dashboard: { type: Boolean, default: false }, users: { type: Boolean, default: false }, categories: { type: Boolean, default: false }, vendors: { type: Boolean, default: false }, addVendor: { type: Boolean, default: false }, orders: { type: Boolean, default: false }, settings: { type: Boolean, default: false }, tickets: { type: Boolean, default: false } },
  accessStart: { type: Date, default: Date.now },
  accessEnd: { type: Date },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  acceptanceRate: { type: Number, default: 100 },
  rating: { type: Number, default: 5 },
  isOnline: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', userSchema);
USERM
cat > models/Category.js << 'CATM'
import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  field: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Category', categorySchema);
CATM
cat > models/Skill.js << 'SKILLM'
import mongoose from 'mongoose';
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Skill', skillSchema);
SKILLM
cat > routes/skills.js << 'SKILLSR'
import express from 'express';
import Category from '../models/Category.js';
import Skill from '../models/Skill.js';
const router = express.Router();
router.get('/categories/:field', async (req, res) => {
  try {
    const categories = await Category.find({ field: req.params.field, isActive: true });
    res.json({ success: true, data: categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/categories', async (req, res) => {
  try {
    const { name, field } = req.body;
    if (!name || !field) return res.status(400).json({ success: false, message: 'Name and field required' });
    const category = await Category.create({ name, field });
    res.status(201).json({ success: true, data: category, message: 'Category added' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.get('/skills/:categoryId', async (req, res) => {
  try {
    const skills = await Skill.find({ categoryId: req.params.categoryId, isActive: true });
    res.json({ success: true, data: skills });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/skills', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) return res.status(400).json({ success: false, message: 'Name and categoryId required' });
    const skill = await Skill.create({ name, categoryId });
    res.status(201).json({ success: true, data: skill, message: 'Skill added' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
export default router;
SKILLSR
cat > routes/auth.js << 'AUTHR'
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Required fields missing' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, phone, passwordHash, role: 'client' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'qeshm-secret-key', { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { user, token }, message: 'Registered successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'qeshm-secret-key', { expiresIn: '7d' });
    res.json({ success: true, data: { user, token }, message: 'Logged in successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
export default router;
AUTHR
cp -r ../client . 2>/dev/null
echo "Done"
