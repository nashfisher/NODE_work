var express = require('express');

var app = express();
app.use(express.static(__dirname + '/static'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
    response.render('main');
});

app.get('/users', function(request, response) {
    var users_array = [
        {name: 'Michael', email: 'michael@codingdojo.com'},
        {name: "Jay", email: "jay@codingdojo.com"}, 
        {name: "Brendan", email: "brendan@codingdojo.com"}, 
        {name: "Andrew", email: "andrew@codingdojo.com"}
    ];
    response.render('users', {users: users_array});   
});

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.listen(8000, function() {
    console.log('listening on port 8000');
    console.log(__dirname);
});

app.post('/users', function (req, res) {
    console.log('POST DATA \n \n', req.body)
    res.redirect('/')
});

app.get('/users/:id', function(req, res) {
    console.log('the user id requested is:', req.params.id);
    res.send('you requested the user with id: ' + req.params.id);
});