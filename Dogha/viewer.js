fetch("header.html")
    .then(response => response.text())
    .then(data => {
    $("#content").html(data)
});

$("#content").html("test")

fetch("header.html")
    .then(response => response.text())
    .then(data => {
    console.log(data)
});