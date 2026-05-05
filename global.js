fetch("header.html")
    .then(response => response.text())
    .then(data => {
    $("#header-placeholder").html(data)
});