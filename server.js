var express = require('express');
var parser = require('body-parser');
var shp = require('shpjs');
var nosql = require('nosql').load(__dirname+'/database.nosql');
var app = express();
var themes = [];
var selected = [];
var order = [];

nosql.on('load', function() {
    nosql.all(function(a) {
        selected.push(a);
        return a; 
    }, function() {
        selected.forEach(function(o) {
            themes.push(o);
            order.push(o.slug);
        });
    });
});

app.use(parser());
app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));

app.locals.pretty = true;

app.get('/', function (req, res) {
    res.render('home', {
        'title': 'North Dakota Atlas',
        'theme': null,
        'previous': null,
        'next': null,
        'themes': themes
    });
});

app.get('/toggle', function (req, res) {
    //console.log(req.params.name);
    res.render('arcgis', {
        'mapurl': 'http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
        'themes': themes
    });
});

app.get('/railroads', function (req, res) {
    res.render('railroads', {
        'mapurl': '//undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer',
        'layer': '39',
        'startYears': [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2013],
        'endYears': [1929, 1939, 1949, 1959, 1969, 1979, 1989, 1999, 2009, 2012, 2013],
        'themes': themes
    });
});

//TODO: add code to load Country Churches theme here

app.get('/themes/:theme', function (req, res) {
    var theme = null;
    // find the theme and first chapter
    for (var i = 0; i < themes.length; ++i) {
        theme = themes[i];
        
        if (theme.slug == req.params.theme) {
            res.redirect('/themes/' + theme.slug + '/' + theme.chapters[0].slug);
        }
    }

    // see if we 404
    res.status(404).end('Theme not found.');
});

app.get('/themes/:theme/:chapter', function(req, res) {
    var theme = null;
    var chapter = null;
    var previousChapter = null;
    var nextChapter = null;
    var foundChapter = false;
    var previousTheme = null;
    var nextTheme = null;

    // find the theme and corresponding chapter
    for (var i = 0; i < themes.length; ++i) {
        theme = themes[i];
        

        if (theme.slug == req.params.theme) {
            for (var j = 0; !foundChapter && j < theme.chapters.length; ++j) {
                chapter = theme.chapters[j];
                
                if (chapter.slug == req.params.chapter) {
                    foundChapter = true;
                    
                    // see if we have a next chapter
                    if (j < (theme.chapters.length - 1)) {
                        nextChapter = theme.chapters[j+1];
                    }
                    
                    // done looping
                    break;
                }
                
                // keep track of our previous chapter
                previousChapter = chapter;
            }
            
            // 404 if we didn't find the chapter
            if (!foundChapter) {
                res.status(404).end('Chapter not found.');
            }
            
            // see if we have another theme
            if (i < (themes.length-1)) {
                nextTheme = themes[i+1];
            }
            
            // done looping
            break;
        }
        
        // keep track of our previous theme
        previousTheme = theme;
    }
    
    var data = {
        'theme': theme,
        'chapter': chapter,
        'title': chapter.name,
        'previousChapter': previousChapter,
        'nextChapter': nextChapter,
        'previousTheme': previousTheme,
        'nextTheme': nextTheme,
        'themes': themes
    }
    
    if (chapter.type == 'text') {
        console.log("ITS JUST TEXT");
        res.render('text', data);
    } else if (chapter.type == 'map') {
        console.log("ITS A MAP");
        // key up our start and end years array
        data['startYears'] = [];
        data['endYears'] = [];
        
        // only add things for which we have a start and end year for all objects
        for (var i = 0; i < chapter.stories.length; ++i) {
            if ('start_year' in chapter.stories[i] && 'end_year' in chapter.stories[i]) {
                data['startYears'].push(chapter.stories[i].start_year);
                data['endYears'].push(chapter.stories[i].end_year);
            } else {
                data['startYears'] = [];
                data['endYears'] = [];
                break;
            }
        }
        if (req.params.theme == 'railroads') {
            res.render('railroads', data);
        } else {
            res.render('map', data);
          }
    } else {
        res.status(404).end('Unknown chapter type.');
    }
});

/**
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
**/

app.listen(process.env.PORT || 8005, process.env.IP || '');
