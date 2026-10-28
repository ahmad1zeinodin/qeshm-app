import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import skillsRoutes from './routes/skills.js';

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'سرور آماده است.' });
});

const MONGODB_URI = 'mongodb+srv://ahmad1zeinodin_db_user:rmnAeWwG9mgYnxwR@qeshm-db.fuccltc.mongodb.net/qeshm?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
