var express = require('express');
var parser = require('body-parser');
var shp = require('shpjs');
var nosql = require('nosql').load(__dirname+'/database.nosql');
var app = express();
var stories = [];
var slug_to_story_map = {};
var selected = [];

nosql.on('load', function() {
    nosql.all(function(a) {
        selected.push(a);
        return a;
    }, function() {
        var i = 0;
        selected.forEach(function(o) {
            o.slug = o.title.toLowerCase().replace(/[^a-z ]+/g, '').replace(/ +/g, '-');
            slug_to_story_map[o.slug] = i++;
            stories.push(o);
        });
    }); 
});

// call after load of DB
/*
nosql.insert(object, [fnCallback]);
nosql.insert(array, fnCallback);
nosql.all(fnMap, fnCallback)
nosql.one(fnMap, fnCallback)
nosql.top(max, fnMap, fnCallback)
nosql.each(fnCallback)
*/

app.use(parser());
app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
    res.render('home', {
        'title': 'nd@125',
        'stories': stories
    });
});

app.get('/arcgis', function (req, res) {
    res.render('arcgis', {
        'stories': stories,
        'mapurl': 'http://undgeography.und.edu/geographyund/rest/services/NDView/NDView/MapServer'
    });
});

app.get('/toggle', function (req, res) {
    res.render('arcgis', {
        'stories': stories,
        'mapurl': 'http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer'
    });
});

app.get('/stories/:title', function (req, res) {
    var i = slug_to_story_map[req.params.title];
    var story = stories[i];

    res.render(story.type, {
        'title': story.title+' &ndash; nd@125',
        'story': story,
        'stories': stories,
        'index': i
    });
});

app.get('/admin', function (req, res) {
    res.render('admin', {
        'title': 'Admin &ndash; nd@125',
        'stories': stories
    });
});

app.post('/api/:action', function(req, res) {
    if (req.params.action === 'delete') {
        delete slug_to_story_map[stories[parseInt(req.body.index)]];
        
        var ii = parseInt(req.body.index);
        var s = Object.keys(slug_to_story_map);
        
        for (var i = 0, n = s.length; i < n; i++) {
            if (slug_to_story_map[s[i]] > ii) slug_to_story_map[s[i]] = slug_to_story_map[s[i]] - 1;
        }
        
        stories.splice(parseInt(req.body.index), 1);
        res.send('1');
    }
    else if (req.params.action === 'create') {
        var data = req.body.data;
        
        data.slug = data.title.toLowerCase().replace(/[^a-z ]+/g, '').replace(/ +/g, '-');
        stories.push(data);
        slug_to_story_map[data.slug] = stories.length-1;
    }
});

app.listen(8005, '127.0.0.1');
