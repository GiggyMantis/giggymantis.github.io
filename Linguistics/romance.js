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
    "^(i)([aeiouy])" : "j$2", // Replaces i with j at the beginnings of words before vowels, as in iacere [ˈja.kɛ.rɛ]
    "(-i)([aeiouy])" : "-j$2", // Replaces i with j at the beginnings of morphemes before vowels, as in adiaceō [adˈja.ke.oː]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces i with jj intervocalically, as in maior [ˈmaj.jɔr],
    "^(u)([aeiouy])" : "w$2", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.kʊ.ʊs]
    "([aeiouyː]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w intervocalically, as in flāvus [ˈfɫaː.wʊs],
    // "([stdnr]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w after a coronal consonant.
    "(ng)(u)(?=[aeiouy])" : "ngʷ", // gʷ
    "(nm)(-?[gkw])" : "ŋ$2", // Nasal assimilation
    "m(-?[sztdrl])" : "n$1", // ″
    "n(-?[pbf])" : "m$1", // ″
    "g(-?n)" : "ŋ$1", // ″
    "(a)([eu])(?!ː)" : "$1$2̯", // Diphthongs
    "(e)([iu])(?!ː)" : "$1$2̯", // ″
    "(o)(e)(?!ː)" : "$1$2̯", // ″
    "(u)(i)(?!ː)" : "$1$2̯", // ″
}

// After syllabification
const latin_fourthpass = {
    "(l)(?=-?[aeou])" : "ɫ", // L-darkening
    "(l)$" : "ɫ", // ″
    "(l)\\.(?=[^lɫ])" : "ɫ", // ″
    "l.ɫ" : "l.l", // ″
    "(ː[nm])(\\.)(s)" : "̃ː$2s", // Nasalization
    "([aeiouy])([nm])\\.ː?s" : "$1̃ː.s", // ″
    "(ː[nm])$" : "̃ː", // ″
    "([aeiouy])([nm])$" : "$1̃ː", // ″
    "e(?!̃?[ː̯])" : "ɛ", // Vowel reduction
    "o(?!̃?[ː̯])" : "ɔ", // ″
    "i(?!̃?[ː̯])" : "ɪ", // ″
    "u(?!̃?[ː̯])" : "ʊ", // ″
    "y(?!̃?[ː̯])" : "ʏ", // ″
    "ɛ(?=.̯)" : "e", // Vowel unreduction in diphthongs (I'm too lazy to figure out how to incorporate this into the initial regices)
    "ɔ(?=.̯)" : "o", // ″
    "ɪ(?=.̯)" : "i", // ″
    "ʊ(?=.̯)" : "u", // ″
    "ʏ(?=.̯)" : "y", // ″
    "(?<=[aeoiuɛɔɪʊyʏː̯̃])-(?=[aeoiuɛɔɪʊyʏː̯̃])" : ".",
    "(?<=[aeoiuɛɔɪʊyʏː̯̃][^aeoiuɛɔɪʊyʏː̯̃])-(?=[^aeoiuɛɔɪʊyʏː̯̃])" : ".",
    "-" : "",
    "\\.\\." : ".",
    "g" : "ɡ",
}

// First pass evolving to Proto-Romance phonetically
const pr_firstpass = {
    "ɫ" : "l", // l-ɫ distinction is mostly dropped
    "y" : "i", // Iotification
    "ʏ" : "ɪ",
    "(?<=[aeoiuɛɔɪʊː̯̃])\\.([^aeoiuɛɔɪʊː̯̃])w" : "$1.w",
    "(?<![stdnrkɡ]\\.?)w" : "β", // Fricatization of w
    "([aeoiuɛɔɪʊ][ː̯]?\\.?)(b)(?=[aeoiuyɛɔɪʊʏ])" : "$1β", // Intervocalic fricatization of b
    "ae̯" : "ɛː", // Diphthong collapse
    "oe̯" : "eː",
    "ui̯" : "u.i",
    "ei̯" : "iː",
    "eu̯" : "ɛː",
    "ʷ(?=[aeiɛɪː̯̃])" : "w", // Loss of ʷ not before a front vowel
    "ʷ" : "",
    "aː?\\.(ˈ?)haː?" : "$1aː", // h loss
    "[eɛ]ː?\\.(ˈ?)h[eɛ]ː?" : "$1eː",
    "[oɔ]ː?\\.(ˈ?)h[oɔ]ː?" : "$1oː",
    "[iɪ]ː?\\.(ˈ?)h[iɪ]ː?" : "$1iː",
    "[uʊ]ː?\\.(ˈ?)h[uʊ]ː?" : "$1uː",
    "([^aeoiuɛɔɪʊː̯̃])\\.(ˈ?)h" : ".$2$1",
    "h" : "",
    "ː" : "", // Vowel length loss
    "(?<!ˈ[^\\.]*)ɛ" : "e", // Unstressed e-ɛ merger
    "(?<!ˈ[^\\.]*)ɔ" : "o", // Unstressed o-ɔ merger
    "(?<=\\..*)̃" : "", // Nasal loss
    "̃(?=.*\\.)" : "",
    "̃" : "n", // Nasal comeback in monosyllables
    "[iɪ]\\.[iɪ]" : "i", // i-i assimilation
    "([^\\.])[iɪ]\\.ˈ[iɪ]" : "ˈ$1i",
    "[iɪ]\\.ˈ[iɪ]" : "ˈi",
    "(ˈ)([^\\.]*)(\\.)(?=.*[ptkbdɡ]\\.?[lr])" : ".$2ˈ", // Stop-Liquid consonant clusters pull stress forward one syllable, as in integram -> *įntę́gra
    "([aeoiuɛɔɪʊ])ˈ" : "$1.ˈ",
    "^\\." : "",
    "([aeoiu̯ɛɔɪʊ])\\.β(?=[uʊoɔ])" : "$1.", // loss of β next to rounded vowels
    "([u̯ʊoɔ])\\.β(?=[aeoiuɛɔɪʊ])" : "$1.",
    "u̯\\.(?=[aeoiuɛɔɪʊ])" : ".w", // semivocalization in unstressed hiatus (and change of notation of /au̯/)
    "u̯" : "w",
    "\\.\\." : "\\.",
    "w" : "W", // temporary notation shift to avoid deletion of preexisting w in geminate locations
    "(?<!ˈ[^aeoiuɛɔɪʊ]{0,2})[eɛiɪ]\\.(ˈ?)(?=[aeoiuɛɔɪʊ])" : ".$1j",
    "(?<!ˈ[^aeoiuɛɔɪʊ]{0,2})[oɔuʊ]\\.(ˈ?)(?=[aeoiuɛɔɪʊ])" : ".$1w",
    // "\\.\\." : ".",
    // "(?<=ˈ[^aeoiuɛɔɪʊ]{0,2})[eɛiɪ]\\.(?=[aeoiuɛɔɪʊ].*\\.)" : "j", // semivocalization in antepenultimate stressed hiatus with front vowels
    // "ˈ([^aeoiuɛɔɪʊ]{0,2})[oɔuʊ]\\.(?=[aeoiuɛɔɪʊ].*\\.)" : "ϝ$1w", // semivocalization in antepenultimate stressed hiatus with back vowels (here using ϝ to mark that the stress needs to be moved one syllable back)
    // "\\.([^\\.ϝ]*)\\.ϝ" : ".ˈ$1.",
    // "^([^\\.ϝ]*)\\.ϝ" : "ˈ$1.",
    // "\\.([^aeoiuɛɔɪʊ])\\." : "$1.",
    // "([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])\\.([^aeoiuɛɔɪʊ])" : "$1.$2$3",
    // "(?<![^aeoiuɛɔɪʊ])\\.ˈ([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])" : "$1.ˈ$2",
    // "([^aeoiuɛɔɪʊ])\\.(ˈ?)jɛ" : ".$2$1e",
    // "([^aeoiuɛɔɪʊ])\\.(ˈ?)wɔ" : ".$2$1o",
    // "w(?=[oɔuʊ].*ˈ)" : "", // w deletion before unstressed back vowels
    // "(?<!ˈ[^\\.]*)w(?=[oɔuʊ])" : "",
    // "(?<=[aeoiuɛɔɪʊ])\\.([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])" : "$1.$2",
    // "([^aeoiuɛɔɪʊ])\\.(ˈ?)\\1w" : "$1.$2$1", // w deletion after geminates
    // "W" : "w", // undoes earlier temporary notation shift,
    // "ɡ(?=\\.?m)" : "w", // gm -> wm
    // "ʊ(?=\\.ˈ?[ɪij])" : "u", // raising of u before i/j
    // "\\.ks" : ".s", // ks -> s before or after a consonant, or at the end of multisyllabic words
    // "k\\.s(?=[^aeoiuɛɔɪʊ])" : "s.",
    // "(?<=\\..*)ks$" : "s",
    // "(?<=[^aeoiuɛɔɪʊ\\.])ks$" : "s",
    // "^s(?=[^aeoiuɛɔɪʊ])" : "ɪs.", // sC epenthesis
    // "^ˈs(?=[^aeoiuɛɔɪʊ])" : "ɪs.ˈ",
    // "e(?=s\\.tj)" : "i", // raising of e, o before stj
    // "o(?=s\\.tj)" : "u",
    // "([aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ]+)$" : "$1$2.$3e", // monosyllablic words ending in a consonant get epenthetic -e
    // "([aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])$" : "$1.$2e",
    // "ˈ\\." : ".ˈ", // I am actually so confused as to what the cause of this is but this band-aid fix should work for now 
    // "(?<=^[^\\.]*\\.[^\\.]*)i(?=[^\\.]*\\.ˈ[^\\.]*\\.)" : "ɪ", // In the second syllable of words with the structure [ˌσσˈσσ], /i/ and /u/ merge into /ɪ/ and /ʊ/ respectively.
    // "(?<=^[^\\.]*\\.[^\\.]*)u(?=[^\\.]*\\.ˈ[^\\.]*\\.)" : "ʊ",
    // "(?<=[aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊw])\\.(ˈ?)j" : ".$2$1ʲ", // palatalization
    // "(?<=[aeoiuɛɔɪʊ][^aeoiuɛɔɪʊw])\\.(ˈ?)([^aeoiuɛɔɪʊw])j" : ".$2$1ʲ",
    // "([kɡ])(?=[iɪeɛ])" : "$1ʲ"
}

function syllabify(input, vowels) {
    const v_regex = "([" + vowels + "][ː̯]?)"
    const v_regex_exclusive = "(?=[" + vowels + "])(?!.̯)"
    const c_regex_unwrapped = "[^" + vowels + "\\.ː̯ʰʷ][ʷʰ]?";
    const c_regex = "(" + c_regex_unwrapped + ")"
    return input.replace(new RegExp(v_regex + "([pbtdkg]ʰ?)([lr])(?=.)", "g"), "$1.$2$3").replace(new RegExp(v_regex + c_regex + c_regex + "(?=.)", "g"), "$1$2.$3").replace(new RegExp(v_regex + "(?=" + c_regex_unwrapped + "[" + vowels + "])", "g"), "$1.").replace(new RegExp(v_regex + v_regex_exclusive + "(?!̯)", "g"), "$1.");
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
    // Phoneticize Latin
    latin_phonetic = String(latin).toLowerCase().replace(new RegExp("\\s", "g"), "");
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => latin_firstpass[matched]);
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_secondpass).join("|"), "g"), (matched) => latin_secondpass[matched]);
    
    Object.keys(latin_thirdpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_thirdpass[key]));
    latin_phonetic = syllabify(latin_phonetic, "aeoiuyɛɔɪʊʏ");
    Object.keys(latin_fourthpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_fourthpass[key]));

    latin_phonetic = latinate_stress(latin_phonetic);

    // Evolve to Proto-Romance
    proto_romance_phonetic = latin_phonetic;
    proto_romance = latin;

    Object.keys(pr_firstpass).forEach((key) => proto_romance_phonetic = proto_romance_phonetic.replace(new RegExp(key, "g"), pr_firstpass[key]));

    $("#latinphon").val(latin_phonetic);
    $("#pr").val(proto_romance);
    $("#prphon").val(proto_romance_phonetic);
}