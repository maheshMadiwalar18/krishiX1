import { Router } from 'express';

const router = Router();

// Mock User Database
const users: any[] = [];

// Register Route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all details' });
  }
  
  // Create mock user
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  
  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name, email } });
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find mock user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email } });
});

// ✅ GET PROFILE LOGIC
router.get('/profile', (req, res) => {
  console.log("👤 Fetching profile data...");
  
  // In a real app, you would fetch from DB using user ID from token
  const mockUser = {
    name: 'Farmer Rajesh',
    email: 'rajesh@farm.com',
    phone: '+91 98765 43210',
    location: 'Bhopal, Madhya Pradesh',
    primaryCrop: 'Wheat',
    createdAt: new Date().toISOString()
  };

  if (!mockUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  console.log("✅ Profile sent successfully");
  res.json(mockUser);
});

export default router;
