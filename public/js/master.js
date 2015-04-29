$('.disabled').click(function() {
    return false;
});

// make it so all local anchors scroll
$(document).ready(function() {
	$("a[href^=#]").click(function(e) {
		e.preventDefault();
		var dest = $(this).attr('href');
		console.log(dest);
		$('html,body').animate({
			scrollTop: $(dest).offset().top
		}, 'slow');
	});
});