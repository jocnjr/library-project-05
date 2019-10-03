const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const ensureLogin = require("connect-ensure-login");
const checkRoles = require('../middlewares/check-roles');


/* GET home page */
router.get('/', ensureAuthenticated, (req, res, next) => {
  let checkAdmin = checkRoles('Admin');

  console.log(checkAdmin);

  Book.find({ owner: req.user._id })
    .then(arrayOfBooksFromTheDb => {
      res.render('index', { books: arrayOfBooksFromTheDb, user: req.user });
    })
    .catch(error => { throw new Error(error); });
});

router.get('/books/:bookId', (req, res, next) => {
  const bookIdParams = req.params.bookId;
  // console.table(bookIdParams);

  Book.findById(bookIdParams)
    .populate('owner')
    .populate('author')
    .then(book => {
      console.log(book);
      res.render('book-detail', book);
    })
    .catch(error => { throw new Error(error) });
});

// router.use((req, res, next) => {
//   if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
//     next(); // ==> go to the next route ---
//   } else {                          //    |
//     res.redirect("/login");         //    |
//   }                                 //    |
// }); 

router.get('/book/add', ensureAuthenticated, async (req, res, next) => {
  let authors = await Author.find();
  console.log(authors)
  res.render("book-add", { authors });
});

router.post('/books/add', ensureAuthenticated, (req, res, next) => {

  const {
    title,
    author,
    description,
    rating,
    latitude,
    longitude } = req.body;

  // adding location

  let location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };


  const userId = req.user._id;
  const newBook = new Book({ title, author: [author], description, rating, owner: userId, location })
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

// books api

router.get('/api', (req, res) => {
  Book.find()
    .then(arrayOfBooksFromTheDb => {
      res.json(arrayOfBooksFromTheDb);
    })
    .catch(error => { throw new Error(error); })
});

router.get('/api/book/:bookId', (req, res) => {
  Book.findById(req.params.bookId)
    .then(bookFromDb => {
      res.json(bookFromDb);
    })
    .catch(error => { throw new Error(error); })
});

// middleware for authentication

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}



module.exports = router;


