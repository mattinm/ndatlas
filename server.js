var express = require('express');
var parser = require('body-parser');
var shp = require('shpjs');
var app = express();
var stories = {
    'titles': [
        'Story One',
        'Story Two',
        'Story Three',
        'Story Four',
        'Story Five'
    ]
};

app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
    res.render('home', {
        'stories': stories
    });
});

app.listen(8005, '127.0.0.1');
