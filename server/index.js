const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const app = express();
const PORT = 3002;


const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'movie_db',
  user: 'postgres',
  password: 'password'
};

const db = pgp(dbConfig);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/movies', async (req, res) => {
  try {
    const movies = await db.any('SELECT * FROM movies;');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
