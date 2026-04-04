fetch('header.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
});
fetch('Yukatati/header.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('yukatati-header-placeholder').innerHTML = data;
});