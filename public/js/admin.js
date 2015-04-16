$('#new_story').click(function() {
    $('#modal').modal('show');
});

$('#new_section').click(function() {
    $('#sections').append(
        '<hr></hr>'+
        '<h5 style="color:#777;font-weight:bold;margin-bottom: 3px;">Section Title</h5>'+
        '<input type="text" class="form-control"></input>'+
        '<h5 style="color:#777;font-weight:bold;margin-bottom: 3px;">Section Content</h5>'+
        '<textarea class="form-control section-content"></textarea>'
    );
});

$('#new_citation').click(function() {
    $('#citations').append(
        '<br>'+
        '<input type="text" class="form-control citation"></input>'
    );
});

$('#create_story').click(function() {
    $('tbody').append(
        '<tr>'+
            '<td>'+(++mi)+'</td>'+
            '<td>'+$('#story_title').val().trim()+'</td>'+
            '<td><i class="glyphicon glyphicon-eye-open"></i><i class="glyphicon glyphicon-pencil"></i><i class="glyphicon glyphicon-remove"></i></td>'+
        '</tr>'
    );
    $('#modal').modal('hide');
    
    var sections = [];
    var citations = [];
    
    var s = $('.section-content');
    
    for (var i = 0, n = s.length; i < n; i++) {console.log(s.eq(i).val());
        sections.push({
            'content': s.eq(i).val()
        });
    }
    
    var c = $('.citation');
    
    for (var i = 0, n = c.length; i < n; i++) {
        citations.push({
            'content': c.eq(i).val()
        });
    }
    
    console.log(sections);
    
    $.post('/api/create', {
        'data': {
            'title': $('#story_title').val(),
            'type': 'text',
            'sections': sections,
            'citations': citations,
            'bibliography': []
        }
    }, function(res) {
       $('input,textarea').val(''); 
    });
});

$('.glyphicon-remove').click(function() {
    var t = $(this);
    
    $.post('/api/delete', {
        'index': t.data('index')
    }, function(res) {
        t.parent().parent().remove();
        mi--;
    });
});

