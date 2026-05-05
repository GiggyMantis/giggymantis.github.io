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

function formatVerse(verse, glossingTerms, highlightTerm) {
    let ret = `<li class="verse"><p><b>${verse["Chapter"]}:${verse["Number"]}</b> - ${verse["Original"]}</p><i>Plain:&Tab;${verse["Plain"]}<br>EME:&Tab;${verse["EME"]}<br>Literal:&Tab;${verse["Literal"]}</i>${formatInterlinearGloss(verse["Interlinear1"], verse["Interlinear2"], glossingTerms, highlightTerm)}</li>`
    return ret
}

function formatInterlinearGloss(part1, part2, glossingTerms, highlightTerm) {
    // Capture glossing abbreviations
    const capsRegex = /(\b[A-Z0-9]+\b)/g
    let second_line = part2.replace(capsRegex, (match, item) => {
        return `<div class="tooltip">${item}<span class="tooltiptext">${glossingTerms[0][item]}</span></div>`
    })
    let ret = `<br><div class="interlinear"><pre>${part1}</pre><pre>${second_line}</pre></div>`
    return ret.replace(highlightTerm,`<b>${highlightTerm}</b>`)
}

const glossingTerms = loadFileAsCSV("Voslhemow_Resources/glossing_terms.csv")
const verses = loadFileAsCSV("Voslhemow_Resources/verses.csv")

$(document).ready(function(){
    verses.then(verses_result => {
        glossingTerms.then(glossing_result => {
            const allHeaders = [...$(":header")]
            console.log(allHeaders)
            allHeaders.forEach(element => {
                const id = $(element).attr("id")
                const check = `[${id}]`
                verses_result.data.forEach(verse => {
                    if (verse["Lemmatized"].includes(check)) {
                        $(`#${id}-list`).append($.parseHTML(formatVerse(verse,glossing_result.data,id)))
                    }
                })
            })
        })
    })
})
