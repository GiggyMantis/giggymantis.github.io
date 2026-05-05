async function loadFileAsCSV(url) {
    try {
        const response = await fetch(url)
        const text = await response.text()
        const parsed = await Papa.parse(String(text), {
            header: true
        })
        return parsed
    } catch (error) {
        console.error("Failed to load file:", error)
        return null
    }
}

let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"

console.log(loadFileAsCSV("Voslhemow_Resources/verses.csv"))

$(document).ready(function(){

    $("#content").html($.parseHTML(htmlString))

});

