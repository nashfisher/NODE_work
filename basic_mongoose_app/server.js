// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basic_mongoose');

mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
    name : { type: String, required: true, minlength: 1 },
    age:  { type: Number, required: true },
})
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.render('index', {users: users});
        }
    })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
})
// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    var user = new User(req.body.body);
    user.save(function(err) {
        if (err) {
            User.find({}, function(err, users) {
            res.render('index', {errors: user.errors, users: users});
            });
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
    // This is where we would add the user from req.body to the database.
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
