import pg from 'pg';
import bcryptjs from 'bcryptjs';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let isInitialized = false;

export function getPool() {
  if (!pool) {
    const connectionString = 
      process.env['POSTGRES_URL'] || 
      process.env['DATABASE_URL'] || 
      'postgres://postgres:postgres@localhost:5432/young_peace';
    
    console.log('Initializing PostgreSQL Pool with URL:', connectionString.replace(/:([^:@]+)@/, ':****@'));
    
    pool = new Pool({
      connectionString,
      ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  return pool;
}

export async function connectToDatabase() {
  const p = getPool();
  try {
    // Test the connection
    const client = await p.connect();
    console.log('Connected to PostgreSQL successfully');
    client.release();

    if (!isInitialized) {
      await initializeDatabase();
      isInitialized = true;
    }
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
    isInitialized = false;
    console.log('Disconnected from PostgreSQL');
  }
}

async function initializeDatabase() {
  const p = getPool();
  
  console.log('Initializing database tables...');
  
  // 1. Create users table
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'User',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Create players table
  await p.query(`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      jersey_number INTEGER NOT NULL,
      position VARCHAR(50) NOT NULL,
      photo TEXT,
      goals INTEGER DEFAULT 0,
      assists INTEGER DEFAULT 0,
      matches_played INTEGER DEFAULT 0,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Create news table
  await p.query(`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      date VARCHAR(100) NOT NULL,
      image_url TEXT,
      author VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Seed default super admin user if empty
  const res = await p.query('SELECT COUNT(*) FROM users');
  const count = parseInt(res.rows[0].count, 10);
  if (count === 0) {
    console.log('Seeding default users...');
    
    const adminHash = await bcryptjs.hash('admin123', 10);
    const coachHash = await bcryptjs.hash('coach123', 10);
    const userHash = await bcryptjs.hash('user123', 10);
    const editorHash = await bcryptjs.hash('editor123', 10);

    await p.query(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Super Administrator', 'admin@youngpeace.com', $1, 'Administrator'),
      ('Coach Tommy', 'coach@youngpeace.com', $2, 'Admin'),
      ('Regular Fan', 'user@youngpeace.com', $3, 'User'),
      ('Editor Alex', 'editor@youngpeace.com', $4, 'User')
    `, [adminHash, coachHash, userHash, editorHash]);

    // Seed default players if empty
    const playersCountRes = await p.query('SELECT COUNT(*) FROM players');
    if (parseInt(playersCountRes.rows[0].count, 10) === 0) {
      console.log('Seeding default players...');
      await p.query(`
        INSERT INTO players (full_name, jersey_number, position, photo, goals, assists, matches_played) VALUES
        ('David Som', 1, 'GK', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 0, 1, 24),
        ('Marcus Ren', 4, 'DEF', 'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2, 3, 20),
        ('Sokha R.', 5, 'DEF', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, 5, 22),
        ('Jack Lim', 8, 'MID', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 8, 12, 24),
        ('Pheakdey P.', 10, 'MID', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 11, 14, 23),
        ('Tommy Kim', 7, 'FWD', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 18, 4, 21),
        ('Alex Chan', 9, 'FWD', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 22, 6, 24)
      `);
    }

    // Seed default news if empty
    const newsCountRes = await p.query('SELECT COUNT(*) FROM news');
    if (parseInt(newsCountRes.rows[0].count, 10) === 0) {
      console.log('Seeding default news...');
      await p.query(`
        INSERT INTO news (title, summary, content, category, date, image_url, author) VALUES
        ('Young Peace secures spot in Winter Regional Cup', 'After a dominating performance against City Rovers, the team has officially qualified for the upcoming knockout tournament this winter.', 'After a dominating performance against City Rovers, the team has officially qualified for the upcoming knockout tournament this winter. The match ended in a clean sheet with an exceptional performance by the defense and midfield. Team captain Tommy expressed deep appreciation for the hard work during the pre-season, highlighting the commitment of the coaching staff.', 'Announcement', 'Oct 24, 2026', 'https://images.unsplash.com/photo-1518605368461-1ee02cad5159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'Super Administrator'),
        ('A tactical masterclass gives YP a 3-1 win', 'The midfield stepped up completely, choking the oppositions passing lanes from the first whistle.', 'An incredible game displaying true positional play. The midfield trio controlled possession throughout the entire 90 minutes, allowing our strikers to run behind the opposition defense. Tactical adjustments at halftime proved crucial to secure all three points.', 'Match Report', 'Oct 12, 2026', 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'Coach Tommy'),
        ('David Som: The Wall in Goal', 'Our goalkeeper has been in sensational form. We analyze his positioning and shot-stopping ability.', 'David Som has recorded five clean sheets in the last six matches. In this deep dive analysis, we explore his positional logic during set-pieces, his quick distribution leading to counter-attacks, and his leadership from the back.', 'Player Spotlight', 'Oct 08, 2026', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'Editor Alex'),
        ('Youth Training Camp a Success', 'Our senior players spent the weekend coaching kids from the local district.', 'Young Peace FT hosted its annual youth training clinic this weekend. Over 50 boys and girls attended the event, gaining valuable experience, practicing drills with the first-team players, and learning key principles of sportsmanship.', 'Community', 'Sep 30, 2026', 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'Super Administrator')
      `);
    }
    
    console.log('Database seeded successfully.');
  }
}
