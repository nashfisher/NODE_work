var express = require('express');
var session = require('express-session');
var path = require('path');
var app = express();



app.use(session({secret: 'codingdojolies'}));

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    if (!req.session.count) {
        req.session.count = 0;
    }
    req.session.count ++;
    res.render("index", {count: req.session.count});
})

app.get('/two', function(req, res) {
    req.session.count ++;
    res.redirect('/');
})

app.get('/reset', function(req, res) {
    req.session.count = 0;
    res.redirect('/');
})

app.listen(8000, function() {
    console.log("listening on port 8000");
   });