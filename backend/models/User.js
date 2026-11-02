const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, required: true },
  watchlist: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      release_date: { type: String, default: '' },
      poster_path: { type: String, default: '' },
      media_type: { type: String, enum: ['movie', 'tv'], required: true },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
