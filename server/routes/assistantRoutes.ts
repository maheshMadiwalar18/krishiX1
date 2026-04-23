import { Router } from 'express';

const router = Router();

// Handle voice/text messages to the AI
router.post('/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Simulated AI response
  setTimeout(() => {
    res.json({
      reply: "Based on the recent weather patterns, it's best to wait until next Tuesday to sow your wheat, as a light rain is expected which will improve soil moisture."
    });
  }, 1000);
});

export default router;
