
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

// const passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy;

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


function main() {
    const port = 3000;
    const app = express();



    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    app.get('/login', function(req, res) {
        res.sendFile(__dirname + "/frontend/" + "index.html");
    });

    app.use(express.static('frontend'));

    // app.post('/process_get', passport.authenticate('local', { successRedirect: '/',
    //     failureRedirect: '/login' }));


    app.post('/process_get', function(req, res){
        console.log(req);
        console.log(req.body)
        let response = {
            username : req.body.username,
            password : req.body.password,
        };
        console.log(response);
        res.redirect('login');
        // res.end(JSON.stringify(response));
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));


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