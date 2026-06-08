import { Router, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { getPool } from '../db/connect.js';
import { AuthRequest, authMiddleware, requireRole, UserRole } from '../middleware/auth.js';

const router = Router();

// Get all users (Super Admin only)
router.get('/', authMiddleware, requireRole(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const usersRes = await pool.query('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY id ASC');
    res.json(usersRes.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: (error as Error).message });
  }
});

// Create a new user (Super Admin only)
router.post('/', authMiddleware, requireRole(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const pool = getPool();
    const existingUserRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existingUserRes.rows.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const pass = password || 'password123';
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(pass, salt);

    const insertRes = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
      [name, email.toLowerCase(), hashedPassword, role]
    );

    res.status(201).json({ message: 'User created successfully', user: insertRes.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: (error as Error).message });
  }
});

// Get user by ID (Super Admin only or own user)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const isSuperAdmin = req.user?.role === UserRole.SUPER_ADMIN;
    const isOwnProfile = req.user?.id == req.params['id'];

    if (!isSuperAdmin && !isOwnProfile) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const userRes = await pool.query('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1', [req.params['id']]);
    if (userRes.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(userRes.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: (error as Error).message });
  }
});

// Update user role (Super Admin only)
router.patch('/:id/role', authMiddleware, requireRole(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;

    if (!role || !Object.values(UserRole).includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const pool = getPool();
    const updateRes = await pool.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, name, role',
      [role, req.params['id']]
    );

    if (updateRes.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User role updated successfully', user: updateRes.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: (error as Error).message });
  }
});

// Delete user (Super Admin only)
router.delete('/:id', authMiddleware, requireRole(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    
    // Prevent deleting the Super Admin
    const checkRes = await pool.query('SELECT email FROM users WHERE id = $1', [req.params['id']]);
    if (checkRes.rows.length > 0 && checkRes.rows[0].email === 'admin@youngpeace.com') {
      res.status(400).json({ message: 'Cannot delete the Super Administrator account' });
      return;
    }

    const deleteRes = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params['id']]);

    if (deleteRes.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: (error as Error).message });
  }
});

export default router;
