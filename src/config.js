const mongoose = require('mongoose');

// Enable mongoose debug mode for detailed logs
mongoose.set('debug', true);

const connect = mongoose.connect(
  'mongodb+srv://authsys:MgySeHlXYxBE26WR@cluster0.s5llm4l.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0.users'
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
