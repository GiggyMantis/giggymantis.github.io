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
    "^i([aeiouy])" : "j$1", // Replaces i with j at the beginnings of words before vowels, as in iacere [ˈja.kɛ.rɛ]
    "(?<=-)i([aeiouy])" : "j$1", // Replaces i with j at the beginnings of morphemes before vowels, as in adiaceō [adˈja.ke.oː]
    "(?<=-)u([aeiouy])" : "w$1", // Replaces u with w when requested by user using -, as in serviēns [ˈsɛr.wi.ẽːs]
    "([aeiouyː])(i)([aeiouy])" : "$1jj$3", // Replaces i with jj intervocalically, as in maior [ˈmaj.jɔr],
    "^u([aeiouy])" : "w$1", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.kʊ.ʊs]
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
    "(l)\\.(?=[^lɫ])" : "ɫ.", // ″
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

// eboracum -> joracu somehow

const optional_early_monophthongs = {
    "au̯" : "oː",
    "[ao]e̯" : "eː"
}

// First pass evolving to Proto-Romance phonetically
const pr_firstpass = {
    "pʰ" : "f", // aspirate collapse
    "tʰ" : "t",
    "kʰ" : "k", 
    "ɫ" : "l", // l-ɫ distinction is mostly dropped
    "y" : "i", // Iotification
    "ʏ" : "ɪ",
    "(?<=[aeoiuɛɔɪʊː̯̃])\\.([^aeoiuɛɔɪʊː̯̃])w" : "$1.w",
    "(?<![stdnkɡ]\\.?)w" : "β", // Fricatization of w
    "([aeoiuɛɔɪʊ][ː̯]?\\.?)(b)(?=[aeoiuyɛɔɪʊʏ])" : "$1β", // Intervocalic fricatization of b
    "ae̯" : "ɛː", // Diphthong collapse
    "oe̯" : "eː",
    "ui̯" : "u.i",
    "ei̯" : "iː",
    "eu̯" : "ɛː",
    "d$" : "", // loss of d at the ends of words
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
    "ˈ([^\\.]*)\\.([^\\.]*)([bdɡ]\\.[lr])([^\\.]*)$" : "$1.ˈ$2$3$4", // words with antepenult stress, with a short vowel in the penult followed by voiced stop-liquid cluster, have stress move to the penult
    "([aeoiuɛɔɪʊ])ˈ" : "$1.ˈ",
    "^\\." : "",
}

const optional_v_deletion = /(?<=[aeoiu̯ɛɔɪʊ]\.)β(?=[uʊoɔ])|(?<=[u̯ʊoɔ]\.)β(?=[aeoiuɛɔɪʊ])/g;

const optional_syncope = {
    "(?<=ˈ[^\\.]*\\.[^\\.]*)(\\.?[^aeoiuɛɔɪʊ\\.ˈ])[eoiuɛɔɪʊ](\\.?[^aeoiuɛɔɪʊ\\.ˈ])" : "$1$2",
    "t(\\.?)l" : "k$1l",
}

const default_syncope = {
    "(?<=ˈ[^\\.]*\\.[^\\.]*)([lr])[eoiuɛɔɪʊ](\\.?[^aeoiuɛɔɪʊ\\.ˈ])" : "$1$2",
    "(?<=ˈ[^\\.]*\\.[^\\.]*)([^aeoiuɛɔɪʊ\\.ˈ])[eoiuɛɔɪʊ](\\.?[lr])" : "$1$2",
    "t(\\.?)l" : "k$1l",
}
const av = /a\.β\./g;
const au = "au̯.";

const pr_secondpass = {
    "u̯\\.(?=[aeoiuɛɔɪʊ])" : ".w", // semivocalization in unstressed hiatus (and change of notation of /au̯/)
    "u̯" : "w",
    "\\.\\." : "\\.",
    "w" : "W", // temporary notation shift to avoid deletion of preexisting w in geminate locations
    "(?<!ˈ[^aeoiuɛɔɪʊ]{0,2})[eɛiɪ]\\.(ˈ?)(?=[aeoiuɛɔɪʊ])" : ".$1j",
    "(?<!ˈ[^aeoiuɛɔɪʊ]{0,2})[oɔuʊ]\\.(ˈ?)(?=[aeoiuɛɔɪʊ])" : ".$1w",
    "(?<=ˈ[^aeoiuɛɔɪʊ]{0,2})[eɛiɪ]\\.(?=[aeoiuɛɔɪʊ].*\\.)" : "j", // semivocalization in antepenultimate stressed hiatus with front vowels
    "ˈ([^aeoiuɛɔɪʊ]{0,2})[oɔuʊ]\\.(?=[aeoiuɛɔɪʊ].*\\.)" : "ϝ$1w", // semivocalization in antepenultimate stressed hiatus with back vowels (here using ϝ to mark that the stress needs to be moved one syllable back)
    "\\.([^\\.ϝ]*)\\.ϝ" : ".ˈ$1.",
    "^([^\\.ϝ]*)\\.ϝ" : "ˈ$1.",
    "(?<!ˈ.*)ϝ" : "ˈ",
    "ϝ" : "",
    "\\.([^aeoiuɛɔɪʊ])\\." : "$1.",
    "([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])\\.([^aeoiuɛɔɪʊ])" : "$1.$2$3",
    "(?<![^aeoiuɛɔɪʊ])\\.ˈ([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])" : "$1.ˈ$2",
    "\\.([^aeoiuɛɔɪʊ])ˈ([^aeoiuɛɔɪʊ])" : ".ˈ$1$2",
    "([^aeoiuɛɔɪʊ])\\.(ˈ?)jɛ" : ".$2$1e",
    "([^aeoiuɛɔɪʊ])\\.(ˈ?)wɔ" : ".$2$1o",
    "(?<=[aeoiuɛɔɪʊ])\\.([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ\\.])" : "$1.$2", // V.CC realigned to VC.C
    "([^aeoiuɛɔɪʊ])\\.(ˈ?)\\1w" : "$1.$2$1", // w deletion after geminates
    "W" : "w", // undoes earlier temporary notation shift,
    "(\\.)(?=\\1)" : "",
    "^([^aeoiuɛɔɪʊ]+)\\.([^aeoiuɛɔɪʊ\\.]+)" : "$1$2.", // misaligned consonants at the start of words fixed
    "^([^aeoiuɛɔɪʊ]+)ˈ([^aeoiuɛɔɪʊ\\.ˈ]+)" : "ˈ$1$2",
    "^(ˈ?[^aeoiuɛɔɪʊ\\.]*)\\.([aeoiuɛɔɪʊ])" : "$1$2",
    "(?<=[aeoiuɛɔɪʊ])\\.([^aeoiuɛɔɪʊ\\.])\\.([^aeoiuɛɔɪʊ\\.]+)" : "$1.$2", // misaligned consonants otherwise
    "(?<=[aeoiuɛɔɪʊ])\\.(ˈ?)([^aeoiuɛɔɪʊ])(?=[^aeoiuɛɔɪʊ\\.])" : "$2.$1", 
    "(?<=\\.)([^aeoiuɛɔɪʊ]+)\\.([^aeoiuɛɔɪʊ\\.]+)" : "$1$2.", 
    "(?<=\\.)([^aeoiuɛɔɪʊ]+)ˈ([^aeoiuɛɔɪʊ\\.ˈ]+)" : "ˈ$1$2",
    "(?<=\\.)(ˈ?[^aeoiuɛɔɪʊ\\.]*)\\.([aeoiuɛɔɪʊ])" : "$1$2",
    "ɡ(?=\\.?m)" : "w", // gm -> wm
    "(?<=[aeoiuɛɔɪʊ])\\.k\\.w(ˈ?)j" : "k.$1j", // kwj -> kj
    "ˈ\\." : ".ˈ", // I am actually so confused as to what the cause of this is but this band-aid fix should work for now 
    "ʊ(?=\\.?ˈ?[ɪij])" : "u", // raising of u before i/j
    "\\.ks" : ".s", // ks -> s before or after a consonant, or at the end of multisyllabic words
    "k\\.s(?=[^aeoiuɛɔɪʊ])" : "s.",
    "(?<=\\..*)ks$" : "s",
    "(?<=[^aeoiuɛɔɪʊ\\.])ks$" : "s",
    "^s(?=[^aeoiuɛɔɪʊ])" : "ɪs.", // sC epenthesis
    "^ˈs(?=[^aeoiuɛɔɪʊ])" : "ɪs.ˈ",
    "e(?=s\\.tj)" : "i", // raising of e, o before stj
    "o(?=s\\.tj)" : "u",
    "(?<!\\..*)([aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ]+)$" : "$1$2.$3e", // monosyllablic words ending in a consonant get epenthetic -e
    "(?<!\\..*)([aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])$" : "$1.$2e",
    "(?<=^[^\\.]*\\.[^\\.]*)i(?=[^\\.]*\\.ˈ[^\\.]*\\.)" : "ɪ", // In the second syllable of words with the structure [ˌσσˈσσ], /i/ and /u/ merge into /ɪ/ and /ʊ/ respectively.
    "(?<=^[^\\.]*\\.[^\\.]*)u(?=[^\\.]*\\.ˈ[^\\.]*\\.)" : "ʊ",
    "([^aeoiuɛɔɪʊwj])\\.(ˈ?)j" : ".$2$1ʲ", // palatalization
    "(?<=[^aeoiuɛɔɪʊwj])(\\.?)(ˈ?)([^aeoiuɛɔɪʊwj])j" : "$1$2$3ʲ",
    "jj" : "j", // /jj/ can't exist except when split between two syllables
    "ŋ(\\.?ˈ?)n" : "ɲ$1ɲ",
    "^\\." : ""
}

const pr_orthography = {
    "ˈ([^aeoiuɛɔɪʊ]{0,3})([aeoiuɛɔɪʊ])" : "$1$2́",
    "ɪ" : "į",
    "ɛ" : "ę",
    "ɔ" : "ǫ",
    "ʊ" : "ų",
    "u" : "ụ",
    "o" : "ọ",
    "e" : "ẹ",
    "i" : "ị",
    "aw" : "au",
    "áw" : "áu",
    "β" : "v",
    "ʲ" : "́",
    "\\." : "",
    "ɲɲ" : "gn",
}

const src_firstpass = {
    "ɲ" : "n", 
    "aw" : "a", // au collapse
    "r" : "ɾ", // ɾ!! ɾ!!!!!!
    "ɪ" : "i", // Vowel collapse
    "ʊ" : "u",
    "e" : "ɛ",
    "o" : "ɔ",
    "ɛ(?=[^\\.]*\\.[^\\.]*[iu])" : "e", // Metaphony/vowel harmony
    "ɔ(?=[^\\.]*\\.[^\\.]*[iu])" : "o",
    "β" : "v", // *v /v/
    "(?<=[aeɛioɔu]\\.ˈ?)b(?=[aeɛioɔu])" : "β", // lenition chain shift
    "(?<=[aeɛioɔu]\\.ˈ?)d(?=[aeɛioɔu])" : "ð",
    "(?<=[aeɛioɔu]\\.ˈ?)ɡ(?=[aeɛioɔu])" : "ɣ",
    "(?<=[aeɛioɔu]\\.ˈ?)p(?=[aeɛioɔu])" : "b",
    "(?<=[aeɛioɔu]\\.ˈ?)t(?=[aeɛioɔu])" : "d",
    "(?<=[aeɛioɔu]\\.ˈ?)k(?=[aeɛioɔu])" : "ɡ",
    "(?<=[aeɛioɔu]\\.ˈ?)f(?=[aeɛioɔu])" : "v",
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z",
    "l(\\.?ˈ?)l" : "ɖ$1ɖ", // ɖ
    "n(\\.?ˈ?)d" : "n$1ɖ",
    "n(\\.?ˈ?)w" : "n$1n", // nw -> nn
    "[ptk](\\.?ˈ?)s" : "s$1s", // [C +stop]s -> ss
    "ɾ(\\.?ˈ?)ɾ" : "$1r", // r
    "^(ˈ?)kw" : "$1k", // qu-assimilation
    "[kɡ]\\.(ˈ?)w" : ".$1b", 
    "(?<!^)[kɡ]w" : "b",
    "n(?=\\.?ˈ?b)" : "m",   
    "([tk])\\.?\\1ʲ" : "ʦ", // palatalization
    "[tk]ʲ" : "ʦ",
    "lʲ" : "ʣ",
    "(?<=[aeɛioɔu])\\.ɾʲ" : "ɾ.ʣ",
    "ɾʲ" : "ɾʣ",
    "([aeɛioɔu])\\.(ˈ?)[dɡ]ʲ(?=[aeɛioɔu])" : "$1j.$2j",
    "[dɡ]ʲ" : "j",

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

    if ($("#early-monophthongs").is(":checked")) {
        Object.keys(optional_early_monophthongs).forEach((key) => proto_romance_phonetic = proto_romance_phonetic.replace(new RegExp(key, "g"), optional_early_monophthongs[key]));
    }

    Object.keys(pr_firstpass).forEach((key) => proto_romance_phonetic = proto_romance_phonetic.replace(new RegExp(key, "g"), pr_firstpass[key]));
    if ($("#v-deletion").is(":checked")) {
        proto_romance_phonetic = proto_romance_phonetic.replace(optional_v_deletion, "");
    }

    if ($("#syncope").is(":checked")) {
        Object.keys(optional_syncope).forEach((key) => proto_romance_phonetic = proto_romance_phonetic.replace(new RegExp(key, "g"), optional_syncope[key]));
    } else {
        Object.keys(default_syncope).forEach((key) => proto_romance_phonetic = proto_romance_phonetic.replace(new RegExp(key, "g"), default_syncope[key]));
    }
    if ($("#av-au").is(":checked")) {
        proto_romance_phonetic = proto_romance_phonetic.replace(av, au);
    }
    Object.keys(pr_secondpass).forEach((key) => proto_romance_phonetic = proto_romance_phonetic.replace(new RegExp(key, "g"), pr_secondpass[key]));

    proto_romance = proto_romance_phonetic;
    Object.keys(pr_orthography).forEach((key) => proto_romance = proto_romance.replace(new RegExp(key, "g"), pr_orthography[key]));

    // Evolve to Logudorese Sardinian
    logudorese_phonetic = proto_romance_phonetic;
    Object.keys(src_firstpass).forEach((key) => logudorese_phonetic = logudorese_phonetic.replace(new RegExp(key, "g"), src_firstpass[key]));


    $("#latinphon").val(latin_phonetic);
    $("#pr").val(proto_romance);
    $("#prphon").val(proto_romance_phonetic);
    $("#srcphon").val(logudorese_phonetic);
}