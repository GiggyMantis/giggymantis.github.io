fetch("header.html")
    .then(response => response.text())
    .then(data => {
    $("#content").html($.parseHTML("<p>test</p>"))
});

fetch("header.html")
    .then(response => response.text())
    .then(data => {
    console.log(data)
});