const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const fs = require('fs'); // Import fs module to read/write files

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Read the posts from a JSON file
function readPostsFromFile() {
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        return JSON.parse(data); // Return the parsed JSON data
    } catch (err) {
        return []; // If file doesn't exist or error occurs, return an empty array
    }
}

// Write posts to the JSON file
function writePostsToFile(posts) {
    fs.writeFileSync('data.json', JSON.stringify(posts, null, 2), 'utf8');
}

let posts = readPostsFromFile(); // Initialize posts with data from file

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    writePostsToFile(posts); // Save the updated posts array to the file
    console.log(req.body);
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    let post = posts.find((p) => id == p.id);
    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    let newContent = req.body.content;
    console.log(newContent);
    let post = posts.find((p) => id == p.id);
    post.content = newContent;
    writePostsToFile(posts); // Save the updated posts array to the file
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id == p.id);
    res.render("edit.ejs", { post });
});

// Delete route to remove a post from the data.json file
app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    
    // Find the post to delete
    posts = posts.filter((post) => post.id !== id);
    
    // Write the updated posts array back to the data.json file
    fs.writeFileSync('data.json', JSON.stringify(posts, null, 2), 'utf8');
    
    res.redirect("/posts");  // Redirect back to the posts page after deletion
});


app.listen(port, () => {
    console.log("Listening on port 8080");
});
