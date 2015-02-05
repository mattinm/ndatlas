var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'jade'); // declare we're going to use jade
app.set('views', __dirname + '/views'); // tell express which directory our jade templates (views) will be in
app.use(express.static(__dirname + '/public')); // tell express which directory will have our statis (public) assets like js and css

// these are the routes
app.get('/', function (req, res) {
    res.render('home', {    // use res.render to tell express what template to use, in this case it will render "home" and pass the following object for the template to use
        'title': 'ND@125'
    });
});

app.get('/explore', function(req, res) {
    res.send('you triggered the explore route');    // use res.send to send a string, or res.json to send a js object
});

app.listen(8005, '127.0.0.1');  // tell express which port and ip to listen on
