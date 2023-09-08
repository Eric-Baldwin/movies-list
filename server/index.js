const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const app = express();
const PORT = 3002;

// Database connection settings
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'movie_db',
  user: 'postgres',
  password: 'password'
};

const db = pgp(dbConfig);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Fetch movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await db.any('SELECT * FROM movies;');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add movies
app.post('/movies', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "The 'title' field is required." });
    }
    const movie = await db.one('INSERT INTO movies(title) VALUES($1) RETURNING *;', [title]);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
