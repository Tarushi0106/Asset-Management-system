const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key_here';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', version: '1.0.0', timestamp: new Date().toISOString() });
});

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Available', 'Allocated', 'Faulty')),
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

app.post('/auth/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  });
});

const assetValidation = [
  body('asset_id').notEmpty().withMessage('Asset ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('category').isIn(['Laptop', 'License', 'Access Card', 'Monitor', 'Phone']).withMessage('Invalid category'),
  body('status').isIn(['Available', 'Allocated', 'Faulty']).withMessage('Invalid status')
];

app.get('/assets', authenticateToken, (req, res) => {
  const { category, status, search } = req.query;
  let query = 'SELECT * FROM assets WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (name LIKE ? OR asset_id LIKE ? OR assigned_to LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/assets', authenticateToken, assetValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { asset_id, name, category, status, assigned_to } = req.body;

  if (status === 'Faulty' && assigned_to) {
    return res.status(400).json({ error: 'Faulty assets cannot be allocated' });
  }

  db.run(
    'INSERT INTO assets (asset_id, name, category, status, assigned_to) VALUES (?, ?, ?, ?, ?)',
    [asset_id, name, category, status, assigned_to || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Asset ID already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: this.lastID, asset_id, name, category, status, assigned_to });
    }
  );
});

app.put('/assets/:id', authenticateToken, assetValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { asset_id, name, category, status, assigned_to } = req.body;

  if (status === 'Faulty' && assigned_to) {
    return res.status(400).json({ error: 'Faulty assets cannot be allocated' });
  }

  db.run(
    'UPDATE assets SET asset_id = ?, name = ?, category = ?, status = ?, assigned_to = ? WHERE id = ?',
    [asset_id, name, category, status, assigned_to || null, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json({ id: parseInt(id), asset_id, name, category, status, assigned_to });
    }
  );
});

app.delete('/assets/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM assets WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;