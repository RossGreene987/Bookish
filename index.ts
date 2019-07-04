const request = require('request');
const express = require('express');
const jwt = require('jsonwebtoken');
//const passport = require('passport-jwt');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')(/* options */);
const link = 'postgres://Bookish:ZSE$4rfv@localhost:5432/Bookish';
const db = pgp(link);
const secret = 'shhhhh'

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

main();

function main() {
    const port = 3000;
    const app = express();

    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    app.use(express.static('frontend'));

    // handles login
    app.get('/login', function(req, res) {
        res.sendFile(__dirname + "/frontend/" + "index.html");
    });
    app.post('/process_get', function(req, res){
        let response = {
            username : req.body.username,
            password : req.body.password,
        };

        return validate(response.username, response.password).then(
            (token) => {
                // console.log(token);
                res.send({
                    token: token,
                    redirect: true
                });
            }, (error) => {
                // console.log('error in validate', error);
                res.send({
                    error: error.toString(),
                    redirect: false
                })
            }
        )
    });


    // handles mainsite
    app.get('/Bookish', function(req, res) {
        if(validateToken(req)){
            res.sendFile(__dirname + "/frontend/" + "Bookish.html");
        } else {
            res.redirect('/login');
        }
    });

    // handles Catalogue
    app.post('/process_fetchCatalogue', function(req,res){
        db.any('SELECT * FROM public."Books"')
            .then((catalogue) => {
                let bookList = listBooksFromCatalogue(catalogue);

                res.send(bookList);
            }, (error) => res.send(error));
    });

    // handles adding a new Book
    app.post('/process_addBook', function(req, res){
        let book = new Book(req.body.author, req.body.copiesAvailable, req.body.ISBN, req.body.bookName, req.body.copiesInLibrary);
        db.any(`INSERT INTO public."Books" VALUES ('${book.author}', '${book.copiesAvailable}', '${book.ISBN}', '${book.title}', '${book.numberInLibrary}');`)
            .then(() => {
                res.send({success: true});
            }, (error) => res.send({success: false, Error: error}));

    });

    // handles fetching user's loans
    app.post('/process_fetchLoans', function(req,res){
        console.log(req.body);
        let id = jwt.verify(req.body.token, secret).foo;
        console.log(id);

        return getLoanData(id, res).then(
            (loanData) => {
                loanData.forEach(loan => {
                    db.any(`SELECT * FROM public."User" WHERE "Username" = '${loan.Book_ID}';`)
                }
            } ,
            () => {
                console.log("hi");
            }
        );
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

function validateToken(req){
    let token = req.query.token;
    try {
        let decoded = jwt.verify(token, secret);
        console.log(decoded.foo);
        return Number.isInteger(decoded.foo);
    } catch {
        return false
    }
}

function validate(username: string, password: string): Promise<any> {
    let token;
    return db.any(`SELECT * FROM public."User" WHERE "Username" = '${username}';`)
        .then((user) => {
            if (user.length === 0){
                throw Error("Username not found");
            }

            if (user[0].Password === password) {
                token = jwt.sign({ foo: user[0].User_ID }, secret);
                console.log(token);
                return token

            } else {
                throw Error("password incorrect");
            }
        }
        , () => {throw Error("Database not reached");
        });
}

function listBooksFromCatalogue(catalogue){
    let bookList = catalogue.map((book) => {
        return new Book(book.Author, book.Copies_Available, book.ISBN, book.Title, book.Number_in_Library)
    });
    return bookList;
}

function getLoanData(id, res) {
    return db.any(`SELECT * FROM public."Loans" WHERE "User_ID" = '${id}';`)
        .then((loans) => {
                return loans;
            },
            (error) => {
                throw error;
            });
}