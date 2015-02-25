var express = require('express');
var parser = require('body-parser');
var shp = require('shpjs');
var app = express();
var stories = require(__dirname+'/utils/StoriesData');
var slug_to_story_map = {};

for (var i = 0, n = stories.length; i < n; i++) {
    stories[i].slug = stories[i].title.toLowerCase().replace(/[^a-z ]+/g, '').replace(/ +/g, '-');
    slug_to_story_map[stories[i].slug] = i;
}

app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
    res.render('home', {
        'stories': stories
    });
});

app.get('/stories/:title', function (req, res) {
    var i = slug_to_story_map[req.params.title];
    var story = stories[i];
    
    res.render(story.type, {
        'story': story,
        'stories': stories,
        'index': i
    });
});

app.listen(8005, '127.0.0.1');
