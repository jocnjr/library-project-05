const express = require('express');
const router = express.Router();
const Book = require('../models/book');

/* GET home page */
router.get('/', (req, res, next) => {
  Book.find()
    .then(arrayOfBooksFromTheDb => {
      res.render('index', { books: arrayOfBooksFromTheDb });
    })
    .catch(error => { throw new Error(error); });
});

router.get('/books/:bookId', (req, res, next) => {
  const bookIdParams = req.params.bookId;
  console.table(bookIdParams);

  Book.findById(bookIdParams)
    .then(book => {
      console.log(book);
      res.render('book-detail', book);
    })
    .catch(error => { throw new Error(error) });
});

router.get('/book/add', (req, res, next) => {
  res.render("book-add");
});

router.post('/books/add', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating })
  newBook.save()
    .then((book) => {
      res.redirect('/');
    })
    .catch(error => { throw new Error(error) });
});

router.get('/book/edit', (req, res, next) => {
  const bookId = req.query.book_id;

  Book.findById(bookId)
    .then((book) => {
      console.table(book);
      res.render("book-edit", book);
    })
    .catch(error => { throw new Error(error); });
});

router.post('/books/edit/:bookId', (req, res, next) => {
  const { bookId } = req.params;

  const { title, author, description, rating } = req.body;

  Book.findByIdAndUpdate(bookId, { title, author, description, rating })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => { throw new Error(error); });
});

router.get('/book/delete/:bookId', (req, res) => {
  const { bookId } = req.params;
  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect('/'))
    .catch(error => { throw new Error(error); });
});

module.exports = router;


