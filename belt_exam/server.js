var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/belt_database');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var PetSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, unique: true },
    pettype: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 3 },
    skill1: { type: String, required: false },
    skill2: { type: String, required: false },
    skill3: { type: String, required: false },
    likes: { type: Number, required: false, default: 0 },
}, {timestamps: true});

mongoose.model('Pet', PetSchema);

var Pet = mongoose.model('Pet');

app.use(bodyParser.json());

var path = require('path');

app.use(express.static(path.join(__dirname + '/angBelt/dist')));


// Get ALL
app.get('/api/pets/', function(req, res) {
    var pet = Pet.find({}, function(err, pet) {
        if (err) {
            console.log("there's a problem");
            res.json({error: err});
        }
        else {
            res.json({data: pet});
        }
    });
});
// Get ONE
app.get('/api/pets/:pet', function(req, res) {
    console.log('made it to show route');
    var pet = Pet.findById(req.params.pet, function (err, pet) {
        if (err) {
            console.log('error in show');
        }
        else {
            console.log('successful');
            res.json({data: pet});
        }
    });
});
// Create ONE
app.post('/api/pets/', function(req, res) {
    console.log('made it to create route');
    var pet = new Pet(req.body);
    pet.save(function(err) {
        if (err) {
            console.log('error in creation');
            res.json({error: err});
        }
        else {
            console.log('successful');
            res.json({message: 'successful creation'});
        }
    });
});
// Update ONE
app.put('/api/pets/:pet/', function(req, res) {
    console.log('made it to update route');
    Pet.findByIdAndUpdate(req.params.pet, req.body, function(err, pet) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            console.log('successful');
            res.json({message: 'successful update'});
        }
    });
});
// Delete ONE
app.delete('/api/pets/:pet/', function(req, res) {
    console.log('made it to delete route');
    Pet.findByIdAndRemove(req.params.pet, function(err) {
        if (err) {
            console.log('error in delete');
        }
        else {
            console.log('successful');
            res.json({message: 'success'});
        }
    });
});

app.all('*', (req,res,next) => {
    res.sendFile(path.resolve('./angBelt/dist/index.html'))
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});
