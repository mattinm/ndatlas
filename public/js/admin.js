$('#new_story').click(function() {
    $('#modal').modal('show');
});

$('#new_section').click(function() {
    $('#sections').append(
        '<hr></hr>'+
        '<h5 style="color:#777;font-weight:bold;margin-bottom: 3px;">Section Title</h5>'+
        '<input type="text" class="form-control"></input>'+
        '<h5 style="color:#777;font-weight:bold;margin-bottom: 3px;">Section Content</h5>'+
        '<textarea class="form-control"></textarea>'
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
    $('input,textarea').val('');
});

$('.glyphicon-remove').click(function() {
    $(this).parent().parent().remove();
    mi--;
});
