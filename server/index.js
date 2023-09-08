const express = require('express');
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/movies', async (req, res, next) => {
  try {
    const movies = await knex.select('*').from('movies');
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

app.post('/movies', async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "The 'title' field is required." });
    }
    const [movie] = await knex('movies').insert({ title }).returning('*');
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
