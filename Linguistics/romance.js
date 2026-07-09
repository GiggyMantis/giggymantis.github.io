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

// Second pass is used to turn orthography into basic phonemic IPA
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

const latin_thirdpass = {
    "\\b(i)([aeiouy])" : "j$2", // Replaces i with j at the beginnings of words before vowels, as in iacere [ˈja.kɛ.rɛ]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces i with jj intervocalically, as in maior [ˈmaj.jɔr],
    "\\b(u)([aeiouy])" : "w$2", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.ku.ʊs]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces u with w intervocalically, as in flāvus [ˈfɫaː.wʊs],
    "(nɡu)([aeiouy])" : "ŋɡʷ$2", // Replaces nɡu with ŋɡʷ, as in pinguis [ˈpɪŋ.ɡʷɪs]
    "nɡ" : "ŋɡ",
    "ɡn" : "ŋn"
}


function submit(latin) {
    latin_phonetic = String(latin).toLowerCase()
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => latin_firstpass[matched]);
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_secondpass).join("|"), "g"), (matched) => latin_secondpass[matched]);
    
    Object.keys(latin_thirdpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key), latin_thirdpass[key]));

    $("#latinphon").val(latin_phonetic);
}