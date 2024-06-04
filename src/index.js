const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const PORT = 5000;

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});