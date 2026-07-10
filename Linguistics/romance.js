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
    "\\b(u)([aeiouy])" : "w$2", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.kʊ.ʊs]
    "([aeiouyː]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w intervocalically, as in flāvus [ˈfɫaː.wʊs],
    "([ɡstdnr]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w after a coronal or velar consonant.
    "(nm)(-?[ɡkw])" : "ŋ$2", // Nasal assimilation
    "m(-?[nsztdrl])" : "n$2", // ″
    "n(-?[mpbf])" : "m$2", // ″
    "ɡ(-?n)" : "ŋ$2", // ″
    "(a)([eu])(?!ː)" : "$1$2̯", // Diphthongs
    "(e)([iu])(?!ː)" : "$1$2̯", // ″
    "(o)(e)(?!ː)" : "$1$2̯", // ″
    "(u)(i)(?!ː)" : "$1$2̯", // ″
}

// After syllabification
const latin_fourthpass = {
    "(l)(?=-?[aeou])" : "ɫ", // L-darkening
    "(l)$" : "ɫ", // ″
    "(l)\\.[^lɫ]" : "ɫ", // ″
    "l.ɫ" : "l.l", // ″
    "(ː[nm])(s)" : "̃ːs", // Nasalization
    "([aeiouy])([nm])s" : "$1̃s", // ″
    "(ː[nm])$" : "̃ː", // ″
    "([aeiouy])([nm])$" : "$1̃", // ″
    "e(?!ː)" : "ɛ", // Vowel reduction
    "o(?!ː)" : "ɔ", // ″
    "i(?!ː)" : "ɪ", // ″
    "u(?!ː)" : "ʊ", // ″
    "y(?!ː)" : "ʏ", // ″
    "-" : ".",
    "\\.\\." : ".",
}

function syllabify(input, vowels) {
    const v_regex = "([" + vowels + "][ː̯]?)"
    const v_regex_exclusive = "(?=[" + vowels + "])(?!.̯)"
    const c_regex_unwrapped = "[^" + vowels + "\\.ː̯ʰ]ʰ?";
    const c_regex = "(" + c_regex_unwrapped + ")"
    return input.replace(new RegExp(v_regex + "([pbtdkɡ]ʰ?)([lr])(?=.)", "g"), "$1.$2$3").replace(new RegExp(v_regex + c_regex + c_regex + "(?=.)", "g"), "$1$2.$3").replace(new RegExp(v_regex + "(?=" + c_regex_unwrapped + "[" + vowels + "])", "g"), "$1.").replace(new RegExp(v_regex + v_regex_exclusive + "(?!̯)", "g"), "$1.");
}

function latinate_stress(input) {
    ret = input;
    if (input.split(".").length - 1 <= 1) {
        // One or two syllables, stress the primary
        ret = "ˈ" + input;
    } else {
        if (new RegExp("[^aeoiuyɛɔɪʊʏ]\\.(?!.*\\.)").test(input)) {
            // Penult is heavy, stress the penult
            ret = ("." + input).replace(new RegExp("(\\.)(?!.*\\..*\\.)"), "ˈ$1");
            console.log("heavy penult");
        } else {
            // Penult is liteweit, stress the antepenult
            ret = ("." + input).replace(new RegExp("(\\.)(?!.*\\..*\\..*\\.)"), "ˈ$1");
        }
    }

    ret = ret.replace("ˈ.", ".ˈ");
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
    latin_phonetic = syllabify(latin_phonetic, "aeoiuyɛɔɪʊʏ");
    Object.keys(latin_fourthpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_fourthpass[key]));

    latin_phonetic = latinate_stress(latin_phonetic);

    $("#latinphon").val(latin_phonetic);
}