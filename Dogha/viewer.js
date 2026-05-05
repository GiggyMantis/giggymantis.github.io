let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
let verses = $.csv.toObjects(fetch("Voslhemow_Resources/verses.csv").then(response => response.text()))

console.log(verses)
$("#content").html($.parseHTML(htmlString))