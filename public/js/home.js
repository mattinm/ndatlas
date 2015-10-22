$(".hideshowDIV").each(function(i, obj) {
    $(this).hide();
});

$('.hideshow').click(function(event) {
    // Change + to - on every link
    $(".hideshow").each(function() {
        $(this).text("+");
    });
    
    // Hide/show selected semester
    var semesterDIV = $("#" + $(this).closest("h2").attr("class"));
    if(semesterDIV.is(":visible")) {
        semesterDIV.hide();
        $(this).text("+");
    } else {
        semesterDIV.show();
        $(this).text("-");
    }
    
    // Hide other semesters
    $(".hideshowDIV").each(function() {
       if ($(this).attr("id") != semesterDIV.attr("id")) {
           $(this).hide();
       }
    });
    
    // Scroll to semester clicked on to prevent the page from hitting the bottom of the screen
    //$('html, body').animate({
    //    scrollTop: $(semesterDIV).offset().top - 100
    //});
});