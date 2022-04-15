$(".toggle").on("click", function() {
    $(".container").stop().addClass("active");
});

$(".close").on("click", function() {
    $(".container").stop().removeClass("active");
});

// test
const form = document.getElementById('form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
})