var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/message_board');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 1 },
    message:  { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {timestamps: true});

var CommentSchema = new mongoose.Schema({
    _message: { type: Schema.Types.ObjectId, ref: 'Message' },
    username: { type: String, required: true },
    text: { type: String, required: true }
}, { timestamps: true });

mongoose.model('Message', MessageSchema);
mongoose.model('Comment', CommentSchema);

var Message = mongoose.model('Message');
var Comment = mongoose.model('Comment');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var message = Message.find({}).populate('comments').exec(function(err, message) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            console.log(message);
            res.render('index', {message: message});
        }
    })
});


app.post('/message', function(req, res) {
    console.log('made it to message creation');
    var message = new Message(req.body);
    message.save(function(err) {
        if (err) {
            res.render('index', {errors: message.errors});
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
});

app.post('/comment/:id', function(req, res) {
    console.log('made it to comment creation');
    Message.findOne({_id: req.params.id}, function(err, message) {
        var comment = new Comment(req.body);
        comment._message = message._id;
        message.comments.push(comment);
        comment.save(function(err) {
            message.save(function(err) {
                if(err) {
                    console.log('error');
                }
                else {
                    console.log('created comment')
                    res.redirect('/');
                }
            });
        });
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});
