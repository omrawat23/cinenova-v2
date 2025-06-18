const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to handle new user creation
router.post('/', async (req, res) => {
  try {
    const { uuid, username, email, imageUrl } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ uuid });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({
      uuid,
      username,
      email,
      imageUrl,
    });

    // Save user to MongoDB
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
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
    if (!uuid || !movie) {
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
      error: err.message
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
      error: err.message
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

    // Remove the movie from the watchlist
    user.watchlist = user.watchlist.filter((item) => item.id !== parseInt(movieId));

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
      error: err.message
    });
  }
});


module.exports = router;
