/*js for maps page, just in case*/
$(document).ready(function() {
	$('#a_1890').on('hover', function() {
		$('#map').attr('src', 'images/1890.png');
	});
	$('#a_1990').on('hover', function() {
		$('#map').attr('src', 'images/1990.png');
	});
	$('#a_1930').on('hover', function() {
		$('#map').attr('src', 'images/1930.png');
	});

    if (window.location == window.parent.location) {
        $('#fullscreen').html('<span class="glyphicon glyphicon-resize-small"></span>');
        $('#fullscreen').attr('href', 'http://bootsnipp.com/mouse0270/snippets/PbDb5');
        $('#fullscreen').attr('title', 'Back To Bootsnipp');
    }    
    $('#fullscreen').on('click', function(event) {
        event.preventDefault();
        window.parent.location =  $('#fullscreen').attr('href');
    });
    $('#fullscreen').tooltip();
    /* END DEMO OF JS */
    
    $('.navbar-toggler').on('click', function(event) {
		event.preventDefault();
		$(this).closest('.navbar-minimal').toggleClass('open');
	})
	
});
