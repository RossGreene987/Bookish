
const request = require('request');
const express = require('express');
const pgp = require('pg-promise')(/* options */);
const db = pgp('postgres://Bookish:ZSE$4rfv@localhost:5432/Bookish');

class Book {
    author: string;
    copiesAvailable: number;
    ISBN: number;
    title: string;
    numberInLibrary: number;
    constructor(author: string, copiesAvailable: number, ISBN: number, title: string, numberInLibrary: number) {
        this.author = author;
        this.copiesAvailable = copiesAvailable;
        this.ISBN = ISBN;
        this.title = title;
        this.numberInLibrary = numberInLibrary;
    }
}

function listBooksFromCatalogue(catalogue){
    let bookList = catalogue.map((book) => {
        return new Book(book.Author, book.Copies_Available, book.ISBN, book.Title, book.Number_in_Library)
    });
    return bookList;
}

function main() {
    const app = express();
    const port = 3000;
    //app.use(express.static('frontend'));

    app.get("/bookish", (req, res) => {
        //let inqueery = req.query.inqueery;
        db.any('SELECT * FROM public."Books"'
        ).then((catalogue) => {
            let bookList = listBooksFromCatalogue(catalogue);
            res.send(bookList)
        }, (error) => {console.log(error)});
    } );
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

main();