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
const chapters = loadFileAsCSV("Voslhemow_Resources/chapters.csv").then(result => {
    result.data.forEach(element => {
        htmlString += "\n<hgroup>\n\t<h2>Chapter " + element["Number"] + ": " + element["Original"] + "</h2><br>\t<p class=\"translated-chapter\">" + element["Plain"] + "<br>" + element["KJV"] + "<br>" + element["Literal"] + "</p>\n</hgroup>"
    })
})

$(document).ready(function(){
    chapters.then(result => {
        $("#content").html($.parseHTML(htmlString))
    })
})
