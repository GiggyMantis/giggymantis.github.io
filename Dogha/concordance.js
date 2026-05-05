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

//TODO: Load concordances
const verses = loadFileAsCSV("Voslhemow_Resources/verses.csv")

$(document).ready(function(){
    verses.then(result => {
        const allHeaders = [...$(":header")]
        allHeaders.forEach(element => {
            const id = element.attr("id")
            const check = `[${id}]`
            result.data.forEach(verse => {
                if (verse["Lemmatized"].includes(check)) {
                    $(`#${id}`).append($.parseHTML("<p>test</p>"))
                }
            })
        })
    })
})
