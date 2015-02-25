var express = require('express');
var parser = require('body-parser');
var shp = require('shpjs');
var app = express();
var stories = [];
var slug_to_story_map = {};

var nosql = require('nosql').load(__dirname+'/database.nosql');
nosql.on('load', function() {
    var map = function(doc) {
        return doc;
    };

    var callback = function(selected) {
        var i = 0;
        selected.forEach(function(o) {
            o.slug = o.title.toLowerCase().replace(/[^a-z ]+/g, '').replace(/ +/g, '-');
            slug_to_story_map[o.slug] = i++;
            stories.push(o);
        });
    };

    nosql.all(map, callback); 
});

//      // call after load of DB
//      nosql.insert(object, [fnCallback]);
//      nosql.insert(array, fnCallback);
//
//      nosql.all(fnMap, fnCallback)
//      nosql.one(fnMap, fnCallback)
//      nosql.top(max, fnMap, fnCallback)
//      nosql.each(fnCallback)

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
