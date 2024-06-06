const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const PORT = 5000;

const app = express();

// Convert data into JSON format
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {

        console.log('Received signup data:', req.body);

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password

        const data = {
            name: req.body.username,
            password: hashedPassword
        };

        const existingUser = await collection.findOne({name: data.name});;

        if(existingUser)
            {
                res.send("User already exists. Please choose a different username.");
            } else {
                const userdata = await collection.create(data); // Use create instead of insertMany for a single document
                console.log('User data inserted:', userdata);
                res.redirect("/"); // Redirect after successful signup
            }
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/login", async (req, res) => 
    {
        try
        {
            const check = await collection.findOne({name: req.body.username});
            if(!check)
                {
                    res.send("user name cannot found");
                }
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if(isPasswordMatch)
                {
                    res.render("home");
                }else{
                    req.send("Wrong Password");
                }
        }catch{
            res.send("Incorrect details");
        }
})

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
