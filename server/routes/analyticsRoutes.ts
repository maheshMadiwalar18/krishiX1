import { Router } from 'express';

const router = Router();

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
  res.json({
    stats: {
      totalYield: '14.2 Tons',
      healthScore: '94%',
      activeAlerts: '0',
      estProfit: '₹89,200'
    },
    yieldData: [
      { month: 'Jan', amount: 4000 },
      { month: 'Feb', amount: 3000 },
      { month: 'Mar', amount: 2000 },
      { month: 'Apr', amount: 2780 },
      { month: 'May', amount: 1890 },
      { month: 'Jun', amount: 2390 },
    ]
  });
});

export default router;
