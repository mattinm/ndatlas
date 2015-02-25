/**
 * This script creates our database.
 *
 * @author Marshall Mattingly
 */
var nosql = require('nosql').load(__dirname+'/database.nosql');

nosql.on('load', function() {
    nosql.insert(
    [{
        'title': 'The Cat in the Hat',
        'type': 'text',
        'content': 'The sun did not shine. It was too wet to play. So we sat in the house all that cold, cold, wet day. I sat there with sally. We sat there, we two. And I said, \'how I wish we had something to do!\' Too wet to go out and too cold to play ball. So we sat in the house. We did nothing at all.'
    },
    {
        'title': 'Green Eggs and Ham',
        'type': 'map',
        'content': 'I do not like them in a house. I do not like them with a mouse. I do not like them here or there. I do not like them anywhere. I do not like green eggs and ham. I do not like them, Sam-I-Am.'
    },
    {
        'title': 'Oh, the Places You\'ll Go',
        'type': 'text',
        'content': 'You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. You\'re on your own. And you know what you know. And YOU are the one who\'ll decide where to go...'
    }]);
});
