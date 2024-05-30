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

function getBooks(){
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 100)
    })
}

public_users.get('/',function (req, res) {
    getBooks()
        .then(books => {
            res.send(JSON.stringify(books, null, 4))
        })
        .catch(error =>{
            res.status(404).send('Error fetching books')
        })
});

function getBookByISBN(isbn){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]){
                resolve(books[isbn])
            }
            else{
                reject("Book not found")
            }
        }, 100)
    })
}

public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    getBookByISBN(isbn)
        .then(book => res.send(book))
        .catch(error => res.status(404).json({ message: error }))
 })
  
function getBookByAuthor(author){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByAuthor = Object.values(books).filter(book => book.author === author);
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor);
            } else {
                reject("Books not found");
            }
        }, 100)
    })
}

public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    getBookByAuthor(author)
        .then(book => res.send(book))
        .catch(error => res.status(404).json({ message: error }))
});

function getBookByTitle(title){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByTitle = Object.values(books).filter(book => book.title === title);
            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject("Books not found");
            }
        }, 100)
    })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    getBookByTitle(title)
        .then(book => res.send(book))
        .catch(error => res.status(404).json({ message: error }))
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
