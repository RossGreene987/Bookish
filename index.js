var request = require('request');
var express = require('express');
var jwt = require('jsonwebtoken');
//const passport = require('passport-jwt');
var bodyParser = require('body-parser');
var pgp = require('pg-promise')( /* options */);
var link = 'postgres://Bookish:ZSE$4rfv@localhost:5432/Bookish';
var db = pgp(link);
var Book = /** @class */ (function () {
    function Book(author, copiesAvailable, ISBN, title, numberInLibrary) {
        this.author = author;
        this.copiesAvailable = copiesAvailable;
        this.ISBN = ISBN;
        this.title = title;
        this.numberInLibrary = numberInLibrary;
    }
    return Book;
}());
// const passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy;
function listBooksFromCatalogue(catalogue) {
    var bookList = catalogue.map(function (book) {
        return new Book(book.Author, book.Copies_Available, book.ISBN, book.Title, book.Number_in_Library);
    });
    return bookList;
}
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//
//
//
//         User.findOne({ username: username }, function(err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             if (!user.validPassword(password)) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, user);
//         });
//     }
// ));
function main() {
    var port = 3000;
    var app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.get('/login', function (req, res) {
        res.sendFile(__dirname + "/" + "index.html");
    });
    // app.post('/process_get', passport.authenticate('local', { successRedirect: '/',
    //     failureRedirect: '/login' }));
    app.post('/process_get', function (req, res) {
        console.log(req);
        console.log(req.body);
        var response = {
            username: req.body.username,
            password: req.body.password
        };
        console.log(response);
        res.redirect('login');
        // res.end(JSON.stringify(response));
    });
    app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
    // app.use(express.static('frontend'));
    // let token;
    // app.get("/login", (req, res) => {
    //     let username = req.query.username;
    //     let password = req.query.password;
    //     console.log(password, username);
    //
    //     db.any(`SELECT * FROM public."User" WHERE "Username" = '${username}';`)
    //         .then((user) => {
    //                 console.log(user[0].Password);
    //
    //                 if (user[0].Password === password) {
    //                     res.send("login successful");
    //                     token = jwt.sign({ foo: user[0].User_ID }, 'shhhhh');
    //                     console.log(token);
    //                     var decoded = jwt.verify(token, 'shhhhh');
    //                     console.log(decoded.foo);
    //                 } else {
    //                     res.send("incorrect password");
    //                 }
    //             }
    //             , (error) => {res.send("username not found")});
    //
    //     // res.send(username)
    // });
    // app.post('/login', passport.authenticate('local', { successRedirect: '/',
    //     failureRedirect: '/login' }));
    // passport.use(new LocalStrategy(
    //     function(username, password, done) {
    //         User.findOne({ username: username }, function(err, user) {
    //             if (err) { return done(err); }
    //             if (!user) {
    //                 return done(null, false, { message: 'Incorrect username.' });
    //             }
    //             if (!user.validPassword(password)) {
    //                 return done(null, false, { message: 'Incorrect password.' });
    //             }
    //             return done(null, user);
    //         });
    //     }
    // ));
    // app.get("/bookish", (req, res) => {
    //     //let inqueery = req.query.inqueery;
    //     db.any('SELECT * FROM public."Books"')
    //         .then((catalogue) => {
    //         let bookList = listBooksFromCatalogue(catalogue);
    //         res.send(bookList)
    //     }, (error) => {console.log(error)});
    // } );
}
main();
