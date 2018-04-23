var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoose_dashboard');

mongoose.Promise = global.Promise;

var MinxSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 1 },
    weight:  { type: Number, required: true },
})
mongoose.model('Minx', MinxSchema);
var Minx = mongoose.model('Minx');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var minx = Minx.find({}, function(err, minx) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.render('index', {minx: minx});
        }
    });
});
app.get('/minx/new', function(req, res) {
    res.render('new');
});

app.post('/minx', function(req, res) {
    console.log("POST DATA", req.body);
    var minx = new Minx(req.body);
    minx.save(function(err) {
        if (err) {
            res.render('new', {errors: minx.errors});
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
});

app.get('/minx/:id', function(req, res) {
    console.log('made it to id route');
        Minx.findOne({_id: req.params.id}, function(err, minx) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.render('minx', {minx: minx});
        }
    });
});

app.get('/minx/edit/:id', function(req, res) {
    console.log('made it to edit route');
    Minx.findOne({_id: req.params.id}, function(err, minx) {
        if (err) {
            console.log("there's a problem");
            res.render('edit', {errors: minx.errors});
        }
        else {
            res.render('edit', {minx: minx});
        }
    });
});

app.post('/minx/:id', function(req, res) {
    console.log('made to update route');
    Minx.findByIdAndUpdate(req.params.id, req.body, function(err, minx) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.redirect('/');
        }
    });
});

app.post('/minx/destroy/:id', function(req, res) {
    console.log('made it to delete route');
    Minx.findByIdAndRemove(req.params.id, function(err, minx) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.redirect('/');
        }
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});
