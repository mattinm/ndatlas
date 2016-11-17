var express = require('express');
var parser = require('body-parser');
var app = express();

// initiate the server
app.use(parser());
app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.locals.pretty = true;

//////////////////////////////////////
// START OF ROUTES
//////////////////////////////////////

app.get('/', function (req, res) {
    res.render('welcome', {
        'title': 'North Dakota Atlas',
        'active': 'welcome'
    });
});

app.get('/churches', function (req, res) {
    res.render('country_churches', {
        'title': 'North Dakota Atlas | Country Churches',
        'active': 'churches'
    });
});

app.get('/students', function (req, res) {
    res.render('students', {
        'title': 'North Dakota Atlas | Students',
        'active': 'students'
    });
});

//////////////////////////////////////
// END OF ROUTES
//////////////////////////////////////

// start the server
app.listen(process.env.PORT || 8005, process.env.IP || '');
