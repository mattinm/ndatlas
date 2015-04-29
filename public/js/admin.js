var index;

$('.delete').click(function() {
    var t = $(this);
    
    $.post('/api/delete', {
        'index': t.data('index')
    }, function(res) {
        if (res.success) 
        
        t.parent().parent().remove();
    });
});

$('#modal').on('hidden.bs.modal', function() {
    $('#sections,#citations,#bibliography').html('');
});

$('.edit').click(function() {
    var t = $(this);
    
    index = parseInt(t.data('index'));
    
    for (var i = 0, n = chapters.length; i < n; i++) {
        if (chapters[i].index === parseInt(t.data('index'))) {
            for (var j = 0, m = chapters[i].stories[0].sections.length; j < m; j++) {
                $('#sections').append(
                    '<h5 style="color:#777;font-weight:bold;margin-bottom: 3px;">Section Content</h5>'+
                    '<textarea class="form-control section-content" style="resize: vertical" rows="6">'+chapters[i].stories[0].sections[j].content+'</textarea>'
                );
            }
            
            for (var j = 0, m = chapters[i].stories[0].citations.length; j < m; j++) {
                $('#citations').append(
                    '<br>'+
                    '<input type="text" class="form-control citation" value="'+chapters[i].stories[0].citations[j]+'"></input>'
                );
            }
            
            for (var j = 0, m = chapters[i].stories[0].bibliography.length; j < m; j++) {
                $('#bibliography').append(
                    '<br>'+
                    '<input type="text" class="form-control bibliography" value="'+chapters[i].stories[0].bibliography[j]+'"></input>'
                );
            }
            
            $('#chapter_name').val(chapters[i].name);
        
            break;
        }
    }
    
    $('#create_chapter').hide();
    $('#save_chapter').show();
    
    $('#modal').modal('show');
});

$('#save_chapter').click(function() {
    var s = $('.section-content');
    var sections = [];
    
    for (var i = 0, n = s.length; i < n; i++) {
        sections.push({'content':s.eq(i).val()});
    }
    
    var c = $('.citation');
    var citations = [];
    
    for (var i = 0, n = c.length; i < n; i++) {
        citations.push(c.eq(i).val());
    }
    
    var b = $('.bibliography');
    var bibliography = [];
    
    for (var i = 0, n = b.length; i < n; i++) {
        bibliography.push(b.eq(i).val());
    }
    
    
    $.post('/api/save', {
        'index': index,
        'name': $('#chapter_name').val(),
        'sections': sections,
        'citations': citations,
        'bibliography': bibliography
    }, function(res) {
       $('input,textarea').val(''); 
       
       $('#modal').modal('hide');
    });
});



$('#new_chapter').click(function() {
    $('#new_section').click();
    $('#new_citation').click();
    $('#new_bibliography').click();
    $('#create_chapter').show();
    $('#save_chapter').hide();
    
    $('#modal').modal('show');
});

$('#new_section').click(function() {
    $('#sections').append(
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

$('#new_bibliography').click(function() {
    $('#bibliography').append(
        '<br>'+
        '<input type="text" class="form-control bibliography"></input>'
    );
});



$('#create_chapter').click(function() {
    var s = $('.section-content');
    var sections = [];
    
    for (var i = 0, n = s.length; i < n; i++) {
        sections.push({'content':s.eq(i).val()});
    }
    
    var c = $('.citation');
    var citations = [];
    
    for (var i = 0, n = c.length; i < n; i++) {
        if (c.eq(i).val().trim().length) citations.push(c.eq(i).val());
    }
    
    var b = $('.bibliography');
    var bibliography = [];
    
    for (var i = 0, n = b.length; i < n; i++) {
        if (b.eq(i).val().trim().length) bibliography.push(b.eq(i).val());
    }
    
    
    $.post('/api/create', {
        'name': $('#chapter_name').val(),
        'sections': sections,
        'citations': citations || [],
        'bibliography': bibliography || []
    }, function(res) {
       $('input,textarea').val(''); 
       
       $('tbody').append(
        '<tr>'+
            '<td>'+res.index+'</td>'+
            '<td>'+res.name+'</td>'+
            '<td>'+
                '<button type="button" class="btn btn-default btn-xs edit" style="width: 50px" data-index="'+res.index+'">Edit</button>'+
                '<button type="button" class="btn btn-default btn-xs delete" style="width: 50px; margin-left: 10px;" data-index="'+res.index+'">Delete</button>'+
            '</td>'+
        '</tr>'
       );
       
       $('#modal').modal('hide');
    });
});

