var express = require('express');
var parser = require('body-parser');
var shp = require('shpjs');
var nosql = require('nosql').load(__dirname+'/database.nosql');
var app = express();
var chapters = [];
var selected = [];
var order = [];

nosql.on('load', function() {
    nosql.all(function(a) {
        selected.push(a);
        return a; 
    }, function() {
        selected.forEach(function(o) {
            chapters.push(o);
            order.push(o.slug);
        });
    });
}); 

/*
nosql.on('load', function() {
    nosql.all(function(a) {
        selected.push(a);
        return a;
    }, function() {
        var i = 0;
        selected.forEach(function(o) {
            o.slug = o.title.toLowerCase().replace(/[^a-z ]+/g, '').replace(/ +/g, '-');
            slug_to_story_map[o.slug] = i++;
            chapters.push(o);
        });
    }); 
});
*/

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
        'chapter': null,
        'previous': null,
        'next': null,
        'chapters': chapters
    });
});

app.get('/toggle', function (req, res) {
    res.render('arcgis', {
        'mapurl': 'http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
        'chapters': chapters
    });
});

app.get('/chapter/:chapter', function (req, res) {
    chapter = null;
    story = null;
    previous = null;
    next = null;

    // find the correct current, next, and previous chapters
    for (var i = 0; i < chapters.length; ++i) {
        chapter = chapters[i];

        if (chapter.slug == req.params.chapter) {
            story = chapter.stories[0];
            if (i < (chapters.length - 1)) {
                next = chapters[i+1];
            }

            break;
        }

        previous = chapter;
    }

    // see if we 404
    if (!chapter || !story) {
        res.status(404).end('Not found.')
    }

    res.render(story.type, {
        'title': story.name ? story.name : chapter.name + ' &ndash; nd@125',
        'chapter': chapter,
        'story': story,
        'next': next,
        'previous': previous,
        'chapters': chapters,
    });
});

app.get('/admin', function (req, res) {
    res.render('admin', {
        'title': 'Admin &ndash; nd@125',
        'chapters': chapters
    });
});

/*
app.post('/api/:action', function(req, res) {
    if (req.params.action === 'delete') {
        delete slug_to_story_map[chapters[parseInt(req.body.index)]];
        
        var ii = parseInt(req.body.index);
        var s = Object.keys(slug_to_story_map);
        
        for (var i = 0, n = s.length; i < n; i++) {
            if (slug_to_story_map[s[i]] > ii) slug_to_story_map[s[i]] = slug_to_story_map[s[i]] - 1;
        }
        
        chapters.splice(parseInt(req.body.index), 1);
        res.send('1');
    }
    else if (req.params.action === 'create') {
        var data = req.body.data;
        
        data.slug = data.title.toLowerCase().replace(/[^a-z ]+/g, '').replace(/ +/g, '-');
        chapters.push(data);
        slug_to_story_map[data.slug] = chapters.length-1;
    }
});
*/

app.listen(8005, '127.0.0.1');
