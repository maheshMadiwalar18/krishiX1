import { Router } from 'express';

const router = Router();

// Get weather forecast and recommendations
router.get('/forecast', (req, res) => {
  const { location } = req.query;
  
  res.json({
    location: location || 'Bhopal, India',
    current: {
      temp: 32,
      condition: 'Sunny',
      humidity: '12%',
      rainChance: '5%',
      uvIndex: 'High (8)'
    },
    recommendations: [
      { 
        crop: 'Wheat (Raj 3765)', 
        yield: '4.5 - 5.2 T/ha', 
        risk: 'Low', 
        reason: 'Ideal soil moisture and upcoming temperature windows.' 
      },
      { 
        crop: 'Mustard', 
        yield: '2.1 - 2.5 T/ha', 
        risk: 'Medium', 
        reason: 'Subject to aphid risk in current humidity levels.' 
      }
    ]
  });
});

export default router;
