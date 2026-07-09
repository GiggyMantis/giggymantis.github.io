// First pass is used to standardize Latin input orthography
const latin_firstpass = {
    "ă" : "a",
    "ĕ" : "e",
    "ĭ" : "i",
    "ŏ" : "o",
    "ŭ" : "u",
    "y̆" : "y",
    "j" : "i",
    "v" : "u",
    "æ" : "ae",
    "œ" : "oe",
    "ꜷ" : "au",
    "ꜹ" : "au"
}

// Second pass is used to turn orthography into basic phonetic IPA
const latin_secondpass = {
    "ph" : "pʰ",
    "th" : "tʰ",
    "ch" : "kʰ",
    "qu" : "kʷ",
    "g" : "ɡ",
    "ā" : "aː",
    "ē" : "eː",
    "ī" : "iː",
    "ō" : "oː",
    "ū" : "uː",
    "ȳ" : "yː",
    "c" : "k"
}


function submit(latin) {
    result = (String)latin.toLowerCase()
    result = result.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => replacements[matched]);
    result = result.replace(new RegExp(Object.keys(latin_secondpass).join("|"), "g"), (matched) => replacements[matched]);

    window.alert((String)latin + "   " + result)
}