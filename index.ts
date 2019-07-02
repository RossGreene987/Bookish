
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

function getAllBooks(){
    let list;
    db.any('SELECT * FROM public."Books"').then(
        (data) => {
            list = data.map((book) => {
                return new Book(book.Author, book.Copies_Available, book.ISBN, book.Title, book.Number_in_Library)
            });
            return list;
        },
        (error) => { return error}

    );
}

function main() {

    const app = express();
    const port = 3000;
    //app.use(express.static('frontend'));

    app.get("/bookish", (req, res) => {
        //let inqueery = req.query.inqueery;
        res.send(getAllBooks())
        // res.send(db.any('SELECT * FROM public."Books"', 'John'));
    } );

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

main();