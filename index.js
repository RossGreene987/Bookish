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
main();
function main() {
    var port = 3000;
    var app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static('frontend'));
    // handles login
    app.get('/login', function (req, res) {
        res.sendFile(__dirname + "/frontend/" + "index.html");
    });
    app.post('/process_get', function (req, res) {
        var response = {
            username: req.body.username,
            password: req.body.password
        };
        return validate(response.username, response.password).then(function (token) {
            // console.log(token);
            res.send({
                token: token,
                redirect: true
            });
        }, function (error) {
            // console.log('error in validate', error);
            res.send({
                error: error.toString(),
                redirect: false
            });
        });
    });
    // handles mainsite
    app.get('/Bookish', function (req, res) {
        res.sendFile(__dirname + "/frontend/" + "Bookish.html");
    });
    app.get("/Bookish", function (req, res) {
        //let inqueery = req.query.inqueery;
        db.any('SELECT * FROM public."Books"')
            .then(function (catalogue) {
            var bookList = listBooksFromCatalogue(catalogue);
            res.send(bookList);
        }, function (error) { console.log(error); });
    });
    // app.post('');
    app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
}
function validate(username, password) {
    var token;
    return db.any("SELECT * FROM public.\"User\" WHERE \"Username\" = '" + username + "';")
        .then(function (user) {
        if (user.length === 0) {
            throw Error("Username not found");
        }
        if (user[0].Password === password) {
            token = jwt.sign({ foo: user[0].User_ID }, 'shhhhh');
            return token;
        }
        else {
            throw Error("password incorrect");
        }
    }, function () {
        throw Error("Database not reached");
    });
}
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
// var decoded = jwt.verify(token, 'shhhhh');
// console.log(decoded.foo);
// const passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy;
// function listBooksFromCatalogue(catalogue){
//     let bookList = catalogue.map((book) => {
//         return new Book(book.Author, book.Copies_Available, book.ISBN, book.Title, book.Number_in_Library)
//     });
//     return bookList;
// }
//
//
//
// app.get("/Bookish", (req, res) => {
//     //let inqueery = req.query.inqueery;
//     db.any('SELECT * FROM public."Books"')
//         .then((catalogue) => {
//         let bookList = listBooksFromCatalogue(catalogue);
//         res.send(bookList)
//     }, (error) => {console.log(error)});
// } );
