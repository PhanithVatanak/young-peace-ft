import { Router, Response } from 'express';
import { getPool } from '../db/connect.js';
import { AuthRequest, authMiddleware, requireRole, UserRole } from '../middleware/auth.js';

const router = Router();

// Get all news posts (Publicly accessible)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const newsRes = await pool.query('SELECT * FROM news ORDER BY id DESC');
    
    // Map database snake_case fields to frontend camelCase fields
    const news = newsRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      category: row.category,
      date: row.date,
      imageUrl: row.image_url,
      author: row.author,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news posts', error: (error as Error).message });
  }
});

// Create news post (Admin/Super Admin only)
router.post('/', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, summary, content, category, imageUrl, author } = req.body;

    if (!title || !summary || !content) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const postDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const postAuthor = author || req.user?.email || 'Administrator';

    const pool = getPool();
    const insertRes = await pool.query(
      `INSERT INTO news (title, summary, content, category, date, image_url, author) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        title,
        summary,
        content,
        category || 'General',
        postDate,
        imageUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        postAuthor
      ]
    );

    const row = insertRes.rows[0];
    const post = {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      category: row.category,
      date: row.date,
      imageUrl: row.image_url,
      author: row.author
    };

    res.status(201).json({ message: 'News post created successfully', news: post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create news post', error: (error as Error).message });
  }
});

// Update news post (Admin/Super Admin only)
router.put('/:id', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, summary, content, category, imageUrl } = req.body;

    if (!title || !summary || !content) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const pool = getPool();
    const updateRes = await pool.query(
      `UPDATE news 
       SET title = $1, summary = $2, content = $3, category = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING *`,
      [
        title,
        summary,
        content,
        category || 'General',
        imageUrl,
        req.params['id']
      ]
    );

    if (updateRes.rows.length === 0) {
      res.status(404).json({ message: 'News post not found' });
      return;
    }

    const row = updateRes.rows[0];
    const post = {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      category: row.category,
      date: row.date,
      imageUrl: row.image_url,
      author: row.author
    };

    res.json({ message: 'News post updated successfully', news: post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update news post', error: (error as Error).message });
  }
});

// Delete news post (Admin/Super Admin only)
router.delete('/:id', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const deleteRes = await pool.query('DELETE FROM news WHERE id = $1 RETURNING id', [req.params['id']]);

    if (deleteRes.rows.length === 0) {
      res.status(404).json({ message: 'News post not found' });
      return;
    }

    res.json({ message: 'News post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete news post', error: (error as Error).message });
  }
});

export default router;
