var express = require('express');
var path = require('path');
var session = require('express-session');

var app = express();
var bodyParser = require('body-parser');

app.use(session({secret: 'codingdojolies'}));

app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index");
});

app.post('/result', function(req, res) {
    console.log("POST DATA", req.body);
    
    // Then redirect to the result route
    res.render('result', {data: req.body});
});


app.listen(8000, function() {
    console.log("listening on port 8000");
});
