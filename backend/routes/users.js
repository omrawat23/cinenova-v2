const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to handle new user creation
router.post('/', async (req, res) => {
  try {
    const { uuid, username, email, imageUrl } = req.body;

    if (![uuid, username, email, imageUrl].every((value) => typeof value === 'string' && value.trim())) {
      return res.status(400).json({ message: 'uuid, username, email, and imageUrl are required' });
    }

    const user = await User.findOneAndUpdate(
      { uuid: uuid.trim() },
      {
        $set: {
          username: username.trim(),
          email: email.trim(),
          imageUrl: imageUrl.trim()
        }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'User saved successfully', user });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a movie to the user's watchlist
router.post('/watchlist', async (req, res) => {
  try {
    const { uuid, movie } = req.body;

    // Validate input
    if (!uuid || !movie || !Number.isInteger(movie.id) || typeof movie.title !== 'string') {
      return res.status(400).json({ message: 'UUID and movie data are required' });
    }

    // Find the user by UUID
    const user = await User.findOne({ uuid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie is already in the user's watchlist
    const movieExists = user.watchlist.some((item) => item.id === movie.id);

    if (movieExists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    // Add the movie to the user's watchlist
    user.watchlist.push(movie);

    // Save the user with the updated watchlist
    await user.save();

    res.status(200).json({
      message: 'Movie added to watchlist',
      watchlist: user.watchlist
    });
  } catch (err) {
    console.error('Error adding movie to watchlist:', err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Route to get the user's watchlist
router.get('/watchlist/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;

    // Validate input
    if (!uuid) {
      return res.status(400).json({ message: 'UUID is required' });
    }

    // Find the user by UUID and populate the watchlist
    const user = await User.findOne({ uuid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's watchlist
    res.status(200).json({
      message: 'Watchlist retrieved successfully',
      watchlist: user.watchlist
    });
  } catch (err) {
    console.error('Error retrieving watchlist:', err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Route to remove a movie from the watchlist
router.delete('/watchlist/:uuid/:movieId', async (req, res) => {
  try {
    const { uuid, movieId } = req.params;

    // Validate input
    if (!uuid || !movieId) {
      return res.status(400).json({ message: 'UUID and Movie ID are required' });
    }

    // Find the user by UUID
    const user = await User.findOne({ uuid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parsedMovieId = Number(movieId);
    if (!Number.isInteger(parsedMovieId)) {
      return res.status(400).json({ message: 'Movie ID must be an integer' });
    }

    user.watchlist = user.watchlist.filter((item) => item.id !== parsedMovieId);

    // Save the user with the updated watchlist
    await user.save();

    res.status(200).json({
      message: 'Movie removed from watchlist',
      watchlist: user.watchlist
    });
  } catch (err) {
    console.error('Error removing movie from watchlist:', err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});


module.exports = router;
