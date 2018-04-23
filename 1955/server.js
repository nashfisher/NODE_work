var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restful_task');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var TaskSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 1 },
}, {timestamps: true});

mongoose.model('Task', TaskSchema);

var Person = mongoose.model('Task');

app.use(bodyParser.json());

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
// Get ALL
app.get('/tasks', function(req, res) {
    var task = Task.find({}, function(err, task) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.json({data: task});
        }
    });
});
// Get ONE
app.get('tasks/:task/', function(req, res) {
    console.log('made it to show route');
    var person = Person.findOne({name: req.params.name}, function (err, person) {
        if (err) {
            console.log('error in show');
        }
        else {
            console.log('successful');
            res.json({data: person});
        }
    });
});
// Create ONE
app.post('/tasks/', function(req, res) {
    console.log('made it to create route');
    var task = new Task(req.body);
    task.save(function(err) {
        if (err) {
            console.log('error in creation');
        }
        else {
            console.log('successful');
            res.json({data: task});
        }
    });
});
// Update ONE
app.put('/tasks/:task/', function(req, res) {
    console.log('made it to update route');
    
});
// Delete ONE
app.delete('/tasks/:task/', function(req, res) {
    console.log('made it to delete route');
    Task.findByIdAndRemove(req.params.id, function(err, person) {
        if (err) {
            console.log('error in delete');
        }
        else {
            console.log('successful');
            res.redirect('/');
        }
    });
});




app.listen(8000, function() {
    console.log("listening on port 8000");
});
