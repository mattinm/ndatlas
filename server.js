var express = require('express');
var parser = require('body-parser');
var app = express();

// initiate the server
app.use(parser());
app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.locals.pretty = true;

// see if we are using the dev route
var url = require('url');
var dev = process.env.NDATLASDEV || 0;
if (dev) {
    dev = '/dev/';
} else {
    dev = '/';
}

app.use(dev, express.static(__dirname+'/public'));

//////////////////////////////////////
// START OF ROUTES
//////////////////////////////////////

app.get('/', function (req, res) {
    res.render('landing', {
        'title': 'North Dakota Atlas',
        'active': 'landing',
        'urlbase': dev,
        'url': url
    });
});

app.get('/welcome', function (req, res) {
    res.render('welcome', {
        'title': 'North Dakota Atlas | Welcome',
        'active': 'welcome',
        'urlbase': dev,
        'url': url
    });
});

app.get('/churches', function (req, res) {
    res.render('country_churches', {
        'title': 'North Dakota Atlas | Country Churches',
        'active': 'churches',
        'urlbase': dev,
        'url': url
    });
});

app.get('/students', function (req, res) {
    res.render('students', {
        'title': 'North Dakota Atlas | Students',
        'active': 'students',
        'urlbase': dev,
        'url': url
    });
});

app.get('/development', function (req, res) {
    res.render('development', {
        'title': 'North Dakota Atlas | Development',
        'active': 'development',
        'urlbase': dev,
        'url': url
    });
});

app.get('/population', function (req, res) {
    res.render('population', {
        'title': 'North Dakota Atlas | Population Map',
        'active': 'population',
        'urlbase': dev,
        'url': url
    });
});

//////////////////////////////////////
// END OF ROUTES
//////////////////////////////////////

// start the server
app.listen(process.env.PORT || 8005, process.env.IP || '');
