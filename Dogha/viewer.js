
let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
// let verses = Papa.parse(fetch("Voslhemow_Resources/verses.csv"), {
//     header: true
// });

let verses1 = await fetch("Voslhemow_Resources/verses.csv").then(response => response.text())
let verses = Papa.parse(String(verses1))

console.log(verses.data)
$("#content").html($.parseHTML(htmlString))