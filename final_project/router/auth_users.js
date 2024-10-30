const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'your_jwt_secret_key', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; 
  const review = req.body.review;
  const username = req.session.authorization.username; 

  
  if (!review) {
      return res.status(400).json({ message: "Review is required." });
  }

  const book = books[isbn]; 
  if (!book) {
      return res.status(404).json({ message: "Book not found." });
  }

  if (!book.reviews) {
      book.reviews = {}; 
  }

  book.reviews[username] = review; 

  return res.status(200).json(`Review for the book with ISBN: ${isbn} has been updated/added`);
});

//delete a review of a user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL
  const username = req.session.authorization.username; // Get the username from the session

  // Check if the book exists
  const book = books[isbn]; // Assuming books is your collection of book objects
  if (!book) {
      return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has a review for this book
  if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review found for this book by the user." });
  }

  // Delete the review
  delete book.reviews[username]; // Remove the review for the specific user

  // Return a success message
  return res.status(200).json(`Review for the book with ISBN: ${isbn} has been deleted.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;