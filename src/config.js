const mongoose = require('mongoose');

// Enable mongoose debug mode for detailed logs
mongoose.set('debug', true);

const connect = mongoose.connect(
  process.env.MONGODB_URI
);

connect
  .then(() => {
    console.log('Mongodb is connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Schema
const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Collection
const collection = mongoose.model("collect1", LoginSchema);

module.exports = collection;
