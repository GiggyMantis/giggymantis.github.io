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
        let content = "<ol>"
        result.data.forEach(element => {
            content += `<li><h1 id="${element["Lemma"]}">${element["Lemma"]}</h1><p><i>${element["PoS"]}</i> - ${element["Meaning"]}</p></li>`
        })
        content += "</ol>"
        $("#content").append($.parseHTML(content))
    })
})
