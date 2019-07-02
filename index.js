var request = require('request');
var express = require('express');
var pgp = require('pg-promise')( /* options */);
var db = pgp('postgres://Bookish:ZSE$4rfv@localhost:5432/Bookish');
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
function getAllBooks() {
    var list;
    db.any('SELECT * FROM public."Books"').then(function (data) {
        list = data.map(function (book) {
            return new Book(book.Author, book.Copies_Available, book.ISBN, book.Title, book.Number_in_Library);
        });
        return list;
    }, function (error) { return console.log(error); });
}
function main() {
    var app = express();
    var port = 3000;
    //app.use(express.static('frontend'));
    app.get('/bookish', function (req, res) {
        //let inqueery = req.query.inqueery;
        res.send(getAllBooks());
        // res.send(db.any('SELECT * FROM public."Books"', 'John'));
    });
    app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
}
main();
