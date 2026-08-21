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
    "m(-?[sztdrl])" : "n$1",
    "n(-?[pbf])" : "m$1",
    "g(-?n)" : "ŋ$1",
    "(a)([eu])(?!ː)" : "$1$2̯", // Diphthongs
    "(e)([iu])(?!ː)" : "$1$2̯",
    "(o)(e)(?!ː)" : "$1$2̯",
    "(u)(i)(?!ː)" : "$1$2̯",
}

// After syllabification
const latin_fourthpass = {
    "(l)(?=-?[aeou])" : "ɫ", // L-darkening
    "(l)$" : "ɫ",
    "(l)\\.(?=[^lɫ])" : "ɫ.",
    "l.ɫ" : "l.l",
    "(?<=^ˈ?[^\\.]{0,3}[aeiouy])(ː?)[nm]s$" : "$1̃s", // Nasalization in monosyllables (doesn't affect length at all)
    "(?<=^ˈ?[^\\.]{0,3}[aeiouy]ː?)([nm])$" : "̃",
    "(?<=[aeiouy])ː?[nm](\\.?)(s)" : "̃ː$1s", // Nasalization
    "([aeiouy])([nm])\\.ː?s" : "$1̃ː.s",
    "(ː[nm])$" : "̃ː",
    "([aeiouy])([nm])$" : "$1̃ː",
    "e(?!̃?[ː̯])" : "ɛ", // Vowel reduction
    "o(?!̃?[ː̯])" : "ɔ",
    "i(?!̃?[ː̯])" : "ɪ",
    "u(?!̃?[ː̯])" : "ʊ",
    "y(?!̃?[ː̯])" : "ʏ",
    "ɛ(?=.̯)" : "e", // Vowel unreduction in diphthongs (I'm too lazy to figure out how to incorporate this into the initial regices)
    "ɔ(?=.̯)" : "o",
    "ɪ(?=.̯)" : "i",
    "ʊ(?=.̯)" : "u",
    "ʏ(?=.̯)" : "y",
    "(?<=[aeoiuɛɔɪʊyʏː̯̃])-(?=[aeoiuɛɔɪʊyʏː̯̃])" : ".",
    "(?<=[aeoiuɛɔɪʊyʏː̯̃][^aeoiuɛɔɪʊyʏː̯̃])-(?=[^aeoiuɛɔɪʊyʏː̯̃])" : ".",
    "-" : "",
    "\\.\\." : ".",
    "g" : "ɡ",
}

const optional_early_monophthongs = {
    "au̯" : "oː",
    "[ao]e̯" : "eː"
}

// First pass evolving to Proto-Romance phonetically
const proto_firstpass = {
    "pʰ" : "f", // aspirate collapse
    "tʰ" : "t",
    "kʰ" : "k", 
    "ɫ" : "l", // l-ɫ distinction is mostly dropped
    "y" : "i", // Iotification
    "ʏ" : "ɪ",
    "(?<=[aeoiuɛɔɪʊː̯̃])\\.([^aeoiuɛɔɪʊː̯̃])w" : "$1.w",
    "(?<![stdnkɡ]\\.?)w" : "β", // Fricatization of w
    "(?<=[aeoiuɛɔɪʊ][ː̯]?\\.?ˈ?)(b)(?=[aeoiuyɛɔɪʊʏ])" : "β", // Intervocalic fricatization of b
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
    "ˈ([^\\.]+)\\.([^\\.]+)(\\.?[bdɡ]\\.?[lr])([^\\.]*)$" : "$1.ˈ$2$3$4", // words with antepenult stress, with a short vowel in the penult followed by voiced stop-liquid cluster, have stress move to the penult
    "([aeoiuɛɔɪʊ])ˈ" : "$1.ˈ",
    "^\\." : "",
    "^ek\\.(ˈ?)s(?=[^aeoiuɛɔɪʊ])" : "ɪs.$1",
    "^ek\\.(ˈ?)s" : "ɪ.$1s",
}

const optional_v_deletion = /(?<=[aeoiu̯ɛɔɪʊ]\.)β(?=[uʊoɔ])|(?<=[u̯ʊoɔ]\.)β(?=[aeoiuɛɔɪʊ])/g;

const syncope_assverb = /(?<=[eɛː]\.?r)e$/g 

const optional_syncope = { 
    "^(.)" : "S$1",
    "(?<![Sˈ][^\\.]*)([^aeoiuɛɔɪʊS\\.ˈ̃ː̯]\\.?)[eoiuɛɔɪʊ](\\.?ˈ?[^aeoiuɛɔɪʊ\\.ˈ̃ː̯])([^\\.]*)([aeoiuɛɔɪʊ])(?!E)" : "$1$2$3$4",
    "t(\\.?)l" : "k$1l",
    "S" : "",
    "E" : "e"
}

const default_syncope = {
    "^(.)" : "S$1",
    "(?<![Sˈ][^\\.]*)([lr]\\.?)[eoiuɛɔɪʊ](\\.?ˈ?[^aeoiuɛɔɪʊ\\.ˈ̃ː̯])([^\\.]*)([aeoiuɛɔɪʊ])(?!E)" : "$1$2$3$4",
    "(?<![Sˈ][^\\.]*)([^aeoiuɛɔɪʊS\\.ˈ̃ː̯]\\.?)[eoiuɛɔɪʊ](\\.?ˈ?[lr])([^\\.]*)([aeoiuɛɔɪʊ])(?!E)" : "$1$2$3$4",
    "t(\\.?)l" : "k$1l",
    "S" : "",
    "E" : "e"
}
const av = /a\.β\./g;
const au = "au̯.";

const rsss_regex = /r(?=\.?ˈ?s)/g;

const proto_secondpass = {
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
    "k(\\.?ˈ?)\\.w(ˈ?)j" : "k.$1j", // kwj -> kj
    "ˈ\\." : ".ˈ", // I am actually so confused as to what the cause of this is but this band-aid fix should work for now 
    "ʊ(?=\\.?ˈ?[ɪij])" : "u", // raising of u before i/j
    "\\.ks" : ".s", // ks -> s before or after a consonant, or at the end of multisyllabic words
    "k\\.s(?=[^aeoiuɛɔɪʊ])" : "s.",
    "(?<=\\..*)ks$" : "s",
    "(?<=[^aeoiuɛɔɪʊ\\.])ks$" : "s",
    "^s(?=[^aeoiuɛɔɪʊwj])" : "ɪs.", // sC epenthesis
    "^ˈs(?=[^aeoiuɛɔɪʊwj])" : "ɪs.ˈ",
    "e(?=s\\.tj)" : "i", // raising of e, o before stj
    "o(?=s\\.tj)" : "u",
    // I don't think this applied to Proto-Romance
    // "(?<!\\..*)([aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ]+)$" : "$1$2.$3e", // monosyllablic words ending in a consonant get epenthetic -e
    // "(?<!\\..*)([aeoiuɛɔɪʊ])([^aeoiuɛɔɪʊ])$" : "$1.$2e",
    "(?<=^[^\\.]*\\.[^\\.]*)i(?=[^\\.]*\\.ˈ[^\\.]*\\.)" : "ɪ", // In the second syllable of words with the structure [ˌσσˈσσ], /i/ and /u/ merge into /ɪ/ and /ʊ/ respectively.
    "(?<=^[^\\.]*\\.[^\\.]*)u(?=[^\\.]*\\.ˈ[^\\.]*\\.)" : "ʊ",
    "([^aeoiuɛɔɪʊwj\\.ˈ])(\\.?ˈ?)j" : "$2$1ʲ", // palatalization
    "(?<=[^aeoiuɛɔɪʊwjˈ])(\\.?)(ˈ?)([^aeoiuɛɔɪʊwjˈ])j" : "$1$2$3ʲ",
    "jj" : "j", // /jj/ can't exist except when split between two syllables
    "ŋ(\\.?ˈ?)n" : "ɲ$1ɲ",
    "^\\." : "",
    "(\\.)\\1" : ".",
    "ks$" : "s",
}

const proto_orthography = {
    "^ˈ(?!.*\\.)" : "",
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
    "k" : "c",
    "\\." : "",
    "ɲɲ" : "gn",
}

// Merges Latin 2nd and 3rd conjugation to have the infinitive with stress before it
const sard_assverbs = /([^\.]*)\.ˈ([^\.]*)e\.re$/g;

const camp_firstpass = {
    "^ɪs\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "ɡ\\.d" : "k.t", // gd -> ct
    "ɲ" : "n", // depalatalization
    "sʲ" : "s",
    "aw" : "a", // au collapse
    "r" : "ɾ", // ɾ!! ɾ!!!!!!
    "ɪ" : "i", // Vowel collapse
    "ʊ" : "u",
    "e" : "ɛ",
    "o" : "ɔ",
    "(?<=[aeɛioɔu]\\.?ˈ?)k(?=\\.?ˈ?[eɛi])" : "ʒ",  // palatalization
    "k(?=\\.?ˈ?[eɛi])" : "ʧ",
    "(?<=[aeɛioɔu]\\.?ˈ?)ɡ(?=\\.?ˈ?[eɛi])" : "",
    "ɡ(?=\\.?ˈ?[eɛi])" : "ʤ",
    "s\\.ʧ(?=[^aeɛioɔu])" : "ʃ.",
    "s(\\.?)ʧ" : "$1ʃ",
    "ɛ(?=[^\\.]*\\.[^\\.]*[iu])" : "e", // Metaphony/vowel harmony
    "ɔ(?=[^\\.]*\\.[^\\.]*[iu])" : "o",
    "([aeɛioɔu])([^aeɛioɔu])$" : "$1.$2$1", // mirror vowel when word ends with a consonant
    "([aeɛioɔu])([^aeɛioɔu])([^aeɛioɔu]+)$" : "$1$2.$3$1", // mirror vowel when word ends with a consonant
    "ɛ$" : "i", // vowel raising at the ends of words
    "ɔ$" : "u", 
    "β" : "v", // *v /v/
    "(?<=n\\.ɡ)l" : "", // nɡl l-deletion
    "(?<=[aeɛioɔu]\\.ˈ?)v(?=[aeɛioɔu])" : "", 
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)b(?=ɾ?[aeɛioɔu])" : "β", // lenition chain shift
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)d(?=ɾ[aeɛioɔu])" : "ð",
    "(?<=[aeɛioɔu]ɾ\\.ˈ?)d(?=ɾ?[aeɛioɔu])" : "ð",
    "(?<=[aeɛioɔu]\\.ˈ?)d(?=[aeɛioɔu])" : "",
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)ɡ(?=ɾ?[aeɛioɔu])" : "ɣ",
    "(?<=[aeɛioɔu]\\.ˈ?)p(?=[aeɛioɔu])" : "b",
    "(?<=[aeɛioɔu]\\.ˈ?)t(?=[aeɛioɔu])" : "d",
    "(?<=[aeɛioɔu]\\.ˈ?)k(?=[aeɛioɔu])" : "ɡ",
    "(?<=[aeɛioɔu]\\.ˈ?)f(?=[aeɛioɔu])" : "V",
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z",
    "l(\\.?ˈ?)l" : "ɖ$1ɖ", // ɖ
    "n(\\.?ˈ?)d" : "ɳ$1ɖ",
    "k(\\.?ˈ?)l" : "j$1j", // kl -> jj
    "\\.jj" : ".j",
    "n(\\.?ˈ?)w" : "n$1n", // nw -> nn
    "[pk](\\.?ˈ?)t" : "t$1t", // [C +stop]t -> tt
    "[ptkr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "([tk])(\\.?)(ˈ?)([tk])ʲ" : "$2$3ʦ", // palatalization. this intentionally triggers for ktj and tkj as well, as in Latin *sūctiāre -> Sardinian sutzare
    "[tk]ʲ" : "ʦ",
    "([^aeɛioɔu])\\.(ˈ?)lʲ" : "$1.$2ll",
    "\\.(ˈ?)lʲ" : "l.$1l",
    "lʲ" : "ll",
    "(?<=[aeɛioɔu])\\.vʲ" : "b.bj",
    "vʲ" : "bj",
    "ɖ\\.?(ˈ?)ɖʲ" : "l$1l", 
    "(?<=[aeɛioɔu])\\.([nɾ])ʲ" : "$1.ʤ",
    "([ɾn])ʲ" : "$1ʤ",
    "j\\.j(?![^aeɛioɔu])" : ".",
    "([aeɛioɔu])(\\.ˈ?)[dɡ]ʲ(?=[aeɛioɔu])" : "$1$2",
    "[dɡ]ʲ" : "j",
    "^(ˈ?)j" : "$1ʤ",
    "(?<=[^aeɛioɔu])\\.(.)ʲ" : ".$1j",
    "(?<![^aeɛioɔu])\\.(.)ʲ" : "$1.j",
    "^(ˈ?)ɾ" : "a.$1r",
    "ð" : "ɾ", // ð -> ɾ
    "(?<=[^aeɛioɔu\\.ˈlwj]\\.?ˈ?)l" : "ɾ", // Cl -> Cɾ
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)jj" : "j", // Cjj -> Cj
    "ɾ(\\.?ˈ?)ɾ" : "$1r", // r
    "([^aeɛioɔu]*)([aeɛioɔu])\\.(ˈ?)\\2" : "$3$1$2", // V.V -> V
}

const camp_verbs = {
    "(?<=ˈ[^\\.]*)a\\.ɾi$" : "aj",
    "(?<=ˈ[^\\.]*\\.[^\\.]*)ɛ\\.ɾi$" : "i",
}

const logu_firstpass = {
    "ɲ" : "n", // depalatalization
    "ɡ\\.d" : "k.t", // gd -> ct
    "sʲ" : "s",
    "aw" : "a", // au collapse
    "r" : "ɾ", // ɾ!! ɾ!!!!!!
    "ɪ" : "i", // Vowel collapse
    "ʊ" : "u",
    "e" : "ɛ",
    "o" : "ɔ",
    "ɛ(?=[^\\.]*\\.[^\\.]*[iu])" : "e", // Metaphony/vowel harmony
    "ɔ(?=[^\\.]*\\.[^\\.]*[iu])" : "o",
    "([aeɛioɔu])([^aeɛioɔu])$" : "$1.$2$1", // mirror vowel when word ends with a consonant
    "([aeɛioɔu])([^aeɛioɔu])([^aeɛioɔu]+)$" : "$1$2.$3$1", // mirror vowel when word ends with a consonant
    "β" : "v", // *v /v/
    "n\\.ɡl" : "ɡ.n", // nɡl metathesis
    "(?<=[aeɛioɔu]\\.ˈ?)v(?=[aeɛioɔu])" : "", // lenition chain shift
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)b(?=ɾ?[aeɛioɔu])" : "v",
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)d(?=ɾ[aeɛioɔu])" : "ð",
    "(?<=[aeɛioɔu]ɾ\\.ˈ?)d(?=ɾ?[aeɛioɔu])" : "ð",
    "(?<=[aeɛioɔu]\\.ˈ?)d(?=[aeɛioɔu])" : "",
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)ɡ(?=ɾ[aeɛioɔu])" : "ɣ",
    "(?<=[aeɛioɔu]ɾ\\.ˈ?)ɡ(?=ɾ?[aeɛioɔu])" : "ɣ",
    "(?<=[aeɛioɔu]\\.ˈ?)ɡ(?=[aeɛioɔu])" : "",
    "(?<=[aeɛioɔu]\\.ˈ?)p(?=[aeɛioɔu])" : "b",
    "(?<=[aeɛioɔu]\\.ˈ?)t(?=[aeɛioɔu])" : "d",
    "(?<=[aeɛioɔu]\\.ˈ?)k(?=[aeɛioɔu])" : "ɡ",
    "(?<=[aeɛioɔu]\\.ˈ?)f(?=[aeɛioɔu])" : "V",
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z",
    "l(\\.?ˈ?)l" : "ɖ$1ɖ", // ɖ
    "n(\\.?ˈ?)d" : "ɳ$1ɖ",
    "k(\\.?ˈ?)l" : "j$1j", // kl -> jj
    "\\.jj" : ".j",
    "n(\\.?ˈ?)w" : "n$1n", // nw -> nn
    "[pk](\\.?ˈ?)t" : "t$1t", // [C +stop]t -> tt
    "[ptkr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "ɾ(\\.?ˈ?)ɾ" : "$1r", // r
    "[kɡ]\\.(ˈ?)w" : ".$1b", // qu-assimilation
    "(?<!^)[kɡ]w" : "b",
    "n(?=\\.?ˈ?b)" : "m",
    "([tk])(\\.?)(ˈ?)([tk])ʲ" : "$2$3ʦ", // palatalization. this intentionally triggers for ktj and tkj as well, as in Latin *sūctiāre -> Sardinian sutzare
    "[tk]ʲ" : "ʦ",
    "lʲ" : "ʣ",
    "(?<=[aeɛioɔu])\\.vʲ" : "b.bj",
    "vʲ" : "bj",
    "ɖ\\.?(ˈ?)ɖʲ" : "$1ʣ", 
    "(?<=[aeɛioɔu])\\.([nɾ])ʲ" : "$1.ʣ",
    "([ɾn])ʲ" : "$1ʣ",
    "([aeɛioɔu])(\\.ˈ?)ɡʲ(?=[aeɛioɔu])" : "$1$2",
    "([aeɛioɔu])(\\.ˈ?)dʲ(?=[aeɛioɔu])" : "$1j$2j",
    "[dɡ]ʲ" : "j",
    "(?<=[^aeɛioɔu])\\.(.)ʲ" : ".$1j",
    "(?<![^aeɛioɔu])\\.(.)ʲ" : "$1.j",
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)l" : "j", // Cl -> Cj
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)jj" : "j", // Cjj -> Cj
    "([^aeɛioɔu]*)([aeɛioɔu])\\.(ˈ?)\\2" : "$3$1$2", // V.V -> V
    "v" : "B",
}

const nuor_firstpass = {
    "ɲ" : "n", // depalatalization
    "ɡ\\.d" : "k.t", // gd -> ct
    "sʲ" : "s",
    "aw" : "a", // au collapse
    "r" : "ɾ", // ɾ!! ɾ!!!!!!
    "ɪ" : "i", // Vowel collapse
    "ʊ" : "u",
    "e" : "ɛ",
    "o" : "ɔ",
    "ɛ(?=[^\\.]*\\.[^\\.]*[iu])" : "e", // Metaphony/vowel harmony
    "ɔ(?=[^\\.]*\\.[^\\.]*[iu])" : "o",
    "([aeɛioɔu])([^aeɛioɔu])$" : "$1.$2$1", // mirror vowel when word ends with a consonant
    "([aeɛioɔu])([^aeɛioɔu])([^aeɛioɔu]+)$" : "$1$2.$3$1", // mirror vowel when word ends with a consonant
    "β" : "v", // *v /v/
    "(?<=n\\.ɡ)l" : "ɾ", // nɡl rhotacism
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)b(?=ɾ?[aeɛioɔu])" : "β", // lenition
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)d(?=ɾ?[aeɛioɔu])" : "ð",
    "(?<=[aeɛioɔu]ɾ?\\.ˈ?)ɡ(?=ɾ?[aeɛioɔu])" : "ɣ",
    "(?<=[aeɛioɔu]\\.ˈ?)f(?=[aeɛioɔu])" : "V",
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z",
    "l(\\.?ˈ?)l" : "ɖ$1ɖ", // ɖ
    "n(\\.?ˈ?)d" : "ɳ$1ɳ",
    "k(\\.?ˈ?)l" : "k$1ɾ", // kl -> kɾ
    "n(\\.?ˈ?)w" : "n$1n", // nw -> nn
    "[pk](\\.?ˈ?)t" : "t$1t", // [C +stop]t -> tt
    "[ptkr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "([ptk])(\\.?ˈ?)\\1([^aeɛioɔu\\.ʲ])" : "$1$2$3", // geminate voiceless stops degeminate
    "([ptk])(\\.?ˈ?)\\1" : "$2$1",
    "^(ˈ?)f(?=[aeɛioɔu])" : "$1", // loss of word-initial f
    "ɾ(\\.?ˈ?)ɾ" : "$1r", // r
    "[kɡ]\\.(ˈ?)w" : ".$1b", // qu-assimilation
    "(?<!^)[kɡ]w" : "b",
    "n(?=\\.?ˈ?b)" : "m",
    "([tk])(\\.?)(ˈ?)([tk])ʲ" : "$2$3ʦ", // palatalization. this intentionally triggers for ktj and tkj as well, as in Latin *sūctiāre -> Sardinian sutzare
    "[tk]ʲ" : "θ",
    "lʲ" : "ʣ",
    "(?<=[aeɛioɔu])\\.vʲ" : "b.bj",
    "vʲ" : "bj",
    "ɖ\\.?(ˈ?)ɖʲ" : "$1ʣ", 
    "(?<=[aeɛioɔu])\\.nʲ" : "n.ʣ",
    "nʲ" : "nʣ",
    "([aeɛioɔu])(\\.ˈ?)ɡʲ(?=[aeɛioɔu])" : "$1$2",
    "([aeɛioɔu])(\\.ˈ?)dʲ(?=[aeɛioɔu])" : "$1j$2j",
    "[dɡ]ʲ" : "j",
    "(?<=[^aeɛioɔu])\\.(.)ʲ" : ".$1j",
    "(?<![^aeɛioɔu])\\.(.)ʲ" : "$1.j",
    "([^aeɛioɔu]*)([aeɛioɔu])\\.(ˈ?)\\2" : "$3$1$2", // V.V -> V
}

const sard_orthography = {
    "(?<=[aeɛioɔu])\\.(?=[aeɛioɔu])" : "", // diphthongs don't count for counting purposes
    "ˈ([^\\.]*)$" : "$1",
    "ˈ([^\\.]*\\.[^\\.]*)$" : "$1",
    "ˈ([^aeɛioɔu\\.]*)([aeɛioɔu])" : "$1$2̀",
    "ˈ" : "",
    "\\." : "",
    "(?<=[eo])̀" : "́",
    "ɳɳ" : "nd",
    "ɳ" : "n",
    "[eɛ]" : "e",
    "[oɔ]" : "o",
    "jj" : "j",
    "z" : "s",
    "ʒ" : "x",
    "ʃ(?=[ei])" : "sc",
    "ʃ" : "sci",
    "ʧ(?=[ei])" : "c",
    "ʧ" : "ci",
    "ʤ(?=[ei])" : "g",
    "ʤ" : "gi",
    "V" : "f",
    "β" : "b",
    "ɣ" : "ɡ",
    "ð" : "d",
    "(?<=[^aeiou])j(?![ji])" : "i",
    "ɡ(?=[ei])" : "gh",
    "B" : "v",
    "ɡ" : "g",
    "ʣ" : "z",
    "ʦ" : "tz",
    "w" : "u",
    "jj" : "j",
    "r" : "rr",
    "ɾ" : "r",
    "ɖ" : "d",
    "k(?=[ei])" : "ch",
    "k" : "c",
    "θ" : "th",
}

const sard_finish = {
    "V" : "v",
    "(?<=[aeɛioɔu]\\.?ˈ?)B(?<=[aeɛioɔu])" : "β",
    "B" : "b",
}

const afri_firstpass = {
    "β" : "b", // betacism
    "ɪ" : "i", // Vowel collapse
    "ʊ" : "u",
    "e" : "ɛ",
    "o" : "ɔ",
    "k(\\.?ˈ?)l" : "ɡ$1l", // kl -> gl
    "^(ˈ?)k" : "$1ɡ",
}

const afri_orthography = {
    "-" : "",
    "m$" : "",
    "ch" : "k",
    "th" : "t",
    "ph" : "f",
    "c" : "k",
    "ā" : "a",
    "ē" : "e",
    "ī" : "i",
    "ō" : "o",
    "ū" : "u",
    "ȳ" : "y",
    "y" : "i",
    "ae" : "e",
    "oe" : "e",
    "^u([aeiouy])" : "w$1", // Replaces u with w at the beginnings of words before vowels, as in vacuus [ˈwa.kʊ.ʊs]
    "([aeiouy]-?)(u)(-?[aeiouy])" : "$1w$3", // Replaces u with w intervocalically, as in flāvus [ˈfɫaː.wʊs],
    "w" : "b",
}

// This is a Proto-Romanian pass used for all of the Romanian langs
const proma_firstpass = {
    "β" : "v",
    "j" : "ʤ", // j -> ʤ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "j", // Ṿs -> Ṿj / _#
    "[iɪ]j$" : "i",
    "[^aeɛiɪoɔuʊjwn]$" : "",
    "ɪ" : "e",
    "(?<=^[ɛe]s\\.(ˈ?))w" : "b", // esw -> esb
    "^[ɛe]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "s(?=\\.?ˈ?[bdɡv])" : "z", // s- -> z- before certain voiced consonants
    "ɔ" : "o",
    "vʲ" : "bʲ", // early palatalization outcome of vj
    "(?<=ˈ[^\\.]*)ʊ(?=\\.?[mb])" : "o", // Latin stressed short u -> PRi *o / _m, _b
    "ʊ" : "u",
    "([kɡ])(\\.?ˈ?)w(?=[eiɛ])" : "$2$1", // Velarization of labiovelars before front vowels
    "k(?=(\\.?ˈ?)[tdns])" : "p", // Labialization of velars before non-liquid coronals
    "ɡ(?=(\\.?ˈ?)[tdns])" : "b",
    "ɲ(\\.?ˈ?)ɲ" : "m$1n",
    "([tk])(\\.?ˈ?)\\1ʲ(?=[uo]$)" : "ʦ$2ʦ", // geminate palatalization outcomes
    "([tk])(\\.?ˈ?)\\1ʲ(?=[uo])" : "ʧ$2ʧ",
    "([tk])(\\.?ˈ?)\\1ʲ" : "ʦ$2ʦ",
    "s(\\.?ˈ?)sʲ" : "ʃ$1ʃ",
    "d(\\.?ˈ?)dʲ" : "ʣ$1ʣ",
    "n(\\.?ˈ?)nʲ" : "ɲ$1ɲ",
    "l(\\.?ˈ?)lʲ" : "ʎ$1ʎ",
    "[tk]ʲ(?=[uo]$)" : "ʦ", // palatalization outcomes
    "[tk]ʲ(?=[uo])" : "ʧ",
    "[tk]ʲ" : "ʦ",
    "sʲ" : "ʃ",
    "(?<=^ˈ?)dʲ" : "j",
    "dʲ" : "ʣ",
    "nʲ" : "ɲ",
    "lʲ" : "ʎ",
    "(?<=[aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : "$2.$1j",
    "(?<=[^aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : ".$1$2j",
    "ʲ" : "j",
    "(?<=[kɡ]\\.?ˈ?)l" : "ʎ", // cl/gl palatalization
    "[ɛe](?=n$)|[ɛe](?=\\.?n\\.?ˈ?[^n\\.])|(?<=[mnɲ]\\.?ˈ?)[ɛe](?=\\.?ˈ?m)" : "I", // ɛ, e -> i when before n (but not nn) or before m and after a nasal. note that using I here is to avoid it palatalizing :3
    "o(?=n$)|o(?=\\.?n\\.?ˈ?[^n\\.])|(?<=[mnɲ]\\.?ˈ?)o(?=\\.?ˈ?m)" : "u", // o -> u when before n (but not nn) or before m and after a nasal
    "(?<!^ˈs.)ɛ" : "je", // ɛ-opening
    "ɛ" : "e",
    "\\.(ˈ?)([^aeiou\\.ˈ])j" : "$2.$1j",
    "(?<=[aeiou]\\.ˈ?)l(?=[aeiou])" : "r", // rhotacism of intervocalic single l
    "(?<!ˈ[^\\.]*)a" : "ə", // a -> ə except when stressed or at the start of a word
    "^ə" : "a", 
    "(?<!ˈ[^\\.]*)o" : "u", // o -> u except when stressed
    "a(?=n$)|a(?=\\.?n\\.?[^n\\.])|a(?=m\\.?[^aeiouə])" : "ə", // a -> ə when before n, but not nn, or a consonant cluster starting with m
    "([^aeiouə\\.ˈ])\\.(ˈ?)\\1(?=([^aeiouə]))" : "$1.$2", // degemination
    "([^aeiouə\\.ˈ])\\.(ˈ?)\\1" : ".$2$1",
    "(.)(?=\\1)" : "",
    "(j?)e\\.ve$" : "$1ew", // -eve -> -eu
    "t(\\.?ˈ?)j" : "ʦ$1ʦ", // second palatalization
    "d(\\.?ˈ?)j" : "ʣ$1ʣ",
    "s(\\.?ˈ?)j" : "ʃ$1ʃ",
    "l(\\.?ˈ?)j" : "ʎ$1ʎ",
    "k(\\.?ˈ?)j" : "ʧ$1ʧ",
    "ɡ(\\.?ˈ?)j" : "ʤ$1ʤ",
    "t(?=\\.?ˈ?i)" : "ʦ",
    "d(?=\\.?ˈ?i)" : "ʣ",
    "s(?=\\.?ˈ?i)" : "ʃ",
    "l(?=\\.?ˈ?i)" : "ʎ",
    "k(?=\\.?ˈ?[eiI])" : "ʧ",
    "ɡ(?=\\.?ˈ?[eiI])" : "ʤ",
    "k(\\.?ˈ?)w" : "p$1p", // Labialization of remaining labiovelars
    "ɡ(\\.?ˈ?)w" : "b$1b",
    "n(?=\\.?ˈ?[bp])" : "m",
    "(?<=[ʎj])ə$" : "Ə", // word final -ʎə, -jə block e-breaking in standard Romanian. this is clearly better explained by the wave model, but it'll be easy enuff to achieve here 
    "o(?=[^\\.]*\\.[^\\.][aeə])" : "wa", // o-breaking
    "(?<!^ˈs.)e(?=[^\\.]*\\.[^\\.][aə])" : "ja", // e-breaking
    "e(?=[^\\.]*\\.[^\\.]Ə)" : "e(a)", // wave model stuff go brrr
    "I" : "i", //returning I and Ə to normal
    "Ə" : "ə",
    "([aeiou]\\)?)\\.(ˈ?)([^aeiou\\(\\)])([wj])" : "$1$3.$2$4",
    "(.)\\1" : "$1", // i'm lazy so... double degemination!!!! {no. i don't know why the fuck i have to do this random workaround and then degeminate ones with no syllable break twice. it's the only way it works for some reason.}
    "([^aeiouə\\.ˈ\\(\\)])\\.(ˈ?)\\1(?=([^aeiouə\\(\\)]))" : "$1.$2", 
    "([^aeiouə\\.ˈ\\(\\)])\\.(ˈ?)(?=\\1)" : ".$2",
    "(.)(?=\\1)" : "",
    "s(\\.?ˈ?)ʧ" : "ʃ$1t", // sch -> sht
    "ʎj" : "ʎ", // lol
}

const proma_orthography = {
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuə]{0,3})([aeoiuə])" : "$1$2́",
    "ˈ" : "",
    "\\." : "",
    "ə" : "ă",
    "k(?=[jie])" : "ch",
    "ɡ(?=[jie])" : "gh",
    "k": "c",
    "ɡ" : "g",
    "ʤ(?=[jie])" : "g",
    "ʧ(?=[jie])" : "c",
    "j" : "ĭ",
    "ʤ" : "j",
    "ʧ$" : "č",
    "ʧ" : "ci",
    "ʎ" : "ļ",
    "ɲ" : "ņ",
    "ʦ" : "ț",
    "ʣ" : "ḑ",
    "ʃ" : "ș",
    "w": "u",
}

// TODO: make Romanian langs not lose word final -u if a cluster ending in a liquid ends the word
const roma_firstpass = {
    "\\(a\\)" : "", // -j(a) -> -e
    "(?<=ˈ[^\\.]*r)e" : "ə", // stressed re -> rə
    "(?<=[pmvf])e(?=[^\\.]*\\.?[^\\.]*[aouə])" : "ə", // somewhat complicated ea -> e, e -> ə in specific situations. doesn't occur in Țara Hațegului dialect if i ever want to include that as a feature.
    "([pmvf])(\\.?ˈ?)ja(?=[^\\.]*\\.?[^\\.]*[aouə])" : "$2$1e", 
    "a(?=[^\\.]*\\.?[^\\.]*[i])" : "ə", // a -> ə harmonically if i is in the next syllable
    "[ɲʎ]" : "j", // ɲ, ʎ -> j
    "[əi](?=n$)|[əi](?=\\.?n\\.?[^n\\.])|[əi](?=m\\.?[^aeiouə])" : "ɨ", // ə, i -> ɨ when before n, but not nn, or a consonant cluster starting with m
    "(?<=[aeiouəɨ]\\.?ˈ?)l(?=\\.?ˈ?[aə])" : "w", // l -> w / V_[aə]
    "(?<=[aeiouəɨ]\\.?ˈ?)w(\\.?ˈ?)[aə]" : "$1a", // w -> ∅ / V_[aə]
    "pt" : "t", // pt clusters reduced as in strâmt <- Latin *strinctum
}

const roma_assverb = {
    "([aeiouəɨ]?)(\\.?ˈ)([^aeiouəɨ\\.])([^aeiouəɨ\\.]*)e\\.re$" : "$1$3$2$4ja", // stressed -ere -> -ea
    "(?<=ˈ[^\\.]*)e\\.re$" : "ja",
    "(?<=[aei])\\.re$" : "",
}

const roma_secondpass = {
    "(?<=ˈ[^\\.]*r)i" : "ɨ", // stressed ri -> rɨ
    "()a\\.a" : "a", // a.a -> a
    "[ieə](?=r\\.ˈ?[^aeiouəɨ])" : "ɨ", // i, e, ə -> ɨ / _rC ()
    "ʣ" : "z", // ʣ -> z
    "ʤ(?=[ou])" : "ʒ", // ʤ -> ʒ / _[o,u]
    "([aeoiuəɨ])\\.u$" : "$1w", // -u -> -∅
    "\\.([^aeoiuəɨˈ\\.]*)u$" : "$1",
    "(?<=[aeiouəɨ]\\.?ˈ?)v(?=[aeiouəɨ])" : "", // v -> ∅ / V_V
    "([^aeiouəɨ])(\\.ˈ?)jə$" : "$2$1e", // -jə -> -e
    "(?<=[aeiouəɨ]\\.j)ə$" : "e",
    "jə$" : "e",
    "(?<=i\\.?ˈ?)j(?=[aeiouəɨ])" : "", // j -> ∅ / i_V
    "(?<=ˈ[^\\.]*n)u(?=[^aeiouəɨ\\.]*$)" : "un", // ˈnu -> ˈnun 
    "(?<=ˈ[^\\.]*n)u([^aeiouəɨ\\.])\\." : "un.$1",
    "(?<=ˈ[^\\.]*n)u(?=\\.)" : "un",
    "(?<!\\..*)o$" : "aw", // monosyllabic word-final -o becomes -au
    "(?<=[^aeiouəɨ])j$" : "ʲ", // word final j becomes palatalization
    "(?<=r)ʲ" : "", // rʲ -> r
    "n(?=\\.?ˈ?[ɡk])" : "ŋ", // realization of ng
    "v$" : "w" // -v -> -w
}

const roma_orthography = {
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuɨə]{0,3})([aeoiuɨə])" : "$1$2́",
    "ˈ" : "",
    "\\." : "",
    "ʲ" : "i",
    "ə" : "ă",
    "k(?=[jie])" : "ch",
    "ɡ(?=[jie])" : "gh",
    "k": "c",
    "ɡ" : "g",
    "ʤ(?=[jie])" : "g",
    "ʧ(?=[jie])" : "c",
    "(?<=[aeoiuɨă]́?)j" : "i",
    "j(?=[euo])" : "i",
    "(?<![aeoiuɨă]́?)j(?!=[ueo])" : "e",
    "j" : "i",
    "(?<=[aeoiuɨă]́?)w" : "u",
    "ŋ" : "n",
    "w" : "o",
    "ʤ" : "gi",
    "ʒ" : "j",
    "ʧ" : "ci",
    "ʦ" : "ț",
    "ʃ" : "ș",
    "^ɨ|ɨ$" : "î",
    "ɨ" : "â",
}

const arom_firstpass = {
    "([aieouə])\\.(ˈ?)([^aieouə])e\\(a\\)" : "$1$3.$2ja", // e(a) -> ja
    "e\\(a\\)" : "ja",
    "(?<=[pmvf])e(?=[^\\.]*\\.?[^\\.]*[aouə])" : "i", // somewhat complicated e -> i in specific situations. see Daco-Romanian for more details
    "(?<=ʎ)ə$" : "e", // ʎə -> ʎe / _#
    "ʧ(?=\\.?ˈ?[jie])" : "ʦ", // ʧi -> ʦi, ʤi -> ʣi
    "ʤ(?=\\.?ˈ?[jie])" : "ʣ", 
    "e$" : "i", // -e -> -i
    "^(ˈ?)s(?=k)" : "$1ʃ", // sc -> shc
    "^(ˈ?)f(?=[aieouə])" : "$1h", // f -> h / #_V
    "^(ˈ?)mj" : "$1ɲ", // m-palatalization at the beginnings of words
    "^(ˈ?)m(?=i)" : "$1ɲ",
    "pt" : "t", // pt clusters reduced as in strimtu <- Latin *strinctum
    "b(?=\\.?ˈ?[tkʦ])" : "p", // assimilative devoicing of b as in suptsãri <- Latin subtīlem
    "^ə(?=n$)|^ə(?=\\.?n\\.?[^n\\.])|^ə(?=m\\.?[^aeiouə])" : "", // ə -> ∅ at the starts of words when before n, but not nn, or a consonant cluster starting with m
    "^([^aieouə]+)\\.(ˈ?)" : "$2$1",
    "(?<=ˈ[^\\.]*r)i" : "ə", // stressed ri -> rə
    "^(ˈ?)r" : "a.$1r", // r- -> ar-
    "(?<=a)w(?=\\.)" : "v", // au -> av
    "(?<=[aeiouə]\\.?ˈ?)l(?=\\.?ˈ?[aə])" : "w", // l -> w / V_[aə]
    "v\\.(ˈ?)j(?=([^aieouə]))" : "j.$1", // vj -> j
    "v(\\.?ˈ?)j" : "$1j",
    "^(ˈ?)v(?=i)" : "$1j", // v -> j / #_i
    "([^aeiouəɨ])(\\.ˈ?)jə$" : "$2$1e", // -jə -> -e
    "(?<=[aeiouəɨ]\\.j)ə$" : "e",
    "jə$" : "e",
    "[ptk](\\.?ˈ?)je" : "$1ca", // pj, tj, kj -> c; bj, dj, ɡj -> ɟ
    "[ptk]\\.(ˈ?)j(?=([^aieouə]))" : "c.$1",
    "[ptk]\\.(ˈ?)j(?=([aieouə]))" : ".$1c", 
    "[ptk]j" : "c", 
    "[bdɡ](\\.?ˈ?)je" : "$1ɟa",
    "[bdɡ]\\.(ˈ?)j(?=([^aieouə]))" : "ɟ.$1",
    "[bdɡ]\\.(ˈ?)j(?=([aieouə]))" : ".$1ɟ", 
    "[bdɡ]j" : "ɟ", 
    "(?<!\\..*)o$" : "aw", // monosyllabic word-final -o becomes -au
    "\\.vu$" : "w", // -vu -> -w
    "n(?=\\.?ˈ?[ɡk])" : "ŋ", // realization of ng 
}

const arom_orthography = {
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuə]{0,3})([aeoiuə])" : "$1$2́",
    "ˈ" : "",
    "\\." : "",
    "ə" : "ã",
    "k": "C",
    "c(?=[jie])" : "Ch",
    "c(?=a)" : "Che",
    "c" : "Chi",
    "C" : "c",
    "ɟ(?=[jie])" : "gh",
    "ɟ(?=a)" : "ghe",
    "ɟ" : "ghi",
    "ɡ" : "g",
    "ʤ(?=[jie])" : "g",
    "ʧ(?=[jie])" : "c",
    "^j(?=[aeoiuă])" : "y",
    "(?<=[aeoiuă]́?)j" : "i",
    "j(?=e)" : "i",
    "(?<![aeoiuă]́?)j(?!=[ue])" : "J",
    "^J" : "j",
    "J" : "e",
    "j" : "i",
    "(?<=[aeoiuă]́?)w" : "u",
    "ŋ" : "n",
    "w" : "o",
    "ʤ" : "j",
    "ʧ" : "ci",
    "ʒ" : "j",
    "ʦ" : "ts",
    "ʣ" : "dz",
    "ʃ" : "sh",
    "ʎ" : "lj",
    "ɲ" : "nj",
}

const megl_firstpass = {
    "^(ˈ?)e" : "$1je", // e -> je / #_
    "^(ˈ?)o" : "$1wo", // o -> wo / #_
    "(?<=[pmvf])e(?=[^\\.]*\\.?[^\\.]*[aouə])" : "i", // somewhat complicated e -> i in specific situations. see Daco-Romanian for more details
    "e$" : "i", // -e -> -i
    "\\.vu$" : "w", // -vu -> -w
    "([aeoiuəɨ])\\.u$" : "$1w", // -u -> -∅
    "\\.([^aeoiuəɨˈ\\.]*)u$" : "$1",    
    "ʧ(?=\\.?ˈ?[jie])" : "ʦ", // ʧi -> ʦi, ʤi -> ʣi
    "ʤ(?=\\.?ˈ?[jie])" : "ʣ", 
    "pt" : "t", // pt clusters reduced as in strimt <- Latin *strinctum
    "[əi](?=n$)|[əi](?=\\.?n\\.?[^n\\.])|[əi](?=m\\.?[^aeiouə])" : "ɔ", // ə, i -> ɔ when before n, but not nn
    "(?<=[aeiouə]\\.?ˈ?)l(?=\\.?ˈ?[aə])" : "w", // l -> w / V_[aə]
    "v\\.(ˈ?)j(?=([^aieouəɔ]))" : "ɟ.$1", // vj -> ɟ
    "v(\\.?ˈ?)j" : "$1ɟ",
}

const megl_orthography = {
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuəɔɛ]{0,3})([aeoiuəɔɛ])" : "$1$2́",
    "ˈ" : "",
    "\\." : "",
    "ə" : "ă",
    "c(?![jieɛ])" : "Kʼ",
    "c" : "k",
    "ɟ(?![jieɛ])" : "gʼ",
    "ɟ" : "ɡ",
    "k(?=[jieɛ])" : "ch",
    "ɡ(?=[jieɛ])" : "gh",
    "k" : "c",
    "K" : "k",
    "ɡ" : "g",
    "ʤ(?=[jieɛ])" : "g",
    "ʧ(?=[jieɛ])" : "c",
    "(?<=.)j(?=a)" : "e",
    "ɔ" : "ǫ",
    "ɛ" : "ę",
    "j" : "i̯",
    "ʤ" : "j",
    "ʧ$" : "tș",
    "ʧ" : "ci",
    "ʎ" : "ľ",
    "ɲ" : "ń",
    "ʦ" : "ț",
    "ʣ" : "ḑ",
    "ʃ" : "ș",
    "ŋ" : "n",
    "w(?=a)" : "o",
    "w": "u̯",
}

// Istro-Romanian
const istr1245_firstpass = {
    "([^aeoiuə])\\.(ˈ?)wa" : ".$1o", // wa -> o
    "wa" : "o",
    "([aeoiuə])\\.u$" : "$1v", // -Vu -> -Vv
    "v\\.(ˈ?)j(?=([^aieouə]))" : "ʎ.$1", // vj -> ʎ
    "v(\\.?ˈ?)j" : "$1ʎ",
    "ʤ" : "ʒ", // ʤ deaffricatization
    "(?<=ʎ)ə$" : "e", // ʎə -> ʎe / _#
    "ə$" : "æ", // ə -> æ / _#
    "(?<![^aieouəɒæ]\\.?ˈ?)w" : "v", // w -> v
    "[ptk](\\.?ˈ?)j" : "k$1ʎ", // Cj -> kʎ
    "a(?=\\.?ˈ?r)" : "ɒ", // a -> ɒ / _r 
    "(?<=ˈ[^\\.]*)a(?![^aieouəɒæ]\\.)" : "ɒ", // stressed a -> ɒ unless followed by a consonant cluster
    "(?<=[aieouəɒæ]\\.ˈ?)n(?=[aieouəɒæ])" : "r", // intervocalic rhotacism of r (not present in all dialects but it's a neat feature so I felt like including it) 
}

const istr1245_assverb = {
    "(?<=ˈ[^\\.]*)e(?=\\.re$)" : "æ", // stressed -ere -> -æ
    "(?<=[ɒei])\\.re$" : "",
}

const istr1245_orthography = {
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuəɒæ]{0,3})([aeoiuəɒæ])" : "$1$2́",
    "ˈ" : "",
    "\\." : "",
    "ɡ" : "g",
    "(?<=[aeoiuəɒæ]́?)j" : "ĭ",
    "j(?=e)" : "ĭ",
    "(?<![aeoiuəɒæ]́?)j(?!=[ueæ])" : "e",
    "j" : "ĭ",
    "(?<=[aeoiuəɒæ]́?)w" : "ŭ",
    "ŋ" : "n",
    "w" : "o",
    "ʎ" : "lj",
    "ɲ" : "nj",
    "ʤ" : "gi",
    "ʒ" : "ž",
    "ʧ" : "č",
    "ʦ" : "c",
    "ʣ" : "dz",
    "ʃ" : "š",
    "ɒ" : "å",
    "æ" : "ę",
    "ə" : "â",
}

const dalm_firstpass = {
    "^[ɛeɪ]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "(?<=^(ˈ?))j" : "ʣ", // j- -> ʣ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "j", // Ṿs -> Ṿj / _#
    "([iɪ])j$" : "$1",
    "ʊj$" : "ʊ",
    "(?<=ˈ[^\\.]*\\.[^\\.]*)u$" : "ʊ", // word-final u -> ʊ
    "k(?=\\.ˈ?t)" : "j", // kt -> jt
    "k(?=\\.ˈ?s)" : "s", // ks -> ss
    "ɲ(\\.?ˈ?)ɲ" : "m$1n", // ɲɲ -> mn
    "(?<=[aeɛiɪoɔuʊjw])s$" : "j", // Ṿs -> Ṿj / _#
    "[iɪ]j$" : "i",
    "[^aeɛiɪoɔuʊjwn]$" : "",
    "w" : "β", // w -> β
    "^(ˈ?)([auʊo])" : "$1j$2", // word-initial lightening
    "^ˈɔ" : "ˈwɔ", // word-initial darkening
    "[tk]ʲ" : "ʦ", // palatalization outcomes
    "sʲ" : "s",
    "dʲ" : "ʣ",
    "ɡʲ" : "j",
    "nʲ" : "n",
    "lʲ" : "ʎ",
    "(?<=[aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : "$2.$1j",
    "(?<=[^aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : ".$1$2j",
    "ʲ" : "j",
}

const dalm_assverb = {
    "([aeɛiɪoɔuʊ])\\.([^aeɛiɪoɔuʊ])e\\.re$" : "$1$2.re", // -ere -> -re
    "(?<!ˈ[^\\.]*)([^aeɛiɪoɔuʊ])e\\.re$" : ".$1re",
    "(?<!ˈ[^\\.]*)e\\.re$" : "re",
    "(?<=ˈ[^\\.]*)e(?=\\.re$)" : "A", // -ére -> -are
    "(?<=ˈ[^\\.]*)i(?=\\.re$)" : "E", // -ire -> -ere
}

const dalm_secondpass = {
    "(?<=ˈ[^\\.]*)u" : "y", // stressed u -> y  
    "k(?=\\.?ˈ?[iyj])" : "ʧ", // k-palatalization
    "(?<=ˈ[^\\.]*)o\\.(ˈ?)(?=[^aeoiuɛɔAE]+\\.ˈ?[aeoiuɛɔAE])" : "aw.$1", // stressed o -> aw
    "(?<=ˈ[^\\.]*)o(\\.?ˈ?)" : "a$1w",
    "(?<=ˈ[^\\.]*)e\\.(ˈ?)(?=[^aeoiuɛɔAE]+\\.ˈ?[aeoiuɛɔAE])" : "aj.$1", // stressed e -> aj
    "(?<=ˈ[^\\.]*)e(\\.?ˈ?)" : "a$1j",
    "(?<=ˈ[^\\.]*)y\\.(ˈ?)(?=[^aeoiuɛɔAE]+\\.ˈ?[aeoiuɛɔAE])" : "oj.$1", // y -> oj
    "(?<=ˈ[^\\.]*)y(\\.?ˈ?)" : "o$1j",
    "(?<=ˈ[^\\.]*)i\\.(ˈ?)(?=[^aeoiuɛɔAE]+\\.ˈ?[aeoiuɛɔAE])" : "aj.$1", // stressed i -> aj
    "(?<=ˈ[^\\.]*)i(\\.?ˈ?)" : "a$1j",
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "E" : "e",
    "ɡ(?=\\.(ˈ?)l)" : "k", // gl -> kl
    "([tpbd])\\.(ˈ?)([rljw])" : ".$2$1$3", // reanalysis of clusters and such [note that k is an exception here]
    "([jw])\\.(ˈ?)([^aeoiuɛɔA])" : ".$2$1$3",
    "ɔ(?=\\.)|ɔ$" : "a", // ɔ -> a in open syllables
    "\\.(ˈ?)([tpbd])([rljw])" : "$2.$1$3", // unreanalysis of clusters and such 
    "\\.(ˈ?)([jw])([^aeoiuUA])" : "$2.$1$3",
    "(?<=ˈ[^\\.]*)a(?=\\.)|(?<=ˈ[^\\.]*)a$" : "U", // stressed a -> u in open syllables
    "A" : "a",
    "([tpbd])\\.(ˈ?)([rljw])" : ".$2$1$3", // reanalysis of clusters and such [note that k is an exception here]
    "([jw])\\.(ˈ?)([^aeoiuɛɔA])" : ".$2$1$3",
    "ɛ(?=\\.)|ɛ$" : "i", // ɛ -> i in open syllables
    "(?<![^aeoiuɛɔU])\\.ˈ([^aeoiuɛɔU])ɔ" : "$1.ˈwa", // ɔ -> wa in closed syllables
    "ɔ" : "wa",
    "(?<![^aeoiuɛɔU])\\.ˈ([^aeoiuɛɔU])ɛ" : "$1.ˈja", // ɛ -> ja in closed syllables
    "ɛ" : "ja",
    "U\\.j" : "U.", // uj -> wo
    "\\.(ˈ?)([tpbd])([rljw])" : "$2.$1$3", // unreanalysis of clusters and such 
    "\\.(ˈ?)([jw])([^aeoiuU])" : "$2.$1$3",
    "jak" : "jek", // jak -> jek
    "j\\.(ˈ?)([mlr])([^aeiouU])" : "$2.$1$3", // j[m,l,r] -> [m,l,r]
    "j\\.(ˈ?)([mlr])" : ".$1$2",
    "j([mlr])" : "$2",
    "s\\.(ˈ?)j([^aeiouU])" : "s.$1$2", // sj -> s
    "s\\.(ˈ?)j" : ".$1s",
    "sj" : "s",
    "(?<=[aeiouU]\\.ˈ?)s(?=[aeiouU])" : "z", // intervocalic s voicing
    "([^aeiouU])(\\.?ˈ?)\\1": "$2$1", // degemination
    "^(ˈ?)jal" : "$1jwal", // jal -> jwal / #_C
    "([jw])\\.([^aeiouUˈ]+)[eo]$" : "$1$2",  // -e, -o deletion (fist half)
    "(?<=[^aeiouUjw]\\.[^aeiouUˈ]+)[eo]$" : "ə", // -e, -o reduction after clusters
    "(?<=[^aeiouU]\\.[^aeiouUˈ]{2,})[eo]$" : "ə", 
    "(?<=ˈ[^\\.]*)\\.([^\\.]*)[eo]$" : "$1", // -e, -o deletion (second half)
    "i(?=\\.?ˈ?j)" : "a", // ij -> aj
    "(?<=^ˈ?)w" : "β", // w- -> v-
    "β$" : "f", // word-final devoicing of v and dz (but for example, not z)
    "ʣ$" : "ʦ",
    "U" : "uɔ̯", // turning U actually into uɔ̯
}

const dalm_orthography = {
    "uɔ̯" : "uo",
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuə]{0,3})([aeoiuə])" : "$1$2̀",
    "ˈ" : "",
    "\\." : "",
    "ə" : "o",
    "(?<=[aeoiu]̀?)j" : "i",
    "(?<=[^aeoiù])j(?=[aeoiu])" : "i",
    "w" : "u",
    "k(?=[jie])" : "ch",
    "ɡ(?=[jie])" : "gh",
    "ʧ(?=[jie])" : "c",
    "ʧ$" : "č",
    "ʧ" : "ci",
    "^s" : "z",
    "(?<=[aeiou]̀?)s(?=[aeiou])|s$" : "ss",
    "z" : "s",
    "k" : "c",
    "ɡ" : "g",
    "[ʦʣ]" : "z",
    "ʎ" : "lj",
    "β" : "v",
}

const vene_firstpass = {
    "β" : "v", // β -> v
    "(?<=ˈ[^\\.]*\\.[^\\.]*)u$" : "ʊ", // word-final u -> ʊ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "j", // Ṿs -> Ṿj / _#
    "([iɪ])j$" : "$1",
    "ʊj$" : "ʊ",
    "ej$" : "ɪ",
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "^[ɛe]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "([kɡ])(?=\\.?ˈ?[eɛi])" : "$1ʲ", // palatalization of k g
    "([kɡ])\\.w(?=\\.?ˈ?[eɛi])" : ".$1",
    "[tk]ʲ" : "ʦ",
    "[dɡ]ʲ" : "ʣ",
    "(?<=^(ˈ?))j" : "ʣ", // j -> ʣ / except when after or before a consonant
    "j(\\.?ˈ?)j" : "$1ʣ",
    "([^aeoiuɛɔjl\\.ˈ])\\.(ˈ?)l([^aeoiuɛɔ]+)" : "$1ʲ.$2$3", // palatalization when followed by l
    "([^aeoiuɛɔjl\\.ˈ])(\\.?ˈ?)l" : "$2$1ʲ",
    "sʲ" : "s", // palatalization outcomes
    "kʲ" : "ʧ",
    "ɡʲ" : "ʤ",
    "lʲ" : "ʎ",
    "rʲ" : "r",
    "(?<=[aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : "$2.$1j",
    "(?<=[^aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : ".$1$2j",
    "ʲ" : "j",
    "k(\\.?ˈ?)\\.w(ˈ?)j" : "k.$1j", // kwj -> kj
    "m(\\.?ˈ?)n" : "n$1n", // mn -> nn
    "(?<=[aeɛioɔu]\\.ˈ?)[bfp](?=[aeɛioɔu])" : "v", // lenition
    "(?<=[aeɛioɔu]\\.ˈ?)[ɡd](?=[aeɛioɔu])" : "",
    "(?<=[aeɛioɔu]\\.ˈ?)k(?=[aeɛioɔu])" : "ɡ",
    "(?<=[aeɛioɔu]\\.ˈ?)t(?=[aeɛioɔu])" : "d",
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z",
    "(?<=[aeɛioɔu]\\.ˈ?)ʦ(?=[aeɛioɔu])" : "z",
    "(?<=[aeɛioɔu]\\.ˈ?)v(?=[oɔu])" : "", // loss of intervocalic v before back vowels
    "[pk](\\.?ˈ?)([ptk])" : "$2$1$2", // [C1 +stop][C2 +stop] -> C2C2
    "[tk](\\.?ˈ?)(ʧ)" : "$2$1$2", // t-, k- act like geminates for ʧ
    "[dɡ](\\.?ˈ?)(ʤ)" : "$2$1$2", // d-, g- act like geminates for ʤ
    "[tsk](\\.?ˈ?)(ʦ)" : "$2$1$2", // t-, s-, k- act like geminates for ʦ
    "[dzɡ](\\.?ˈ?)(ʣ)" : "$2$1$2", // d-, z-, g- act like geminates for ʣ
    "^e([^aeiouɛɔ]*)\\.ˈ" : "ˈ$1", // pretonic initial e is deleted
    "[ptkr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "^s(?=[bdɡʣʤ])" : "z", // assimilatory voicing of initial s-
    "([^aeɛioɔu\\.ˈ])\\.(ˈ?)\\1(?=([^aeɛioɔu]))" : "$1.$2", // degemination
    "([^aeɛioɔu\\.ˈ])\\.(ˈ?)\\1" : ".$2$1",
    "(.)(?=\\1)" : "",
    "n(?=\\.)|n$" : "ŋ", // n -> ŋ at the end of a syllable
    "(?<=ˈ[^\\.]*)a" : "ɐ", // stressed a -> ɐ
    "r" : "ɾ", // /r/ is [ɾ] in most situations
    "^ɾ" : "r",
}

const vene_assverb = {
    "(?<=[eiɐ])\\.ɾe$" : "ɾ", // -Vre -> -Vr
}

const vene_central_assverb = {
    "e(?=\\.ɾe$)" : "a", // -ere -> -are
    "(?<=ˈ[^\\.]*)a" : "ɐ", // stressed a -> ɐ
}

const vene_venice_pass = {
    "ʎ" : "ʤ", // ʎ -> ʤ
    "[ŋn]\\.(ˈ?)j(?=([^aeɛioɔuɐ]))" : "ɲ.$1", // nj -> ɲ
    "[ŋn](\\.?ˈ?)j" : "$1ɲ",
    "ʣ" : "z", // ʣ -> z
    "ʦ" : "s", // ʦ -> s
    "(?<=[aeɛioɔuɐ]\\.ˈ?)l(?=[aeɛioɔuɐ])" : "e̯", // l-elision
}

const vene_central_pass = {
    "ʎ" : "j", // ʎ -> j
    "ʣ" : "z", // ʣ -> z
    "ʦ" : "s", // ʦ -> s
    "(?<=[aeɛioɔuɐ]\\.ˈ?)l(?=[aeɛioɔuɐ])" : "e̯", // l-elision
    "(?<=[^aeɛioɔuɐ])[eiɛ]\\.(ˈ?)(?=[aeɛioɔuɐ])" : ".$1j" // palatal semivocalization
}

const vene_belluno_pass = {
    "ʎ" : "j", // ʎ -> j
}

const vene_orthography = {
    "e̯" : "ł",
    "ɾ" : "r",
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuɛɔɐ]{0,3})([aeoiuɛɔɐ])" : "$1$2̀",
    "ˈ" : "",
    "\\." : "",
    "([eoiu])̀" : "$1́",
    "ɛ" : "e",
    "ɔ" : "o",
    "ɐ" : "a",
    "ʧ(?=[ei])" : "c",
    "ʧ$" : "c'",
    "ʧ" : "ci",
    "ʤ(?=[ei])" : "g",
    "ʤ$" : "g'",
    "ʤ" : "gi",
    "ɡ(?=[ei])" : "gh",
    "ɡ" : "g",
    "kw" : "qu",
    "k(?=[ei])" : "ch",
    "k" : "c",
    "^z(?![aeoiu])" : "s",
    "z" : "x", 
    "ʦ" : "ç",
    "ʣ" : "z",
    "θ" : "th",
    "ð" : "dh",
    "ŋ" : "n",
    "ɲ" : "gn",
    "w" : "u",
    "j(?=[aeiou])" : "i",
    "(?<=[aeioú̀])j" : "i",
}

const vene_delete_elided_l = {
    "e̯(?=\\.?ˈ?[ieɛj])" : "",
    "(?<=[ieɛj]\\.?ˈ?)e̯" : "",
}

const istr1244_firstpass = {
    "β" : "v", // β -> v
    "(?<=ˈ[^\\.]*\\.[^\\.]*)u$" : "ʊ", // word-final u -> ʊ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "j", // Ṿs -> Ṿj / _#
    "([iɪ])j$" : "$1",
    "oj$" : "uj",
    "ej$" : "i",
    "ʊj$" : "ʊ",
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "^[ɛe]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "([kɡ])(?=\\.?ˈ?[eɛi])" : "$1ʲ", // palatalization of k g
    "([kɡ])\\.w(?=\\.?ˈ?[eɛi])" : ".$1",
    "[tk]ʲ" : "s",
    "[dɡ]ʲ" : "z",
    "([^aeoiuɛɔjl\\.ˈ])\\.(ˈ?)l([^aeoiuɛɔ]+)" : "$1ʲ.$2$3", // palatalization when followed by l
    "([^aeoiuɛɔjl\\.ˈ])(\\.?ˈ?)l" : "$2$1ʲ",
    "sʲ" : "s", // palatalization outcomes
    "kʲ" : "ʧ",
    "ɡʲ" : "ʤ",
    "lʲ" : "j",
    "rʲ" : "r",
    "(?<=[aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : "$2.$1j",
    "(?<=[^aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : ".$1$2j",
    "ʲ" : "j",
    "k(\\.?ˈ?)\\.w(ˈ?)j" : "k.$1j", // kwj -> kj
    "(?<=ˈ[^\\.]*)u([^aeɛioɔu])\\." : "ow.$1", // stressed u -> ow
    "(?<=ˈ[^\\.]*)u" : "ow",
    "(?<=ˈ[^\\.]*)i([^aeɛioɔu])\\." : "ej.$1", // stressed i -> ej
    "(?<=ˈ[^\\.]*)i" : "ej",
    "([^aeɛioɔu])\\.ˈ([^aeɛioɔu])+ɛ" : "$1.ˈ$2je", // stressed ɛ -> je
    "\\.ˈ([^aeɛioɔu])ɛ" : "$1.ˈje",
    "(?<=ˈ[^\\.]*)ɛ" : "je",
    "(?<=ˈ[^\\.]*)o" : "u",// stressed o -> u
    "([^aeɛioɔu])\\.ˈ([^aeɛioɔu])+ɔ" : "$1.ˈ$2wo", // stressed ɔ -> wo
    "\\.ˈ([^aeɛioɔu])ɔ" : "$1.ˈwo",
    "(?<=ˈ[^\\.]*)ɔ" : "wo",
    "(?<=ej)\\.to$" : "", // -eîto -> -eî
    "(?<=[aeɛioɔu]\\.ˈ?)v(?=[oɔu])" : "", // deletion of intervocalic v before back vowels
    "\\.([^aeɛioɔuˈ\\.]*s)e$" : "$1", // -e -> -∅, then -C to -Co (unless C is s)
    "(?<!ˈ[^\\.]*)e$" : "o",
    "t(?=\\.ˈ?r)" : "d", // tr -> dr -> r
    "d\\.(ˈ?)r(?=[^aeɛioɔu])" : "r.$1", 
    "d(\\.?ˈ?)r" : "$1r", 
    "m(\\.?ˈ?)n" : "n$1n", // mn -> nn
    "[pk](\\.?ˈ?)([ptk])" : "$2$1$2", // [C1 +stop][C2 +stop] -> C2C2
    "[tk](\\.?ˈ?)(ʧ)" : "$2$1$2", // t-, k- act like geminates for ʧ
    "[dɡ](\\.?ˈ?)(ʤ)" : "$2$1$2", // d-, g- act like geminates for ʤ
    "[tsk](\\.?ˈ?)(ʦ)" : "$2$1$2", // t-, s-, k- act like geminates for ʦ
    "[dzɡ](\\.?ˈ?)(ʣ)" : "$2$1$2", // d-, z-, g- act like geminates for ʣ   
    "([^aeɛioɔu\\.ˈ])\\.(ˈ?)\\1(?=([^aeɛioɔu]))" : "$1.$2", // degemination
    "([^aeɛioɔu\\.ˈ])\\.(ˈ?)\\1" : ".$2$1",
    "(.)(?=\\1)" : "",
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)l" : "j", // Cl -> Cj
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)jj" : "j", // Cjj -> Cj

}

const istr1244_orthography = {
    "" : "",
}


const ital_firstpass = {
    "β" : "v", // β -> v
    "(?<=ˈ[^\\.]*\\.[^\\.]*)u$" : "ʊ", // word-final u -> ʊ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "S", // Ṿs -> Ṿj / _#
    "iS$" : "i",
    "[ɪe]S$" : "e",
    "ʊS$" : "ʊ",
    "[^aeɛiɪoɔuʊjwn]$" : "",
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "^[ɛe]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "([kɡ])(?=\\.?ˈ?[eɛi])" : "$1ʲ", // palatalization of k g
    "(?<=ˈ[^\\.]*[aeɛioɔu])k\\.w" : "k.kw", // ˈVkwV -> ˈVkkwV
    "aS$" : "e", // aj$ collapse
    "m(\\.?ˈ?)n" : "n$1n", // mn -> nn
    "[ptkbdɡ](\\.?ˈ?)([ptk])" : "$2$1$2", // [C1 +stop][C2 +stop] -> C2C2
    "[ptkbdɡr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "vʲ" : "bʲ", // early palatal outcome
    "(?<=[aeoiuɛɔwj])(\\.?ˈ?)(.)ʲ?(?=\\2ʲ)" : "$2ʲ$1", // gemination of palatals
    "(?<=[aeoiuɛɔwj])(\\.?ˈ?)(.ʲ)" : "$2$1$2",
    "aw" : "o", // au -> o (later u in some cases)
    "sʲ(\\.ˈ?)sʲ" : "$1ʧ", // palatalization outcomes
    "sʲ" : "ʧ", // sporadically ʤ, annoyingly not always corresponding to Tuscan ʒ
    "([td])ʲ(?=\\.?ˈ?\\1ʲ)" : "$1",
    "kʲ(?=\\.?ˈ?kʲ)" : "t",
    "ɡʲ(?=\\.?ˈ?ɡʲ)" : "d",
    "tʲ" : "ʦ",
    "kʲ" : "ʧ",
    "s(\\.?ˈ?)[ʦʧ]" : "ʃ$1ʃ",
    "ɡʲ" : "ʤ",
    "(?<=^(ˈ?))dʲ" : "ʤ",
    "(?<=[aeoiuɛɔ]\\.ˈ?)[dɡ]?(?=\\.?ˈ?j)" : "j", 
    "(?<=[aeoiuɛɔ]\\.ˈ?)(\\.?ˈ?)j(?!\\.ˈ?j)" : "j$1j",
    "j(\\.?ˈ?)j" : "d$1ʤ",
    "(?<![^aeoiuɛɔwj]\\.?ˈ?)j" : "ʤ",
    "(?<=[^aeɛioɔu]\\.?ˈ?)dʲ" : "ʣ",
    "dʲ" : "ʤ", // sporadically, ʣ
    "nʲ" : "ɲ",
    "lʲ" : "ʎ",
    "rʲ" : "j",
    "ʲ(?=[^aeɛioɔu])" : "",
    "(?<=[aeɛioɔu])\\.(ˈ?)(.)ʲ(?=[aeɛioɔu])" : "$2.$1j",
    "(?<=[^aeɛioɔu])\\.(ˈ?)(.)ʲ(?=[aeɛioɔu])" : ".$1$2j",
    "ʲ|S" : "j",
    "t(?=\\.ˈ?r)" : "d", // tr -> dr
    "p(?=\\.ˈ?r)" : "b", // pr -> br
    "k(?=\\.ˈ?r)" : "ɡ", // cr -> gr
    "ɔ(?=n)" : "o", // prenasal raising 
    "o(?=[^\\.rs]?\\.ˈ[^r])" : "u", // pretonic o -> u, not before r or [s cluster]
    "e(?=[^\\.rs]?\\.ˈ[^r])" : "i", // pretonic e -> i, not before r or [s cluster]
    "[eɛ](?=n\\.?ˈ?[kɡ])" : "i", // anafonesi
    "[o](?=n\\.?ˈ?ɡ)" : "u", 
    "(?<=ˈ[^\\.]*)e(?=\\.?[ʎɲ])" : "i", 
    "(?<=ˈ?[^aeɛioɔu\\.ˈl])l" : "j", // Cl -> CCj
    "([^aeɛioɔu\\.ˈl])(\\.ˈ?)l" : "$1$2$1j",
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)jj" : "j", // Cjj -> Cj
    "v(?=\\.?ˈ?v?j)" : "b", // v(v)j -> b(b)j
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z", // intervocalic voicing of s 
    "^ˈ?s(?=[mnɡbdv])" : "z", // word-initial assimialtory voicing of s
    "(?<=[aeɛioɔu])\\.(ˈ?)([^aeɛioɔuˈjw])ɔ(?![^aeɛioɔu\\.])" : "$2.$1Wɔ", // breaking of ɔ
    "(?<=ˈ?[aeɛioɔu\\.ˈ]*)ɔ(?![^aeɛioɔu\\.])" : "Wɔ",
    "(?<=[aeɛioɔu])\\.(ˈ?)([^aeɛioɔuˈjwW])ɛ(?![^aeɛioɔu\\.])" : "$2.$1jɛ", // breaking of ɛ
    "(?<=ˈ?[aeɛioɔu\\.ˈ]*)ɛ(?![^aeɛioɔu\\.])" : "jɛ",
    "([wj])([wWj])" : "$1",
    "(?<=[ʃʤʧ]\\.?ˈ?)j" : "",
    "n(?=\\.?ˈ?[ɡk])" : "ŋ", // realization of ng 
    "(.)(?=\\1)" : "", // word-initial or non-whole-syllable degemination (phonetic only, still occurs phonemically but oh well)
}

const ital_after_ortho = {
    "W" : "w",
}

const ital_orthography = {
    "h" : "k",
    "θ" : "t",
    "ɸ" : "p",
    "ʰ" : "",
    "ŋ" : "n",
    "^ˈ(?!.*\\.)" : "",
    "ˈ([^aeoiuɛɔ]{0,3})([aeoiuɛɔ])" : "$1$2̀",
    "ˈ" : "",
    "\\." : "",
    "([eo])̀" : "$1́",
    "ɛ" : "e",
    "ɔ" : "o",
    "tʦ" : "zz",
    "dʣ" : "zz",
    "[ʦʣ]" : "z",
    "dʤ" : "gʤ",
    "ʃ+" : "sʧ",
    "ʒ+" : "zʤ",
    "z" : "s",
    "kw" : "qu",
    "[wW]" : "u",
    "j" : "i",
    "c+" : "chj",
    "ɟ+" : "ghj",
    "ʤ(?=[ei])" : "g",
    "ʤ" : "gi",
    "ʧ(?=[ei])" : "c",
    "ʧ" : "ci",
    "ɡ(?=[ei])" : "gh",
    "ɡ" : "g",
    "k(?=[ei])" : "ch",
    "k" : "c",
    "ʎ+(?=i)" : "gl",
    "ʎ+" : "gli",
    "ɲ+" : "gn",
}

const tusc_firstpass = {
    "β" : "v", // β -> v
    "(?<=ˈ[^\\.]*\\.[^\\.]*)u$" : "ʊ", // word-final u -> ʊ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "S", // Ṿs -> Ṿj / _#
    "iS$" : "i",
    "[ɪe]S$" : "e",
    "ʊS$" : "ʊ",
    "[^aeɛiɪoɔuʊjwn]$" : "",
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "^[ɛe]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "([kɡ])(?=\\.?ˈ?[eɛi])" : "$1ʲ", // palatalization of k g
    "(?<=ˈ[^\\.]*[aeɛioɔu])k\\.w" : "k.kw", // ˈVkwV -> ˈVkkwV    "aj$" : "e",
    "aS$" : "e", // aj$ collapse
    "m(\\.?ˈ?)n" : "n$1n", // mn -> nn
    "[ptkbdɡ](\\.?ˈ?)([ptk])" : "$2$1$2", // [C1 +stop][C2 +stop] -> C2C2
    "[ptkbdɡr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "vʲ" : "bʲ", // early palatal outcome
    "(?<=[aeoiuɛɔwj])(\\.?ˈ?)(.)ʲ?(?=\\2ʲ)" : "$2ʲ$1", // gemination of palatals
    "(?<=[aeoiuɛɔwj])(\\.?ˈ?)(.ʲ)" : "$2$1$2",
    "aw" : "o", // au -> o (later u in some cases)
    "sʲ?(\\.?ˈ?)[tk]ʲ" : "sʲ$1sʲ", // palatalization outcomes 
    "sʲ?(\\.?ˈ?)[dɡ]ʲ" : "ʒ$1ʒ",
    "(?<=[aeɛioɔu])sʲ" : "ʃ", // sporadically ʒ
    "(?<=ʃ\\.?ˈ?)sʲ" : "ʃ",
    "sʲ" : "ʃ",
    "([td])ʲ(?=\\.?ˈ?\\1ʲ)" : "$1",
    "kʲ(?=\\.?ˈ?kʲ)" : "t",
    "ɡʲ(?=\\.?ˈ?ɡʲ)" : "d",
    "tʲ" : "ʦ",
    "kʲ" : "ʧ",
    "ɡʲ" : "ʤ",
    "(?<=^(ˈ?))dʲ" : "ʤ",
    "(?<=[aeoiuɛɔ]\\.ˈ?)[dɡ]?(?=\\.?ˈ?j)" : "j", 
    "(?<=[aeoiuɛɔ]\\.ˈ?)(\\.?ˈ?)j(?!\\.ˈ?j)" : "j$1j",
    "j(\\.?ˈ?)j" : "d$1ʤ",
    "(?<![^aeoiuɛɔwj]\\.?ˈ?)j" : "ʤ",
    "(?<=[^aeɛioɔu]\\.?ˈ?)dʲ" : "ʣ",
    "dʲ" : "ʤ", // sporadically, ʣ
    "nʲ" : "ɲ",
    "lʲ" : "ʎ",
    "rʲ" : "j",
    "ʲ(?=[^aeɛioɔu])" : "",
    "(?<=[aeɛioɔu])\\.(ˈ?)(.)ʲ(?=[aeɛioɔu])" : "$2.$1j",
    "(?<=[^aeɛioɔu])\\.(ˈ?)(.)ʲ(?=[aeɛioɔu])" : ".$1$2j",
    "ʲ|S" : "j",
    "t(?=\\.ˈ?r)" : "d", // tr -> dr
    "p(?=\\.ˈ?r)" : "b", // pr -> br
    "k(?=\\.ˈ?r)" : "ɡ", // cr -> gr
    "([ʧʤʃʒ])j" : "ʤ", // j is not realized after postalveolars
    "ɔ(?=n)" : "o", // prenasal raising 
    "o(?=[^\\.rs]?\\.ˈ[^r])" : "u", // pretonic o -> u, not before r or [s cluster]
    "e(?=[^\\.rs]?\\.ˈ[^r])" : "i", // pretonic e -> i, not before r or [s cluster]
    "[eɛ](?=n\\.?ˈ?[kɡ])" : "i", // anafonesi
    "[o](?=n\\.?ˈ?ɡ)" : "u", 
    "(?<=ˈ[^\\.]*)e(?=\\.?[ʎɲ])" : "i", 
    "(?<=ˈ?[^aeɛioɔu\\.ˈl])l" : "j", // Cl -> CCj
    "([^aeɛioɔu\\.ˈl])(\\.ˈ?)l" : "$1$2$1j",
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)jj" : "j", // Cjj -> Cj
    "v(?=\\.?ˈ?v?j)" : "b", // v(v)j -> b(b)j
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z", // intervocalic voicing of s 
    "^ˈ?s(?=[mnɡbdv])" : "z", // word-initial assimialtory voicing of s
    "n(?=\\.?ˈ?[ɡk])" : "ŋ", // realization of ng 
    "(.)(?=\\1)" : "", // word-initial or non-whole-syllable degemination (phonetic only, still occurs phonemically but oh well)
}

const tusc_assverb = /(?<=[eia])\.re$/g

const tusc_after_ortho = {
    "(?<=[aeɛioɔu])d\\.(ˈ?)ʤ(?=[aeɛioɔu])" : "ʒ.$1ʒ", // intervocalic deaffrication of ʧ, ʤ
    "(?<=[aeɛioɔu])t\\.(ˈ?)ʧ(?=[aeɛioɔu])" : "ʃ.$1ʃ",
    "(?<=[aeɛioɔu]\\.ˈ?)ʤ(?=[aeɛioɔu])" : "ʒ",
    "(?<=[aeɛioɔu]\\.ˈ?)ʧ(?=[aeɛioɔu])" : "ʃ",
    "(?<=[rln]\\.?ˈ?)s" : "ʦ", // affrication of s after r, l, n
    "(?<=[aeɛioɔu])([ptk])\\.ˈ\\1" : "∅$1.ˈ$1ʰ", // Tuscan gorgia
    "(?<=[aeɛioɔu]\\.ˈ?)k" : "h",
    "(?<=[aeɛioɔu]\\.ˈ?)t" : "θ",
    "(?<=[aeɛioɔu]\\.ˈ?)p" : "ɸ",
    "∅" : "",
}

const cors_firstpass = {
    "β" : "v", // β -> v
    "(?<=ˈ[^\\.]*\\.[^\\.]*)u$" : "ʊ", // word-final u -> ʊ
    "(?<=[aeɛiɪoɔuʊjw])s$" : "S", // Ṿs -> Ṿj / _#
    "iS$" : "i",
    "(?<=ˈ[^\\.]*)[ɪe]S$" : "ɛ",
    "[ɪe]S$" : "e",
    "ɛS$" : "eS",
    "ʊS$" : "ʊ",
    "[^aeɛiɪoɔuʊjwn]$" : "",
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "o$" : "u",
    "^[ɛe]s\\.(ˈ?)" : "$1s", // reversal of proto-romance *įsC
    "([kɡ])(?=\\.?ˈ?[eɛi])" : "$1ʲ", // palatalization of k g
    "(?<=ˈ[^\\.]*[aeɛioɔu])k\\.w" : "k.kw", // ˈVkwV -> ˈVkkwV
    "aS$" : "e", // aj$ collapse
    "m(\\.?ˈ?)n" : "n$1n", // mn -> nn
    "[ptkbdɡ](\\.?ˈ?)([ptk])" : "$2$1$2", // [C1 +stop][C2 +stop] -> C2C2
    "[ptkbdɡr](\\.?ˈ?)s" : "s$1s", // [C +stop]s, rs -> ss
    "vʲ" : "bʲ", // early palatal outcome
    "(?<=[aeoiuɛɔwj])(\\.?ˈ?)(.)ʲ?(?=\\2ʲ)" : "$2ʲ$1", // gemination of palatals
    "(?<=[aeoiuɛɔwj])(\\.?ˈ?)(.ʲ)" : "$2$1$2",
    "aw" : "a", // au -> a [in some Corsican dialects, this is o (later u in some cases) as in Tuscan]
    "sʲ?(\\.?ˈ?)[tk]ʲ" : "sʲ$1sʲ", // palatalization outcomes 
    "sʲ?(\\.?ˈ?)[dɡ]ʲ" : "ʒ$1ʒ", 
    "(?<=[aeɛioɔu])sʲ" : "ʃ", // sporadically ʒ
    "(?<=ʃ\\.?ˈ?)sʲ" : "ʃ",
    "sʲ" : "ʃ",
    "([td])ʲ(?=\\.?ˈ?\\1ʲ)" : "$1",
    "kʲ(?=\\.?ˈ?kʲ)" : "t",
    "ɡʲ(?=\\.?ˈ?ɡʲ)" : "d",
    "tʲ" : "ʦ",
    "kʲ" : "ʧ",
    "ɡʲ" : "ʤ",
    "(?<=^(ˈ?))dʲ" : "ʤ",
    "(?<=[aeoiuɛɔ]\\.ˈ?)[dɡ]?(?=\\.?ˈ?j)" : "j", 
    "(?<=[aeoiuɛɔ]\\.ˈ?)(\\.?ˈ?)j(?!\\.ˈ?j)" : "j$1j",
    "j(\\.?ˈ?)j" : "d$1ʤ",
    "(?<![^aeoiuɛɔwj]\\.?ˈ?)j" : "ʤ",
    "(?<=[^aeɛioɔu]\\.?ˈ?   )dʲ" : "ʣ",
    "dʲ" : "ʤ", // sporadically, ʣ
    "nʲ" : "ɲ",
    "lʲ" : "ʎ",
    "rʲ" : "j",
    "ʲ(?=[^aeɛioɔu])" : "",
    "(?<=[aeɛioɔu])\\.(ˈ?)(.)ʲ(?=[aeɛioɔu])" : "$2.$1j",
    "(?<=[^aeɛioɔu])\\.(ˈ?)(.)ʲ(?=[aeɛioɔu])" : ".$1$2j",
    "ʲ|S" : "j",
    "t(?=\\.ˈ?r)" : "d", // tr -> dr
    "p(?=\\.ˈ?r)" : "b", // pr -> br
    "k(?=\\.ˈ?r)" : "ɡ", // cr -> gr
    "([ʧʤʃʒ])j" : "ʤ", // j is not realized after postalveolars
    "[ɛe](?=r)" : "a", // ɛ, e -> a / _rC, _r#
    "ɔ(?=n)" : "o", // prenasal raising 
    "o(?=[^\\.rs]?\\.ˈ[^r])" : "u", // pretonic o -> u, not before r or [s cluster]
    "e(?=[^\\.rs]?\\.ˈ[^r])" : "i", // pretonic e -> i, not before r or [s cluster]
    "[eɛ](?=n\\.?ˈ?[kɡ])" : "i", // anafonesi
    "[o](?=n\\.?ˈ?ɡ)" : "u", 
    "(?<=ˈ[^\\.]*)e(?=\\.?[ʎɲ])" : "i", 
    "(?<!ˈ[^\\.]*)o" : "u", // corsican raising
    "(?<=ˈ?[^aeɛioɔu\\.ˈl])l" : "j", // Cl -> CCj
    "([^aeɛioɔu\\.ˈl])(\\.ˈ?)l" : "$1$2$1j",
    "(?<=[^aeɛioɔu\\.ˈ]\\.?ˈ?)jj" : "j", // Cjj -> Cj
    "v(?=\\.?ˈ?v?j)" : "b", // v(v)j -> b(b)j
    "(?<=[aeɛioɔu]\\.ˈ?)s(?=[aeɛioɔu])" : "z", // intervocalic voicing of s 
    "^ˈ?s(?=[mnɡbdv])" : "z", // word-initial assimialtory voicing of s
    "([ɡk])\\.(ˈ?)\\1j" : "$1.$2j", // new palatalization of c, g
    "k(\\.?ˈ?)j(?=[^aeɛioɔu])" : "c$1", 
    "ɡ(\\.?ˈ?)j(?=[^aeɛioɔu])" : "ɟ$1",
    "k(\\.?ˈ?)j" : "$1c", 
    "ɡ(\\.?ˈ?)j" : "$1ɟ",
    "dʤ(?=[^aeɛioɔu])" : "ɟ", 
    "d(\\.ˈ?)ʤ(?=[^aeɛioɔu])" : "ɟ$1", 
    "d(\\.ˈ?)ʤ" : "$1ɟ", 
    "^ʤ" : "ɟ",
    "n(?=\\.?ˈ?[ɡk])" : "ŋ", // realization of ng 
    "(.)(?=\\1)" : "", // word-initial or non-whole-syllable degemination (phonetic only, still occurs phonemically but oh well)
    "e" : "ɛ", // metaphony
    "o" : "ɔ",
    "ɛ(?=[^\\.]*\\.[^\\.]*[iu])" : "e",
    "ɔ(?=[^\\.]*\\.[^\\.]*[iu])" : "o",
}

const cors_assverb = {
    "ˈ([^\\.]*)i\\.rɛ$" : "X$1ɛ", // -ˈire -> -e
    "\\.([^\\.]*[aeɛioɔu])([^\\.]*\\.)X" : ".ˈ$1$2",
    "^([^\\.]*[aeɛioɔu])([^\\.]*\\.)X" : "ˈ$1$2",
    "X" : "ˈ", // this should never happen but whatever
    "(?<=[ɛa])\\.rɛ$" : "", // -Vre -> -Vr
}

const cors_after_ortho = {
    "(?<=[aeɛioɔu]\\.ˈ?)p(?=[aeɛioɔu])" : "b", // lenition
    "(?<=[aeɛioɔu]\\.ˈ?)t(?=[aeɛioɔu])" : "d",
    "(?<=[aeɛioɔu]\\.ˈ?)ʧ(?=[aeɛioɔu])" : "ʤ",
    "(?<=[aeɛioɔu]\\.ˈ?)k(?=[aeɛioɔu])" : "ɡ",
    "(?<=[aeɛioɔu])(\\.?ˈ?)([nmŋ])" : "̃$1$2", // vowel nasalization
}

//Old Gallo-Romance
const ogall_firstpass = {
    "ɪ" : "e", // Vowel collapse
    "ʊ" : "o",
    "(?<=[aeoiuɛɔɪʊwj])(\\.?ˈ?)kʲ" : "k$1kʲ", // gemination of kj
    "([kɡ])(?=\\.?ˈ?[eɛi])" : "$1ʲ", // palatalization of k g
    "β": "v",
    "[kt]ʲ": "ʦʲ",
    "[dɡ]ʲ": "j", // TODO: divergent dj gj?
    "k(\\.?ˈ?)l": "$1ʎ", // /ɡl/ and /kl/ become /ʎ/
    "k(\\.?ˈ?)([ts])": "j$1$2", // /kt/ > /jt/ and /ks/ > /js/
    "(?<=[ieɛaɔou]\\.?ˈ?)[fb](?=ʲ?[aeɛioɔur])": "v", // intervocalic lenition
    "(?<=[ieɛaɔou]\\.?ˈ?)d(?=[aeɛioɔur])": "ð",
    "(?<=[ieɛaɔou]\\.?ˈ?)s(?=ʲ?[aeɛioɔur])": "z",
    "(?<=[ieɛaɔou]\\.?ˈ?)g(?=aeɛioɔur])": "ɣ",
    "(?<=[ieɛaɔou]\\.?ˈ?)p(?=ʲ?[aeɛioɔur])": "b",
    "(?<=[ieɛaɔou]\\.?ˈ?)t(?=[aeɛioɔur])": "d",
    "(?<=[ieɛaɔou]\\.?ˈ?)ʦ(?=ʲ?[aeɛioɔur])": "ʣ",
    "(?<=[ieɛaɔou]\\.?ˈ?)k(?=[aeɛioɔur])": "g",
    // TODO: give option to put loss of intertonic non-a vowel here
    "e(?=[^ieɛaɔou]*[ij])": "i", // Vowels /e/ and /o/ are raised to /i/ and /u/, when preceding a syllable containing /i/ or /j/
    "o(?=[^ieɛaɔou]*[ij])": "u",
}   

// Early Old French
const eofren_firstpass = {
    "(?<=ˈ[^ieɛaɔou])([ieɛaɔou])(?![̂\\.].)" : "$1ː", // vowels lengthen in stressed open syllables
    "(?<=ˈ[^ieɛaɔou])([ieɛaɔou])j" : "$1ːj", // vowels lengthen in closed syllables with a final palatalized consonant
    "(?<=ˈ[^ieɛaɔou])([ieɛaɔou])(?=[^ieɛaɔou]+ʲ)" : "$1ː",
    "ɛː": "ie̯", // Diphthongization of open-mid vowels /ɛː, ɔː/
    "ɔː": "uo̯",
    "(?<=[ieɛaɔouː̯]\\.?ˈ?)b(?=ʲ?[aeɛioɔur])": "v", // intervocalic lenition
    "(?<=[ieɛaɔouː̯]\\.?ˈ?)d(?=[aeɛioɔur])": "ð",
    "(?<=[ieɛaɔouː̯]\\.?ˈ?)g(?=[aeɛioɔur])": "ɣ",
    // TODO: progressive assimilation after [j, β, b]
    "k(\\.?ˈ?)ka": "t$1ʧa",
    "g(\\.?ˈ?)ga": "d$1ʤa",
    "ka": "ʧa", // palatalization before a
    "ga": "ʤa",
    "(?<=[ieɛa]ː?̯?\\.?ˈ?)ɣa": "ja",
    // TODO: [ɣ] also becomes a palatal glide [i̯] in the suffixes -īcum and -(i)ācum
    "j(\\.?ˈ?)([tdr])": "$1$2ʲ", // Where intertonic vowel loss had brought [j] into contact with following [d r t n], it palatalized them
    "j(\\.?ˈ?)n": "$1ɲ",
    "[pf]ʲ": "ʧ", // palatalization of labials
    "[bv]ʲ": "ʤ",
    "mʲ": "nʤ",
    "(?<![ieɛaɔouː̯](\\.?ˈ?))j": "ʤ", // fortition of j
    // TODO: Morphemic [-arʲ-] in inherited words becomes [-ie̯r-] instead of [-ajr-]
    "(?<=[ieɛaɔouː])s(\\.?ˈ?)sʲ": "js$1sʲ", // The glide j develops between a vowel and a following palatalized consonant in some cases
    "(?<=[ieɛaɔouː])(\\.?ˈ?[zʣ])ʲ": "j$1ʲ",
    "(?<=[ieɛaɔouː])ɲ": "jɲ",
    "ː(?=[wj])": "",
    "eː": "ej", // vowel changes
    "oː": "ow",
    "aː(?!mnɲŋ)": "æː",
    "(?<=[jʲʧʤ])aː": "ie̯",
    "aː": "aj",
    "u(?!o|̯)": "y",
    "a(\\.?ˈ?)w": "ɔ",
    "(?<=[jʲʧʤ])ai̯": "i",
    "(?<=[jʲʧʤ])ei̯": "i",
    "ie̯j": "i",
    "uo̯j": "uj",
    // TODO: n unstressed final syllables, all vowels except /a/ are lost, unless this loss would result in an impermissible final cluster. In that case, the vowel is retained as [ə]
    "(?<=[ieɛaɔouː̯]\\.?ˈ?)ʣ(?=ʲ?[aeɛioɔur])": "z", // deaffrication of dz
    "([^ieɛaɔoy])(\\.ˈ?)\\1": "$2$1", // degemination 
    "t(\\.?ˈ?)([ʦʧ])": "$1$2",
    "d(\\.?ˈ?)([ʣʤ])": "$1$2",
}  

function syllabify(input, vowels) {
    const v_regex = "([" + vowels + "][ː̯]?)"
    const v_regex_exclusive = "(?=[" + vowels + "])(?!.̯)"
    const c_regex_unwrapped = "[^" + vowels + "\\.ː̯ʰʷ][ʷʰ]?";
    const c_regex = "(" + c_regex_unwrapped + ")"
    return input.replace(new RegExp(v_regex + "([pbtdkg]ʰ?)([lr])(?=.)", "g"), "$1.$2$3").replace(new RegExp(v_regex + c_regex + c_regex + "(?!" + c_regex + "*$)", "g"), "$1$2.$3").replace(new RegExp(v_regex + "(?=" + c_regex_unwrapped + "[" + vowels + "])", "g"), "$1.").replace(new RegExp(v_regex + v_regex_exclusive + "(?!̯)", "g"), "$1.");
}

function latinate_stress(input) {
    ret = input;
    if (input.split(".").length - 1 <= 1) {
        // One or two syllables, stress the primary
        ret = "ˈ" + input;
    } else {
        if (/[^aeoiuyɛɔɪʊʏ]\.(?!.*\.)/.test(input)) {
            // Penult is heavy, stress the penult
            ret = ("." + input).replace(/(\.)(?!.*\..*\.)/, "ˈ$1");
        } else {
            // Penult is liteweit, stress the antepenult
            ret = ("." + input).replace(/(\.)(?!.*\..*\..*\.)/, "ˈ$1");
        }
    }

    ret = ret.replace("ˈ.", ".ˈ");
    if (ret.startsWith(".")) {
        return ret.substring(1);
    }
    return ret;
}

// Test against each key(pattern)-value pair individually
// Technically since 2015 the order is guaranteed to be the insertion order
// However, we probably should't rely on it
// If the string matches the pattern, the part of it that matches gets replaced by the value
String.prototype.evolve = function (rules) {
    var result = this;
    for (const [key, value] of Object.entries(rules)) {
        result = result.replace(new RegExp(key, "g"), value);
        // console.log(result + "\n" + key + "\n" + value + "\n\n");
    }
    return result;
}


function submit(latin_input) {
    // Phoneticize Latin
    latin = String(latin_input).toLowerCase().trim().replace(/\s/g, "-");
    latin_phonetic = latin;
    latin_phonetic = latin_phonetic.evolve(latin_firstpass);
    latin_phonetic = latin_phonetic.evolve(latin_secondpass);
    
    latin_phonetic = latin_phonetic.evolve(latin_thirdpass);
    latin_phonetic = syllabify(latin_phonetic, "aeoiuyɛɔɪʊʏ");
    latin_phonetic = latin_phonetic.evolve(latin_fourthpass);

    latin_phonetic = latinate_stress(latin_phonetic);

    $("#latinphon").val(latin_phonetic);

    // Evolve to Proto-Romance
    proto_phonetic = latin_phonetic;

    if ($("#early-monophthongs").is(":checked")) {
        proto_phonetic = proto_phonetic.evolve(optional_early_monophthongs);
    }

    proto_phonetic = proto_phonetic.evolve(proto_firstpass);
    
    if ($("#v-deletion").is(":checked")) {
        proto_phonetic = proto_phonetic.replace(optional_v_deletion, "");
    }
    
    if ($("#always-syncope").is(":checked")) {
        if ($("#assverb").is(":checked")) { 
            proto_phonetic = proto_phonetic.replace(syncope_assverb, "E");
        }
        proto_phonetic .evolve(optional_syncope);
        $("#syncope").prop("checked", true);
    } else if ($("#syncope").is(":checked")) {
        if ($("#assverb").is(":checked")) { 
            proto_phonetic = proto_phonetic.replace(syncope_assverb, "E");
        }
        proto_phonetic = proto_phonetic.evolve(default_syncope);
    }
    if ($("#av-au").is(":checked")) { 
        proto_phonetic = proto_phonetic.replace(av, au);
    }
    if ($("#rsss").is(":checked")) { 
        proto_phonetic = proto_phonetic.replace(rsss_regex, "s");
    }
    proto_phonetic = proto_phonetic.evolve(proto_secondpass);

    proto = proto_phonetic;
    proto = proto.evolve(proto_orthography);

    $("#proto").val(proto);
    $("#proto_phon").val(proto_phonetic);

    // Evolve to Logudorese Sardinian
    logu_phonetic = proto_phonetic;
    if ($("#assverb").is(":checked")) { 
        logu_phonetic = logu_phonetic.replace(sard_assverbs, "ˈ$1.$2e.re");
    }
    logu_phonetic = logu_phonetic.evolve(logu_firstpass);
    logu = logu_phonetic;
    logu = logu.evolve(sard_orthography);
    logu_phonetic = logu_phonetic.evolve(sard_finish);

    $("#logu_phon").val(logu_phonetic);
    $("#logu").val(logu);

    // Evolve to Nuorese Sardinian
    nuor_phonetic = proto_phonetic;
    if ($("#assverb").is(":checked")) { 
        nuor_phonetic = nuor_phonetic.replace(sard_assverbs, "ˈ$1.$2e.re");
    }
    nuor_phonetic = nuor_phonetic.evolve(nuor_firstpass);
    nuor = nuor_phonetic;
    nuor = nuor.evolve(sard_orthography);
    nuor_phonetic = nuor_phonetic.evolve(sard_finish);

    $("#nuor_phon").val(nuor_phonetic);
    $("#nuor").val(nuor);

    // Evolve to Campidanese Sardinian
    camp_phonetic = proto_phonetic;
    if ($("#assverb").is(":checked")) { 
        camp_phonetic = camp_phonetic.replace(sard_assverbs, "ˈ$1.$2e.re");
    }
    camp_phonetic = camp_phonetic.evolve(camp_firstpass);
    if ($("#assverb").is(":checked")) {
        camp_phonetic = camp_phonetic.evolve(camp_verbs);
    }
    camp = camp_phonetic;
    camp = camp.evolve(sard_orthography);
    camp_phonetic = camp_phonetic.evolve(sard_finish);

    $("#camp_phon").val(camp_phonetic);
    $("#camp").val(camp);

    // Evolve to African
    afri_phonetic = proto_phonetic;
    afri_phonetic = afri_phonetic.evolve(afri_firstpass);
    afri = latin;
    afri = afri.evolve(latin_firstpass);
    afri = afri.evolve(afri_orthography);

    $("#afri_phon").val(afri_phonetic);
    $("#afri").val(afri);

    // Evolve to Proto-Romanian
    proma_phonetic = proto_phonetic;
    proma_phonetic = proma_phonetic.evolve(proma_firstpass);
    proma = proma_phonetic;
    proma = proma.evolve(proma_orthography);

    $("#proma_phon").val(proma_phonetic);
    $("#proma").val(proma);

    // Evolve to Romanian
    roma_phonetic = proma_phonetic;
    roma_phonetic = roma_phonetic.evolve(roma_firstpass);
    if ($("#assverb").is(":checked")) { 
        roma_phonetic = roma_phonetic.evolve(roma_assverb);
    }
    roma_phonetic = roma_phonetic.evolve(roma_secondpass);
    roma = roma_phonetic;
    roma = roma.evolve(roma_orthography);

    $("#roma_phon").val(roma_phonetic);
    $("#roma").val(roma);

    // Evolve to Aromanian
    arom_phonetic = proma_phonetic;
    arom_phonetic = arom_phonetic.evolve(arom_firstpass);
    arom = arom_phonetic;
    arom = arom.evolve(arom_orthography);

    $("#arom_phon").val(arom_phonetic);
    $("#arom").val(arom);

    // Evolve to Meglo-Romanian
    megl_phonetic = proma_phonetic;
    megl_phonetic = megl_phonetic.evolve(megl_firstpass);
    megl = megl_phonetic;
    megl = megl.evolve(megl_orthography);

    $("#megl_phon").val(megl_phonetic);
    $("#megl").val(megl);

    // Evolve to Istro-Romanian
    istr1245_phonetic = proma_phonetic;
    istr1245_phonetic = istr1245_phonetic.evolve(istr1245_firstpass);
    if ($("#assverb").is(":checked")) { 
        istr1245_phonetic = istr1245_phonetic.evolve(istr1245_assverb);
    }
    istr1245 = istr1245_phonetic;
    istr1245 = istr1245.evolve(istr1245_orthography);

    $("#istr1245_phon").val(istr1245_phonetic);
    $("#istr1245").val(istr1245);

    // Evolve to Dalmatian
    dalm_phonetic = proto_phonetic;
    dalm_phonetic = dalm_phonetic.evolve(dalm_firstpass);
    if ($("#assverb").is(":checked")) { 
        dalm_phonetic = dalm_phonetic.evolve(dalm_assverb);
    }
    dalm_phonetic = dalm_phonetic.evolve(dalm_secondpass);
    dalm = dalm_phonetic;
    dalm = dalm.evolve(dalm_orthography);

    $("#dalm_phon").val(dalm_phonetic);
    $("#dalm").val(dalm);

    // Evolve to Venetian
    vene_phonetic = proto_phonetic;
    vene_phonetic = vene_phonetic.evolve(vene_firstpass);
    vene_cent_phonetic = vene_phonetic;
    if ($("#assverb").is(":checked")) { 
        vene_phonetic = vene_phonetic.evolve(vene_assverb);
        vene_cent_phonetic = vene_cent_phonetic.evolve(vene_central_assverb);
    }
    vene_cent_phonetic = vene_cent_phonetic.evolve(vene_central_pass);
    vene_bell_phonetic = vene_phonetic.evolve(vene_belluno_pass);
    vene_veni_phonetic = vene_phonetic.evolve(vene_venice_pass);
    vene_cent = vene_cent_phonetic.evolve(vene_orthography);
    vene_bell = vene_bell_phonetic.evolve(vene_orthography);
    vene_veni = vene_veni_phonetic.evolve(vene_orthography);
    vene_veni_phonetic = vene_veni_phonetic.evolve(vene_delete_elided_l);
    vene_cent_phonetic = vene_cent_phonetic.evolve(vene_delete_elided_l);

    $("#vene_veni_phon").val(vene_veni_phonetic);
    $("#vene_veni").val(vene_veni);
    $("#vene_cent_phon").val(vene_cent_phonetic);
    $("#vene_cent").val(vene_cent);
    $("#vene_bell_phon").val(vene_bell_phonetic);
    $("#vene_bell").val(vene_bell);

    // Evolve to Istrian
    istr1244_phonetic = proto_phonetic;
    istr1244_phonetic = istr1244_phonetic.evolve(istr1244_firstpass);
    istr1244 = istr1244_phonetic;
    istr1244 = istr1244.evolve(istr1244_orthography);

    $("#istr1244_phon").val(istr1244_phonetic);
    $("#istr1244").val(istr1244);

    // Evolve to Standard Italian
    ital_phonetic = proto_phonetic;
    ital_phonetic = ital_phonetic.evolve(ital_firstpass);
    ital = ital_phonetic.evolve(ital_orthography);
    ital_phonetic = ital_phonetic.evolve(ital_after_ortho);

    $("#ital_phon").val(ital_phonetic);
    $("#ital").val(ital);

    // Evolve to Tuscan
    tusc_phonetic = proto_phonetic;
    tusc_phonetic = tusc_phonetic.evolve(tusc_firstpass);
    if ($("#assverb").is(":checked")) { 
        tusc_phonetic = tusc_phonetic.replace(tusc_assverb, "");
    }
    tusc = tusc_phonetic.evolve(ital_orthography);
    tusc_phonetic = tusc_phonetic.evolve(tusc_after_ortho);

    $("#tusc_phon").val(tusc_phonetic);
    $("#tusc").val(tusc);

    // Evolve to Corsican
    cors_phonetic = proto_phonetic;
    cors_phonetic = cors_phonetic.evolve(cors_firstpass);
    if ($("#assverb").is(":checked")) { 
        cors_phonetic = cors_phonetic.evolve(cors_assverb);
    }
    cors = cors_phonetic.evolve(ital_orthography);
    cors_phonetic = cors_phonetic.evolve(cors_after_ortho);

    $("#cors_phon").val(cors_phonetic);
    $("#cors").val(cors);
    
    // Evolve to Old Gallo-Romance
    ogall_phonetic = proto_phonetic;
    ogall_phonetic = ogall_phonetic.evolve(ogall_firstpass);
    ogall = ogall_phonetic;
    //ogall = ogall.evolve(ogall_orthography);

    $("#ogall_phon").val(ogall_phonetic);
    $("#ogall").val(ogall);
}