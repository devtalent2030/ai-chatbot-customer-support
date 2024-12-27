// server/routes/faq.js
const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// GET all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// CREATE a new FAQ
router.post('/', async (req, res) => {
  try {
    const { question, answer, tags } = req.body;
    const newFAQ = new FAQ({ question, answer, tags });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE an existing FAQ
router.put('/:id', async (req, res) => {
  try {
    const { question, answer, tags } = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer, tags },
      { new: true }
    );
    if (!updatedFAQ) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(updatedFAQ);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE an FAQ
router.delete('/:id', async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
