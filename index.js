var request = require('request');
var express = require('express');
var jwt = require('jsonwebtoken');
//const passport = require('passport-jwt');
var bodyParser = require('body-parser');
var pgp = require('pg-promise')( /* options */);
var link = 'postgres://Bookish:ZSE$4rfv@localhost:5432/Bookish';
var db = pgp(link);
var secret = 'shhhhh';
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
var Loan = /** @class */ (function () {
    function Loan(title, returnDate) {
        this.title = title;
        this.returnDate = returnDate;
    }
    return Loan;
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
        if (validateToken(req)) {
            res.sendFile(__dirname + "/frontend/" + "Bookish.html");
        }
        else {
            res.redirect('/login');
        }
    });
    // handles Catalogue
    app.post('/process_fetchCatalogue', function (req, res) {
        db.any('SELECT * FROM public."Books"')
            .then(function (catalogue) {
            var bookList = listBooksFromCatalogue(catalogue);
            res.send(bookList);
        }, function (error) { return res.send(error); });
    });
    // handles adding a new Book
    app.post('/process_addBook', function (req, res) {
        var book = new Book(req.body.author, req.body.copiesAvailable, req.body.ISBN, req.body.bookName, req.body.copiesInLibrary);
        db.any("INSERT INTO public.\"Books\" VALUES ('" + book.author + "', '" + book.copiesAvailable + "', '" + book.ISBN + "', '" + book.title + "', '" + book.numberInLibrary + "');")
            .then(function () {
            res.send({ success: true });
        }, function (error) { return res.send({ success: false, Error: error }); });
    });
    // handles fetching user's loans
    app.post('/process_fetchLoans', function (req, res, next) {
        var id = jwt.verify(req.body.token, secret).foo;
        getLoanData(id, res)
            .then(function (data) {
            return res.send(data.map(function (bookObject) { return new Loan(bookObject.Title, bookObject.Return_Date); }))["catch"](next);
        });
    });
    app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
}
function validateToken(req) {
    var token = req.query.token;
    try {
        var decoded = jwt.verify(token, secret);
        console.log(decoded.foo);
        return Number.isInteger(decoded.foo);
    }
    catch (_a) {
        return false;
    }
}
function validate(username, password) {
    var token;
    return db.any("SELECT * FROM public.\"User\" WHERE \"Username\" = '" + username + "';")
        .then(function (user) {
        if (user.length === 0) {
            throw Error("Username not found");
        }
        if (user[0].Password === password) {
            token = jwt.sign({ foo: user[0].User_ID }, secret);
            console.log(token);
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
function getLoanData(id, res) {
    return db.any("SELECT * FROM public.\"Loans\"\n            INNER JOIN \"Book_Instances\" ON \"Loans\".\"Book_ID\" = \"Book_Instances\".\"Book_ID\"\n            INNER JOIN \"Books\" ON \"Book_Instances\".\"ISBN\" = \"Books\".\"ISBN\"\n            WHERE \"User_ID\" = '" + id + "';");
}
