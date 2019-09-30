const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

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
  // console.table(bookIdParams);

  Book.findById(bookIdParams)
    .populate('author')
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

router.get('/authors/add', (req, res, next) => {
  res.render("author-add")
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl })
  newAuthor.save()
    .then((book) => {
      res.redirect('/books')
    })
    .catch((error) => {
      next(error);
    })
});

// reviews

router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update({ _id: req.query.book_id }, { $push: { reviews: { user, comments } } })
    .then(book => {
      res.redirect(`/books/${req.query.book_id}`);
    })
    .catch((error) => {
      console.log(error)
    })
});

module.exports = router;


