import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { getPool } from '../db/connect.js';
import { AuthRequest, authMiddleware, UserRole } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const pool = getPool();
    const existingUserRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existingUserRes.rows.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const insertRes = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email.toLowerCase(), hashedPassword, name, UserRole.USER]
    );

    const user = insertRes.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env['JWT_SECRET'] || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const pool = getPool();
    const userRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userRes.rows.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = userRes.rows[0];
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env['JWT_SECRET'] || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const userRes = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [req.user?.id]);
    if (userRes.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(userRes.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: (error as Error).message });
  }
});

export default router;
