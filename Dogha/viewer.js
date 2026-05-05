fetch("header.html")
    .then(response => response.text())
    .then(data => {
    $("#content").html(data)
});

fetch("header.html")
    .then(response => response.text())
    .then(data => {
    console.log(data)
});