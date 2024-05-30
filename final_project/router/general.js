const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => { 
    let u = users.filter((user) => {return user.username === username})
    if (u.length > 0){
        return true
    }
    else{
        return false
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if (username && password){
        if (!doesExist(username)){
            users.push({"username": username, "password": password})
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        }
        else{
            return res.send("User already exists")
        }
    }

    return res.status(404).json({message: "Unable to register"})
});

public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4))
});

public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if (books[isbn] != {}){
        return res.send(books[isbn])
    }
    return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    let book = Object.values(books).filter((book) => book["author"] === author)
    if (book != {}){
        return res.send(book)
    }
    return res.status(404).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    let book = Object.values(books).filter((book) => book["title"] === title)
    if (book != {}){
        return res.send(book)
    }
    return res.status(404).json({message: "Book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let book = books[isbn]
    if (book != {}){
        return res.send(book["reviews"])
    }
    return res.status(404).json({message: "Book not found"});
});


module.exports.general = public_users;
