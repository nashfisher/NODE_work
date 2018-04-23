var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var session = require('express-session');

var bcrypt = require('bcrypt-as-promised');

app.use(session({secret: 'ifICantScubaWhatHasThisAllBeenAbout'}))

mongoose.connect('mongodb://localhost/login_registration');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

// User Model
var UserSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'email cannot be blank'], minlength: 1, unique: true, validate: {
        validator: function(email) {
            return emailRegex.test(email);
        },
        message: 'email entered is not a valid email'
    }},
    first_name:  { type: String, required: true },
    last_name: { type: String, required: true},
    password: { type: String, required: true},
    birthdate: { type: Date, required: true},
    // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {timestamps: true});

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10).then(hash => {
        this.password = hash;
        next();
    });
});
// var CommentSchema = new mongoose.Schema({
//     _message: { type: Schema.Types.ObjectId, ref: 'Message' },
//     username: { type: String, required: true },
//     text: { type: String, required: true }
// }, { timestamps: true });

mongoose.model('User', UserSchema);
// mongoose.model('Comment', CommentSchema);

var User = mongoose.model('User');
// var Comment = mongoose.model('Comment');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    current_user = req.session.current_user;
    errors = req.session.error;
    res.render('index', {current_user: current_user});
});

app.post('/user', function(req, res) {
    console.log('made it to user creation');
    var user = new User({email: req.body.email, first_name: req.body.first_name,
        last_name: req.body.last_name, password: req.body.password, birthdate: req.body.birthdate});
    user.save(function(err) {
        if (err) {
            req.session.error = err.message;
            console.log(err.message);
            res.redirect('/');
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
});

app.post('/login', function(req, res) {
    console.log('made it to login route');
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            console.log('cannot find user. incorrect email or password.');
        }
        else {
            bcrypt.compare(req.body.password, user.password).then(results => {
                if (results == true) {
                    console.log('success');
                    req.session.current_user = user.first_name;
                    console.log(req.session.current_user);
                    res.redirect('/');
                }
            });
        };
    });
});

// app.post('/comment/:id', function(req, res) {
//     console.log('made it to comment creation');
//     Message.findOne({_id: req.params.id}, function(err, message) {
//         var comment = new Comment(req.body);
//         comment._message = message._id;
//         message.comments.push(comment);
//         comment.save(function(err) {
//             message.save(function(err) {
//                 if(err) {
//                     console.log('error');
//                 }
//                 else {
//                     console.log('created comment')
//                     res.redirect('/');
//                 }
//             });
//         });
//     });
// });

app.listen(8000, function() {
    console.log("listening on port 8000");
});
