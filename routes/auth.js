const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require('passport');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "user already exists."
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        });

    })
    .catch();
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// router.post("/login", (req, res, next) => {
//   const theUsername = req.body.username;
//   const thePassword = req.body.password;

//   if (theUsername === "" || thePassword === "") {
//     res.render("auth/login", {
//       errorMessage: "Please enter both, username and password to sign up."
//     });
//     return;
//   }

//   User.findOne({ "username": theUsername })
//   .then(user => {
//       if (!user) {
//         res.render("auth/login", {
//           errorMessage: "The username doesn't exist."
//         });
//         return;
//       }
//       if (bcrypt.compareSync(thePassword, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         console.log('--->', req.session);
//         res.redirect("/");
//       } else {
//         res.render("auth/login", {
//           errorMessage: "Incorrect password"
//         });
//       }
//   })
//   .catch(error => {
//     next(error);
//   })
// });


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// logout for basic auth

// router.get("/logout", (req, res, next) => {
//   req.session.destroy((err) => {
//     // can't access session here
//     res.redirect("/login");
//   });
// });

// slack oauth


router.get("/slack", passport.authenticate("slack"));

router.get("/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/book/add",
    failureRedirect: "/" // here you would navigate to the classic login page
  })
);

module.exports = router;