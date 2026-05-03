import { Router } from 'express';

const router = Router();

// Persistent session simulation for local dev
let currentUser: any = null;

// Register Route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all details' });
  }
  
  // Create mock user
  const newUser = { 
    id: Date.now(), 
    name, 
    email, 
    password,
    phone: req.body.phone || '+91 90000 00000',
    location: req.body.location || 'India',
    primaryCrop: req.body.primaryCrop || 'General',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  currentUser = newUser; // Auto-login on register
  
  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name, email } });
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find mock user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    // If not in our mock DB but looks like a demo/valid login, simulate success
    currentUser = {
      name: email.split('@')[0],
      email: email,
      phone: '+91 99999 88888',
      location: 'Madhya Pradesh',
      primaryCrop: 'Wheat',
      createdAt: new Date().toISOString()
    };
    return res.json({ message: 'Demo Login successful', user: currentUser });
  }
  
  currentUser = user;
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email } });
});

// ✅ DYNAMIC PROFILE LOGIC
router.get('/profile', (req, res) => {
  console.log("👤 Fetching dynamic profile data...");
  
  if (currentUser) {
    console.log("✅ Returning session user:", currentUser.name);
    return res.json(currentUser);
  }

  // Fallback if no session
  const fallbackUser = {
    name: 'Farmer Guest',
    email: 'guest@farm.com',
    phone: '+91 00000 00000',
    location: 'India',
    primaryCrop: 'Not Set',
    createdAt: new Date().toISOString()
  };

  console.log("✅ Profile sent (fallback)");
  res.json(fallbackUser);
});

export default router;
