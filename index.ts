const request = require('request');
const express = require('express');
const jwt = require('jsonwebtoken');
//const passport = require('passport-jwt');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')(/* options */);
const link = 'postgres://Bookish:ZSE$4rfv@localhost:5432/Bookish';
const db = pgp(link);

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
        res.sendFile(__dirname + "/frontend/" + "Bookish.html");
        }
    );

    app.get("/Catalogue", (req, res) => {
        //let inqueery = req.query.inqueery;
        db.any('SELECT * FROM public."Books"')
            .then((catalogue) => {
                let bookList = listBooksFromCatalogue(catalogue);
                res.send(bookList);
                console.log(bookList);
            }, (error) => {console.log(error)});
    } );

    // app.post('');

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}



function validate(username: string, password: string): Promise<any> {
    let token;
    return db.any(`SELECT * FROM public."User" WHERE "Username" = '${username}';`)
        .then((user) => {
            if (user.length === 0){
                throw Error("Username not found");
            }

            if (user[0].Password === password) {
                token = jwt.sign({ foo: user[0].User_ID }, 'shhhhh');
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
