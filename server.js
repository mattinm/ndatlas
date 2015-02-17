var express = require('express');
var bodyParser = require('body-parser');
var shp = require('shpjs');
var homeConfig = require(__dirname + '/utils/HomeConfig');
var chapters = require(__dirname + '/utils/Chapters');
var app = express();
app.set('view engine', 'jade'); // declare we're going to use jade
app.set('views', __dirname + '/views'); // tell express which directory our jade templates (views) will be in
app.use(express.static(__dirname + '/public')); // tell express which directory will have our statis (public) assets like js and css

// these are the routes
app.get('/', function (req, res) {
    res.render('home', {    // use res.render to tell express what template to use, in this case it will render home.jade and pass the following object for the template to use
        'title': 'ND@125',
        'data': homeConfig
    });
});

app.get('/chapters/:chapter', function (req, res) {
    var chapter = req.params.chapter; // pull value from URL using the :chapter placeholder
    
    res.render('chapter', {    // use res.render to tell express what template to use, in this case it will render chapter.jade and pass the following object for the template to use
        'title': chapters[chapter].title+' &ndash; Chapter '+chapter.substring(0,1).toUpperCase()+chapter.slice(1),
        'data': chapters,
        'chapter': chapter
    });
});

app.get('/explore', function(req, res) {
    res.send('you triggered the explore route');    // use res.send to send a string, or res.json to send a js object
});

app.listen(8005, '127.0.0.1');  // tell express which port and ip to listen on
