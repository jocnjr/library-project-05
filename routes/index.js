const express = require('express');
const router = express.Router();
const Book = require('../models/book');

/* GET home page */
router.get('/', (req, res, next) => {
  Book.find()
    .then(arrayOfBooksFromTheDb => {
      // console.log(arrayOfBooksFromTheDb);
      res.render('index', { books: arrayOfBooksFromTheDb });
    })
    .catch(error => { throw new Error(error) });
});

router.get('/book/:bookId', (req, res, next) => {
  const bookIdParams = req.params.bookId;
  // console.log(bookIdParams);

  Book.findById(bookIdParams)
    .then(book => {
      console.log(book);
      res.render('book-detail', book);
    })
    .catch(error => { throw new Error(error) });
});



module.exports = router;


