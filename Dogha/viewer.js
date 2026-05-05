async function loadFileAsString(url) {
    try {
        const response = await fetch(url)
        const text = await response.text()
        return text
    } catch (error) {
        console.error("Failed to load file:", error)
        return ""
    }
}


let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
$("#content").html($.parseHTML(htmlString))

console.log(loadFileAsString("Voslhemow_Resources/verses.csv"))

let verses = Papa.parse(loadFileAsString("Voslhemow_Resources/verses.csv"), {
    header: true
});

console.log(verses.data)
