require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const collection = require('./config');

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

// Convert data into JSON format
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Use cookie-parser middleware
app.use(cookieParser());
// Use method-override middleware to support DELETE method via forms
app.use(methodOverride('_method'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Create (Signup)
app.post("/signup", async (req, res) => {
    try {
        console.log('Received signup data:', req.body);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const data = {
            name: req.body.username,
            password: hashedPassword
        };

        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            res.send("User already exists. Please choose a different username.");
        } else {
            const userdata = await collection.create(data);
            console.log('User data inserted:', userdata);
            const token = jwt.sign({ name: data.name }, JWT_SECRET, { expiresIn: '1h' });

            // Send token as HTTP-only cookie
            res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour expiration
            res.redirect("/home");
        }
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Read (Login)
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.username });
        if (!user) {
            return res.send("Username not found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            const token = jwt.sign({ name: user.name }, JWT_SECRET, { expiresIn: '1h' });

            // Send token as HTTP-only cookie
            res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour expiration
            res.redirect("/home");
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        res.send("Incorrect details");
    }
});

// Protected route example
app.get("/home", authenticateToken, (req, res) => {
    res.render("home", { user: req.user });
});

// Update (Update User Data)
app.post("/users/:username", authenticateToken, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await collection.findOneAndUpdate(
            { name: req.params.username },
            { $set: { password: hashedPassword } },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.redirect("/home");
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Delete (Delete User)
app.delete("/users/:username", authenticateToken, async (req, res) => {
    try {
        const username = req.params.username;
        console.log(`Attempting to delete user: ${username}`);
        
        const user = await collection.findOneAndDelete({ name: username });
        
        if (!user) {
            console.error(`User not found: ${username}`);
            return res.status(404).send("User not found");
        }
        
        console.log(`User deleted: ${username}`);
        res.clearCookie('jwt');
        res.send("User deleted successfully");
    } catch (error) {
        console.error('Error during user deletion:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
