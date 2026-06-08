import { Router, Response } from 'express';
import { getPool } from '../db/connect.js';
import { AuthRequest, authMiddleware, requireRole, UserRole } from '../middleware/auth.js';

const router = Router();

// Get all players (Publicly accessible)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const playersRes = await pool.query('SELECT * FROM players ORDER BY jersey_number ASC');
    
    // Map database snake_case fields to frontend camelCase fields
    const players = playersRes.rows.map(row => ({
      id: row.id,
      fullName: row.full_name,
      jerseyNumber: row.jersey_number,
      position: row.position,
      photo: row.photo,
      goals: row.goals,
      assists: row.assists,
      matchesPlayed: row.matches_played,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch players', error: (error as Error).message });
  }
});

// Get player by ID (Publicly accessible)
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const playerRes = await pool.query('SELECT * FROM players WHERE id = $1', [req.params['id']]);
    
    if (playerRes.rows.length === 0) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }
    
    const row = playerRes.rows[0];
    const player = {
      id: row.id,
      fullName: row.full_name,
      jerseyNumber: row.jersey_number,
      position: row.position,
      photo: row.photo,
      goals: row.goals,
      assists: row.assists,
      matchesPlayed: row.matches_played,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch player', error: (error as Error).message });
  }
});

// Create player (Admin/Super Admin only)
router.post('/', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, jerseyNumber, position, photo, goals, assists, matchesPlayed } = req.body;

    if (!fullName || jerseyNumber === undefined || !position) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const pool = getPool();
    const insertRes = await pool.query(
      `INSERT INTO players (full_name, jersey_number, position, photo, goals, assists, matches_played, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        fullName, 
        jerseyNumber, 
        position, 
        photo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
        goals || 0, 
        assists || 0, 
        matchesPlayed || 0, 
        req.user?.id
      ]
    );

    const row = insertRes.rows[0];
    const player = {
      id: row.id,
      fullName: row.full_name,
      jerseyNumber: row.jersey_number,
      position: row.position,
      photo: row.photo,
      goals: row.goals,
      assists: row.assists,
      matchesPlayed: row.matches_played,
      userId: row.user_id
    };

    res.status(201).json({ message: 'Player created successfully', player });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create player', error: (error as Error).message });
  }
});

// Update player (Admin/Super Admin only)
router.put('/:id', authMiddleware, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, jerseyNumber, position, photo, goals, assists, matchesPlayed } = req.body;

    if (!fullName || jerseyNumber === undefined || !position) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const pool = getPool();
    const updateRes = await pool.query(
      `UPDATE players 
       SET full_name = $1, jersey_number = $2, position = $3, photo = $4, goals = $5, assists = $6, matches_played = $7, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [
        fullName,
        jerseyNumber,
        position,
        photo,
        goals || 0,
        assists || 0,
        matchesPlayed || 0,
        req.params['id']
      ]
    );

    if (updateRes.rows.length === 0) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const row = updateRes.rows[0];
    const player = {
      id: row.id,
      fullName: row.full_name,
      jerseyNumber: row.jersey_number,
      position: row.position,
      photo: row.photo,
      goals: row.goals,
      assists: row.assists,
      matchesPlayed: row.matches_played,
      userId: row.user_id
    };

    res.json({ message: 'Player updated successfully', player });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update player', error: (error as Error).message });
  }
});

// Delete player (Super Admin only)
router.delete('/:id', authMiddleware, requireRole(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pool = getPool();
    const deleteRes = await pool.query('DELETE FROM players WHERE id = $1 RETURNING id', [req.params['id']]);

    if (deleteRes.rows.length === 0) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete player', error: (error as Error).message });
  }
});

export default router;
