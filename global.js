fetch('header.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
});

fetch('Dogha/header.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('dogha-header-placeholder').innerHTML = data;
});