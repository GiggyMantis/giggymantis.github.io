let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
let verses = Papa.parse(fetch("Voslhemow_Resources/verses.csv"), {
    header: true
});

console.log(verses.data)
$("#content").html($.parseHTML(htmlString))