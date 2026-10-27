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
