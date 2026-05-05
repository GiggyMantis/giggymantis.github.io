
let htmlString = "<h1>Voslhemow Interlinear Text Viewer</h1>"
// let verses = Papa.parse(fetch("Voslhemow_Resources/verses.csv"), {
//     header: true
// });

let verses1 = String(fetch("Voslhemow_Resources/verses.csv").then(response => response.text()))
console.log(typeof(verses1))
fs.readFileSync("Voslhemow_Resources/verses.csv", 'utf8')

let verses = Papa.parse("Chapter,Plain Classical Tyhocopadian,Lemmatized Classical Tyhocopadian,Interlinear Gloss Part 1,Interlinear Gloss Part 2,Saffjahim Transcription,Plain Translation,KJV-Style Translation,Literal Translation\r\n1,\"ʾasata jo haj heʾejhehja maʾejn, myȝy lwañ tojē haj, lwañ hōhjačowpazy heny.\",\"[ʾa] [jo] [haj] [heʾejhehja] [maʾejn] [myȝy] [lwañ] [tojē] [haj] [lwañ] [hehja] [heny]\",\"ʾa-sata jo  haj heʾej-hehja  maʾejn , myȝy lwañ tojē  haj , lwañ h<ō>hja -čow -pazy    heny    .\",\"be-PASS all of    AGT-birthe Ma'ein , soul and  earth of  , and  birthe\\R-REFL-REM.PRET 3SG.NOM .\",\"ʾasata jo haj heʾejhehja maʾejn, miŋi lwaŋ tojee haj, lwaŋ hoohjatšowpasi̬ heni.\",\"Ma'ein is the progenitor of all, the material and the spiritual, and is his own creator.\",\"Ma'ein is the Father of All, of the Soul and the Soil, and He hath borne Himself.\",\"Ma'ein is the progenitor of all, soul and earth, and he birthed himself.\"")

console.log(verses.data)
$("#content").html($.parseHTML(htmlString))