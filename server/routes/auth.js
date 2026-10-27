import express from express[G
import bcrypt from bcryptjs[G
import jwt from jsonwebtoken[G
import User from ../models/User.js[G
import { authenticateToken } from ../middleware/authMiddleware.js[G

const router = express.Router()[G

// 
router.post(/register, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body[G
    if (!name || !email || !password) return res.status(400).json({ success: false, message:       . })[G

    const existing = await User.findOne({ email })[G
    if (existing) return res.status(400).json({ success: false, message:      . })[G

    const salt = await bcrypt.genSalt(10)[G
    const passwordHash = await bcrypt.hash(password, salt)[G

    const user = await User.create({ name, email, phone, passwordHash, role: client })[G

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || qeshm-secret-key, { expiresIn: 7d })[G
    res.status(201).json({ success: true, data: { user, token }, message:     . })[G
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })[G
  }
})[G

// 
router.post(/login, async (req, res) => {
  try {
    const { email, password } = req.body[G
    if (!email || !password) return res.status(400).json({ success: false, message:      . })[G

    const user = await User.findOne({ email })[G
    if (!user) return res.status(401).json({ success: false, message:      . })[G

    const isMatch = await bcrypt.compare(password, user.passwordHash)[G
    if (!isMatch) return res.status(401).json({ success: false, message:      . })[G

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || qeshm-secret-key, { expiresIn: 7d })[G
    res.json({ success: true, data: { user, token }, message:     . })[G
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })[G
  }
})[G

//     
router.get(/me, authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(-passwordHash)[G
    if (!user) return res.status(404).json({ success: false, message:   . })[G
    res.json({ success: true, data: user })[G
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })[G
  }
})[G

export default router[G
