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
      release_date: { type: String, required: true },
      poster_path: { type: String, required: true },
      media_type: { type: String, required: true },
    },
  ],
  continue_watching: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      release_date: { type: String, required: true },
      poster_path: { type: String, required: true },
      type: { type: String, required: true },
      progress: { type: Number, required: true },
      show_progress: {type: String}
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
