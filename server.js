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

app.locals.pretty = true;

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
        'chapters': chapters,
        'safe': JSON.stringify(chapters)
    });
});

app.post('/api/:action', function(req, res) {
    if (req.params.action === 'delete') {
        var deleted = false;
        
        for (var i = 0, n = chapters.length; i < n; i++) {
            if (chapters[i].index === parseInt(req.body.index)) {
                chapters.splice(i, 1);
                deleted = true;
                break;
            }
        }
        
        res.json({'success': deleted});
    }
    else if (req.params.action === 'save') {
        for (var i = 0, n = chapters.length; i < n; i++) {
            if (chapters[i].index === parseInt(req.body.index)) {
                chapters[i].name = req.body.name,
                chapters[i].stories[0].sections = req.body.sections;
                chapters[i].stories[0].citations = req.body.citations || [];
                chapters[i].stories[0].bibliography = req.body.bibliography || [];
                
                res.send('asd');
                
                break;
            }
        }
    }
    else if (req.params.action === 'create') {
        var index = -1;
        
        for (var i = 0, n = chapters.length; i < n; i++) {
            if (chapters[i].index > index) index = chapters[i].index;
        }
        
        index++;
        
        chapters.push({
            'slug': req.body.name.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/ +/g, '-'),
            'name': req.body.name,
            'blurb': 'Default blurb text.',
            'stories': [{
                'type': 'text',
                'citations': req.body.citations || [],
                'bibliography': req.body.bibliography || [],
                'sections': req.body.sections || []
            }],
            'index': index
        });
        
        res.json({
            'index': index,
            'name': req.body.name
        });
    }
});

app.listen(8005, '127.0.0.1');

