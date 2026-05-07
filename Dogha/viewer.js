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

function formatVerse(verse, glossingTerms) {
    let ret = `<li class="verse"><p>${createLinkedVerse(verse)}</p><i>Plain:&Tab;${verse["Plain"]}<br>EME:&Tab;${verse["EME"]}<br>Literal:&Tab;${verse["Literal"]}</i>${formatInterlinearGloss(verse["Interlinear1"], verse["Interlinear2"], glossingTerms)}</li>`
    return ret
}

function createLinkedVerse(verse) {
    const list = verse["Original"].split(' ')
    let lemmalist = verse["Lemmatized"].split(' ')
    lemmalist.forEach((element, index) => {
        lemmalist[index] = `#${element}`
    })
    let ret = ""
    list.forEach((element, index) => {
        ret += `<a class="no-blue" href="concordance${lemmalist[index]}">${element}</a> `
    })
    return ret
}

function formatInterlinearGloss(part1, part2, glossingTerms) {
    // Capture glossing abbreviations
    const capsRegex = /(\b[A-Z0-9]+\b)/g
    let second_line = part2.replace(capsRegex, (match, item) => {
        return `<div class="tooltip">${item}<span class="tooltiptext">${glossingTerms[0][item]}</span></div>`
    })
    let ret = `<br><div class="interlinear"><pre>${part1}</pre><pre>${second_line}</pre></div>`
    return ret
}

let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
const chapters = loadFileAsCSV("Voslhemow_Resources/chapters.csv").then(result => {
    result.data.forEach(element => {
        const num = element["Number"]
        htmlString += `<hgroup><h2 id="chapter-${num}" class="swowra">Chapter ${num}: ${element["Original"]}</h2><p class="translated-chapter">Plain:&Tab;${element["Plain"]}<br>EME:&Tab;${element["EME"]}<br>Literal:&Tab;${element["Literal"]}</p></hgroup><ol id="list-chapter-${num}"></ol>`
    })
})
const glossingTerms = loadFileAsCSV("Voslhemow_Resources/glossing_terms.csv")
const verses = loadFileAsCSV("Voslhemow_Resources/verses.csv")

$(document).ready(function(){
    chapters.then((_) => {
        $("#content").html($.parseHTML(htmlString))
    })
    glossingTerms.then(glossing_result => {
        verses.then(verses_result => {
            verses_result.data.forEach(element => {
                const verhtml = formatVerse(element, glossing_result.data)
                $(`#list-chapter-${element["Chapter"]}`).append($.parseHTML(verhtml))
            })
            $("#load-warning").hide()
        })
    })
})
