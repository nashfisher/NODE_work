var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/product_manager');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 4 },
    price: { type: Number, required: true, default: 0},
    image: { type: String, default: '' },
}, {timestamps: true});

mongoose.model('Product', ProductSchema);

var Product = mongoose.model('Product');

app.use(bodyParser.json());

var path = require('path');

app.use(express.static(path.join(__dirname + '/angularApp/dist')));


// Get ALL
app.get('/api/products/', function(req, res) {
    var product = Product.find({}, function(err, product) {
        if (err) {
            console.log("there's a problem");
            res.json({error: err});
        }
        else {
            res.json({data: product});
        }
    });
});
// Get ONE
app.get('/api/products/:product', function(req, res) {
    console.log('made it to show route');
    var product = Product.findById(req.params.product, function (err, product) {
        if (err) {
            console.log('error in show');
        }
        else {
            console.log('successful');
            res.json({data: product});
        }
    });
});
// Create ONE
app.post('/api/products/', function(req, res) {
    console.log('made it to create route');
    var product = new Product(req.body);
    product.save(function(err) {
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
app.put('/api/products/:product/', function(req, res) {
    console.log('made it to update route');
    Product.findByIdAndUpdate(req.params.product, req.body, function(err, product) {
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
app.delete('/api/products/:product/', function(req, res) {
    console.log('made it to delete route');
    Product.findByIdAndRemove(req.params.product, function(err) {
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
    res.sendFile(path.resolve('./angularApp/dist/index.html'))
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});
