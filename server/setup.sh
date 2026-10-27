#!/bin/bash
echo "در حال ساخت فایل‌های بک‌اند..."

mkdir -p models routes

cat > models/User.js << 'MODEL_USER'
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  nationalId: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker', 'admin'], default: 'client' },
  adminRoleTitle: { type: String, default: '' },
  adminPermissions: {
    dashboard: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    vendors: { type: Boolean, default: false },
    addVendor: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    tickets: { type: Boolean, default: false },
  },
  accessStart: { type: Date, default: Date.now },
  accessEnd: { type: Date },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  acceptanceRate: { type: Number, default: 100 },
  rating: { type: Number, default: 5 },
  isOnline: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('User', userSchema);
MODEL_USER

cat > models/Category.js << 'MODEL_CATEGORY'
import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  field: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Category', categorySchema);
MODEL_CATEGORY

cat > models/Skill.js << 'MODEL_SKILL'
import mongoose from 'mongoose';
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Skill', skillSchema);
MODEL_SKILL

cat > routes/skills.js << 'ROUTE_SKILLS'
import express from 'express';
import Category from '../models/Category.js';
import Skill from '../models/Skill.js';

const router = express.Router();

router.get('/categories/:field', async (req, res) => {
  try {
    const categories = await Category.find({ field: req.params.field, isActive: true });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, field } = req.body;
    if (!name || !field) return res.status(400).json({ success: false, message: 'نام شاخه و فیلد اصلی الزامی است.' });
    const category = await Category.create({ name, field });
    res.status(201).json({ success: true, data: category, message: 'شاخه اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/skills/:categoryId', async (req, res) => {
  try {
    const skills = await Skill.find({ categoryId: req.params.categoryId, isActive: true });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) return res.status(400).json({ success: false, message: 'نام مهارت و شاخه الزامی است.' });
    const skill = await Skill.create({ name, categoryId });
    res.status(201).json({ success: true, data: skill, message: 'مهارت اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
ROUTE_SKILLS

cat > server.js << 'SERVER_MAIN'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());

const MONGODB_URI = 'mongodb+srv://ahmad1zeinodin_db_user:rmnAeWwG9mgYnxwR@qeshm-db.fuccltc.mongodb.net/qeshm?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected to a clean database (qeshm)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

import skillsRoutes from './routes/skills.js';
app.use('/api/skills', skillsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'سرور قشمی نو آماده است.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
SERVER_MAIN

echo "✅ تمام فایل‌های بک‌اند با موفقیت ساخته شدند."
