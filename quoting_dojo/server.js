var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quoting_dojo');

mongoose.Promise = global.Promise;

var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 1 },
    quote:  { type: String, required: true, minlength: 1 },
})
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote(req.body);
    quote.save(function(err) {
        console.log('successful');
        res.redirect('/quotes');
    });

});
app.get('/quotes', function(req, res) {
    var quotes = Quote.find({}, function(err, quotes) {
        if (err) {
            console.log('db error');
        }
        else {
            res.render('quotes', {quotes: quotes});
        }
    })
});


app.listen(8000, function() {
    console.log("listening on port 8000");
})
