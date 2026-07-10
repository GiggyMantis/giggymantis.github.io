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

// Before syllabification
const latin_thirdpass = {
    "\\b(i)([aeiouy])" : "j$2", // Replaces i with j at the beginnings of words before vowels, as in iacere [ˈja.kɛ.rɛ]
    "(-i)([aeiouy])" : "-j$2", // Replaces i with j at the beginnings of morphemes before vowels, as in adiaceō [adˈja.ke.oː]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces i with jj intervocalically, as in maior [ˈmaj.jɔr],
    "\\b(u)([aeiouy])" : "w$2", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.ku.ʊs]
    "([aeiouyː]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w intervocalically, as in flāvus [ˈfɫaː.wʊs],
    "([ɡstdnr]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w after a coronal or velar consonant.
    "(n)(-?[ɡk])" : "ŋ$2",
    "ɡ(-?n)" : "ŋ$2",
    "(a)([eu])" : "$1$2̯",
    "(e)([iu])" : "$1$2̯",
    "(o)(e)" : "$1$2̯",
    "(u)(i)" : "$1$2̯",
}

// After syllabification
const latin_fourthpass = {
    "(l)(-?[aeou])" : "ɫ$2",
    "(l)(-?[\\b\\.])" : "ɫ$2",
    "(ː[nm])(?=[.s\\b])" : "̃ː",
    "([aeiouy])([nm])(?=[.s\\b])" : "$1̃",
}

function syllabify(input, vowels) {
    const v_regex = "([" + vowels + "ː])";
    const c_regex = "([^" + vowels + ".ː])";
    return input.replace(new RegExp(v_regex + c_regex + c_regex + "\\B", "g"), "$1$2.$3").replace(new RegExp(v_regex + "(?=[^" + vowels + "][" + vowels + "])", "g"), "$1.").replace(new RegExp(v_regex + "([" + vowels + "])(?!̯)", "g"), "$1.$2");
}

function latinate_stress(input) {
    ret = input;
    if (input.split(".").length - 1 <= 1) {
        // One or two syllables, stress the primary
        ret = "ˈ" + input;
    } else {
        if (new RegExp("[^aeoiuy]\\.(?!.*\\.)").test(input)) {
            // Penult is heavy, stress the penult
            ret = ("." + input).replace(new RegExp("(\\.)(?!.*\\..*\\.)"), "ˈ$1");
        } else {
            // Penult is liteweit, stress the antepenult
            ret = ("." + input).replace(new RegExp("(\\.)(?!.*\\..*\\..*\\.)"), "ˈ$1");
        }
    }

    ret.replace("ˈ.", ".ˈ");
    if (ret.startsWith(".")) {
        return ret.substring(1);
    }
    return ret;
}


function submit(latin) {
    latin_phonetic = String(latin).toLowerCase().replace(new RegExp("\\s", "g"), "");
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => latin_firstpass[matched]);
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_secondpass).join("|"), "g"), (matched) => latin_secondpass[matched]);
    
    Object.keys(latin_thirdpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_thirdpass[key]));
    latin_phonetic = latin_phonetic.replace("ɡw", "ɡʷ");
    latin_phonetic = syllabify(latin_phonetic, "aeiouy");
    Object.keys(latin_fourthpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_fourthpass[key]));

    latin_phonetic = latinate_stress(latin_phonetic);

    $("#latinphon").val(latin_phonetic);
}