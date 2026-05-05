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


const concordance = loadFileAsCSV("Voslhemow_Resources/concordance.csv")
$(document).ready(function(){
    concordance.then(result => {
        let content = "<p>WIP WIP WIP WIP</p>"
        $("#content").append($.parseHTML(content))
    })
})
