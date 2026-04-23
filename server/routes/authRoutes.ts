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

// Get Current User Profile
router.get('/profile', (req, res) => {
  // In a real app, you would verify a JWT token here
  res.json({ message: 'Profile data', user: { name: 'Farmer Rajesh', fields: 3 } });
});

export default router;
