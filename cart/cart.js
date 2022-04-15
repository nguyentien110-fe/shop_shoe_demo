// Remove Items From Cart
$("a.remove").click(function(e) {
    e.preventDefault();
    $(this).parent().parent().parent().hide(400);
});

// Just for testing, show all items
$("a.btn.continue").click(function() {
    $("li.items").show(100);
});