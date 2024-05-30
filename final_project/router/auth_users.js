const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    auth = users.filter((user) => user.username === username && user.password === password)
    if (auth.length > 0){
        return true
    }
    else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password){
        return res.status(404).json({message: "Unable to log in"})
    }

    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign(
            {data: password},
            'access',
            {expiresIn: 60 * 60 * 60 * 60}
        )
        req.session.authorization = {accessToken, username}
        return res.status(200).json({message: `User ${username} successfully logged in`});    
    } else{
        return res.status(400).json({message: "Incorrect login and/or password"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.body.username
    const review = req.body.review
    let isbn = req.params.isbn

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (! books[isbn]["reviews"].some(review => review.username === username)){
        books[isbn]["reviews"].push({"username": username, "review": review})
        return res.send("The review was recorded successfully!")
    }

    else{
        let current_review = books[isbn]["reviews"].find(r => r.username === username);
        current_review["review"] = review
        return res.send("The review was updated successfully!")
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username
    let isbn = req.params.isbn
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn]["reviews"].some(review => review.username === username)){
        books[isbn].reviews = books[isbn].reviews.filter(r => r.username !== username);
        return res.send("The review was deleted successfully!")
    }
    else {
        return res.send("You haven't reviewed this book yet")
    }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
