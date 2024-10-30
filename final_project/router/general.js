const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });

  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register Customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const data = JSON.stringify(books)
  return res.status(300).json({books:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  return res.status(300).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const filteredBooks = booksArray.filter(book => book.author === author);

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found by this author." });
  }

  return res.status(200).json({booksByAutor:filteredBooks});
  
  //BY PROMISES:
  // const author = req.params.author;
  //   return new Promise((resolve, reject) => {
  //       // Convert books object into an array and filter by author
  //       const booksArray = Object.values(books);
  //       const filteredBooks = booksArray.filter(book => book.author === author);

  //       if (filteredBooks.length > 0) {
  //           resolve(filteredBooks); // Resolve with the filtered books
  //       } else {
  //           reject(new Error("No books found by this author.")); // Reject if no books are found
  //       }
  //   })
  //   .then(filteredBooks => {
  //       return res.status(200).json({ booksByAuthor: filteredBooks }); // Respond with the filtered books
  //   })
  //   .catch(error => {
  //       return res.status(404).json({ message: error.message }); // Handle the error
  //   });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  const filteredBooks = booksArray.filter(book => book.title === title);

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found by this title." });
  }

  return res.status(200).json({booksByTitle:filteredBooks});
  
  //BY PROMISES:
  // const title = req.params.title;
  //   return new Promise((resolve, reject) => {
  //       // Convert books object into an array and filter by title
  //       const booksArray = Object.values(books);
  //       const filteredBooks = booksArray.filter(book => book.title === title);

  //       if (filteredBooks.length > 0) {
  //           resolve(filteredBooks); // Resolve with the filtered books
  //       } else {
  //           reject(new Error("No books found by this title.")); // Reject if no books are found
  //       }
  //   })
  //   .then(filteredBooks => {
  //       return res.status(200).json({ booksByTitle: filteredBooks }); // Respond with the filtered books
  //   })
  //   .catch(error => {
  //       return res.status(404).json({ message: error.message }); // Handle the error
  //   });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "No book found with this ISBN." });
  }

  const reviews = book.reviews;
  return res.status(200).json(reviews);
});

module.exports.general = public_users;