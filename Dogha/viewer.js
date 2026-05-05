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

function formatVerse(verse, glossingTerms, concordance) {
    // TODO: make this lol
    let ret = formatInterlinearGloss(verse["Interlinear1"], verse["Interlinear2"])
    return `<li>${ret}</li>`
}

function formatInterlinearGloss(part1,part2) {
    let ret = `<div class="interlinear"><pre>${part1}</pre><pre>${part2}</pre></div>`
}

let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
const chapters = loadFileAsCSV("Voslhemow_Resources/chapters.csv").then(result => {
    result.data.forEach(element => {
        const num = element["Number"]
        htmlString += `<hgroup><h2 id="chapter-${num}">Chapter ${num}: ${element["Original"]}</h2><p class="translated-chapter">Plain Translation: ${element["Plain"]}<br>EME Translation: ${element["EME"]}<br>Literal Translation: ${element["Literal"]}</p></hgroup><ol id="list-chapter-${num}"></ol>`
    })
})
const glossingTerms = loadFileAsCSV("Voslhemow_Resources/glossing_terms.csv")
const concordance = loadFileAsCSV("Voslhemow_Resources/concordance.csv")
const verses = loadFileAsCSV("Voslhemow_Resources/verses.csv")

$(document).ready(function(){
    chapters.then((_) => {
        $("#content").html($.parseHTML(htmlString))
    })
    glossingTerms.then(glossing_result => {
        concordance.then(concordance_result => {
            verses.then(verses_result => {
                verses_result.data.forEach((element, index) => {
                    const verhtml = formatVerse(element, glossing_result.data, concordance_result.data)
                    console.log(verhtml)
                    $(`#list-chapter-${index+1}`).append($.parseHTML(verhtml))
                })
            })
        })
    })
})
