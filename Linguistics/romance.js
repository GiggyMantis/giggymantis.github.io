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
    "ꜹ" : "au",
    "á" : "ā",
    "é" : "ē",
    "í" : "ī",
    "ó" : "ō",
    "ú" : "ū",
    "ý" : "ȳ",
    "ꟾ" : "ī"
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
    "c" : "k",
    "x" : "ks"
}

const latin_thirdpass = {
    "\\b(i)([aeiouy])" : "j$2", // Replaces i with j at the beginnings of words before vowels, as in iacere [ˈja.kɛ.rɛ]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces i with jj intervocalically, as in maior [ˈmaj.jɔr],
    "\\b(u)([aeiouy])" : "w$2", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.ku.ʊs]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces u with w intervocalically, as in flāvus [ˈfɫaː.wʊs],
    "([^aeiouyː])(u)([aeiouy])" : "$1w$2", // Replaces ɡu with ɡʷ, as in pinguis [ˈpɪŋ.ɡʷɪs]
    "(n)([ɡk])" : "ŋ$2",
    "ɡn" : "ŋn"
}

function syllabify(input, vowels) = {
    const v_regex = "([" + vowels + "])"
    const c_regex = "([^" + vowels + ".])"
    return input.replace(new RegExp(v_regex + c_regex + c_regex + "\\B", "g"), "$1$2.$3").replace(new RegExp(v_regex + c_regex + v_regex, "g"), "$1.$2$3")
}


function submit(latin) {
    latin_phonetic = String(latin).toLowerCase()
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => latin_firstpass[matched]);
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_secondpass).join("|"), "g"), (matched) => latin_secondpass[matched]);
    
    Object.keys(latin_thirdpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_thirdpass[key]));
    latin_phonetic = latin_phonetic.replace("ɡw", "ɡʷ");
    latin_phonetic = syllabify(latin_phonetic, "aeiouyː");

    $("#latinphon").val(latin_phonetic);
}