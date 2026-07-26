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

// eboracum -> joracu somehow

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

//TODO: FIX SYNCOPE!! ALSO SYLLABIFICATION WITH KL???
//TODO: rubeum doesn't work in proto-romanian (doesn't lower u to o)
//TODO: degemination still doesn't work in words like equa -> iapa??!?!
//TODO: the word terra gets incorrectly syllabified at some point preventing it breaking into țeară
//TODO: lingua -/> limbă, instead to linbă

const optional_syncope = {
    "^(.)" : "S$1",
    "([ɛː]r)ɛ$" : "$1E$",
    "(?<![Sˈ][^\\.]*)([^aeoiuɛɔɪʊ\\.ˈ̃ː̯]\\.?)[eoiuɛɔɪʊ](\\.?ˈ?[^aeoiuɛɔɪʊ\\.ˈ̃ː̯])([^\\.]*)([aeoiuɛɔɪʊ])(?!E?$)" : "$1$2$3$4",
    "t(\\.?)l" : "k$1l",
    "S" : "",
    "E" : "ɛ"
}

const default_syncope = {
    "^(.)" : "S$1",
    "([ɛː]r)ɛ$" : "$1E$",
    "(?<![Sˈ][^\\.]*)([lr]\\.?)[eoiuɛɔɪʊ](\\.?ˈ?[^aeoiuɛɔɪʊ\\.ˈ̃ː̯])([^\\.]*)([aeoiuɛɔɪʊ])(?!$)" : "$1$2$3$4",
    "(?<![Sˈ][^\\.]*)([^aeoiuɛɔɪʊ\\.ˈ̃ː̯]\\.?)[eoiuɛɔɪʊ](\\.?ˈ?[lr])([^\\.]*)([aeoiuɛɔɪʊ])(?!E?$)" : "$1$2$3$4",
    "t(\\.?)l" : "k$1l",
    "S" : "",
    "E" : "ɛ"
}
const av = /a\.β\./g;
const au = "au̯.";

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
    "(?<=[aeoiuɛɔɪʊ])\\.k\\.w(ˈ?)j" : "k.$1j", // kwj -> kj
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
}

const proto_orthography = {
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
    "ɾ(\\.?ˈ?)ɾ" : "$1r", // r
    "([^aeɛioɔu]*)([aeɛioɔu])\\.(ˈ?)\\2" : "$3$1$2", // V.V -> V
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
    "(?<=[eo])̀" : "́",
    "ɳɳ" : "nd",
    "ɳ" : "n",
    "[eɛ]" : "e",
    "[oɔ]" : "o",
    "\\." : "",
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
    "j" : "ʒ", // j -> ʒ
    "(?<=[aeiou])s$" : "j", // Ṿs -> Ṿj / _#
    "[^aeɛiɪoɔuʊjw]$" : "",
    "ɪ" : "e",
    "ɔ" : "o",
    "(?<=ˈ[^\\.]*)ʊ(?=[mb])" : "o", // Latin stressed short u -> PRi *o / _m, _b
    "ʊ" : "u",
    "(?<=[kɡ]\\.?ˈ?)w(?=[eiɛ])" : "", // Velarization of labiovelars before front vowels
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
    "[tk]ʲ(?=[uo]$)" : "ʦ", //  palatalization outcomes
    "[tk]ʲ(?=[uo])" : "ʧ",
    "[tk]ʲ" : "ʦ",
    "βʲ" : "b",
    "sʲ" : "ʃ",
    "(?<=^ˈ?)dʲ" : "j",
    "dʲ" : "ʣ",
    "nʲ" : "ɲ",
    "lʲ" : "ʎ",
    "(?<=[aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : "$2.$1j",
    "(?<=[^aeɛiou])\\.(ˈ?)(.)ʲ(?=[aeɛiou])" : ".$1$2j",
    "ʲ" : "j",
    "(?<=[kɡ]\\.?ˈ?)l" : "ʎ", // cl/gl palatalization
    "ɛ" : "je", // ɛ-opening
    "\\.(ˈ?)([^aeiou\\.ˈ])j" : "$2.$1j",
    "(?<=[aeiou]\\.ˈ?)l(?=[aeiou])" : "r", // rhotacism of intervocalic single l
    "(?<!ˈ[^\\.]*)a" : "ə", // a -> ə except when stressed or at the start of a word
    "^ə" : "a", 
    "(?<!ˈ[^\\.]*)o" : "u", // o -> u except when stressed
    "a(?=n$)|a(?=\\.?n\\.?[^n\\.])|a(?=m\\.?[^aeiouə])" : "ə", // a -> ə when before n, but not nn, or a consonant cluster starting with m
    "e(?=n$)|e(?=\\.?n\\.?ˈ?[^n\\.])|(?<=[mnɲ]\\.?ˈ?)e(?=\\.?ˈ?m)" : "I", // e -> i when before n (but not nn) or before m and after a nasal. note that using I here is to avoid it palatalizing :3
    "o(?=n$)|o(?=\\.?n\\.?ˈ?[^n\\.])|(?<=[mnɲ]\\.?ˈ?)o(?=\\.?ˈ?m)" : "u", // o -> u when before n (but not nn) or before m and after a nasal
    "([^aeiou\\.ˈ])\\.(ˈ?)\\1(?=([^aeiou]))" : "$1.$2", // degemination
    "([^aeiou\\.ˈ])\\.(ˈ?)\\1" : ".$2$1",
    "(.)(?=\\1)" : "",
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
    "o(?=[^\\.]*\\.[^\\.][aeə])" : "wa", // o-breaking
    "e(?=[^\\.]*\\.[^\\.][aə])" : "ja", // e-breaking
    "I" : "i", //returning I to normal
    "([aeiou])\\.(ˈ?)([^aeiou])([wj])" : "$1$3.$2$4",
    "(.)\\1" : "$1", // i'm lazy so... double degemination!!!! {no. i don't know why the fuck i have to do this random workaround and then degeminate ones with no syllable break twice. it's the only way it works for some reason.}
    "([^aeiou\\.ˈ])\\.(ˈ?)\\1(?=([^aeiou]))" : "$1.$2", 
    "([^aeiou\\.ˈ])\\.(ˈ?)\\1" : ".$2$1",
    "(.)(?=\\1)" : "",
}

const proma_orthography = {
    "" : ""
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
        if (new RegExp("[^aeoiuyɛɔɪʊʏ]\\.(?!.*\\.)").test(input)) {
            // Penult is heavy, stress the penult
            ret = ("." + input).replace(new RegExp("(\\.)(?!.*\\..*\\.)"), "ˈ$1");
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


function submit(latin_input) {
    // Phoneticize Latin
    latin = String(latin_input).toLowerCase().trim().replace(/\s/g, "-");
    latin_phonetic = latin
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => latin_firstpass[matched]);
    latin_phonetic = latin_phonetic.replace(new RegExp(Object.keys(latin_secondpass).join("|"), "g"), (matched) => latin_secondpass[matched]);
    
    Object.keys(latin_thirdpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_thirdpass[key]));
    latin_phonetic = syllabify(latin_phonetic, "aeoiuyɛɔɪʊʏ");
    Object.keys(latin_fourthpass).forEach((key) => latin_phonetic = latin_phonetic.replace(new RegExp(key, "g"), latin_fourthpass[key]));

    latin_phonetic = latinate_stress(latin_phonetic);

    // Evolve to Proto-Romance
    proto_phonetic = latin_phonetic;

    if ($("#early-monophthongs").is(":checked")) {
        Object.keys(optional_early_monophthongs).forEach((key) => proto_phonetic = proto_phonetic.replace(new RegExp(key, "g"), optional_early_monophthongs[key]));
    }

    Object.keys(proto_firstpass).forEach((key) => proto_phonetic = proto_phonetic.replace(new RegExp(key, "g"), proto_firstpass[key]));
    if ($("#v-deletion").is(":checked")) {
        proto_phonetic = proto_phonetic.replace(optional_v_deletion, "");
    }

    if ($("#always-syncope").is(":checked")) {
        Object.keys(optional_syncope).forEach((key) => proto_phonetic = proto_phonetic.replace(new RegExp(key, "g"), optional_syncope[key]));
        $("#syncope").prop("checked", true);
    } else if ($("#syncope").is(":checked")) {
        Object.keys(default_syncope).forEach((key) => proto_phonetic = proto_phonetic.replace(new RegExp(key, "g"), default_syncope[key]));
    }
    if ($("#av-au").is(":checked")) { 
        proto_phonetic = proto_phonetic.replace(av, au);
    }
    Object.keys(proto_secondpass).forEach((key) => proto_phonetic = proto_phonetic.replace(new RegExp(key, "g"), proto_secondpass[key]));

    proto = proto_phonetic;
    Object.keys(proto_orthography).forEach((key) => proto = proto.replace(new RegExp(key, "g"), proto_orthography[key]));

    // Evolve to Logudorese Sardinian
    logu_phonetic = proto_phonetic;
    Object.keys(logu_firstpass).forEach((key) => logu_phonetic = logu_phonetic.replace(new RegExp(key, "g"), logu_firstpass[key]));
    logu = logu_phonetic;
    Object.keys(sard_orthography).forEach((key) => logu = logu.replace(new RegExp(key, "g"), sard_orthography[key]));
    Object.keys(sard_finish).forEach((key) => logu_phonetic = logu_phonetic.replace(new RegExp(key, "g"), sard_finish[key]));

    // Evolve to Nuorese Sardinian
    nuor_phonetic = proto_phonetic;
    Object.keys(nuor_firstpass).forEach((key) => nuor_phonetic = nuor_phonetic.replace(new RegExp(key, "g"), nuor_firstpass[key]));
    nuor = nuor_phonetic;
    Object.keys(sard_orthography).forEach((key) => nuor = nuor.replace(new RegExp(key, "g"), sard_orthography[key]));
    Object.keys(sard_finish).forEach((key) => nuor_phonetic = nuor_phonetic.replace(new RegExp(key, "g"), sard_finish[key]));

    // Evolve to Campidanese Sardinian
    camp_phonetic = proto_phonetic;
    Object.keys(camp_firstpass).forEach((key) => camp_phonetic = camp_phonetic.replace(new RegExp(key, "g"), camp_firstpass[key]));
    camp = camp_phonetic;
    Object.keys(sard_orthography).forEach((key) => camp = camp.replace(new RegExp(key, "g"), sard_orthography[key]));
    Object.keys(sard_finish).forEach((key) => camp_phonetic = camp_phonetic.replace(new RegExp(key, "g"), sard_finish[key]));

    // Evolve to African
    afri_phonetic = proto_phonetic;
    Object.keys(afri_firstpass).forEach((key) => afri_phonetic = afri_phonetic.replace(new RegExp(key, "g"), afri_firstpass[key]));
    afri = latin;
    afri = afri.replace(new RegExp(Object.keys(latin_firstpass).join("|"), "g"), (matched) => latin_firstpass[matched]);
    Object.keys(afri_orthography).forEach((key) => afri = afri.replace(new RegExp(key, "g"), afri_orthography[key]));

    // Evolve to Proto-Romanian
    proma_phonetic = proto_phonetic;
    Object.keys(proma_firstpass).forEach((key) => proma_phonetic = proma_phonetic.replace(new RegExp(key, "g"), proma_firstpass[key]));
    proma = proma_phonetic;
    Object.keys(proma_orthography).forEach((key) => proma = proma.replace(new RegExp(key, "g"), proma_orthography[key]));

    $("#latinphon").val(latin_phonetic);
    $("#proto").val(proto);
    $("#proto_phon").val(proto_phonetic);
    $("#logu_phon").val(logu_phonetic);
    $("#logu").val(logu);
    $("#nuor_phon").val(nuor_phonetic);
    $("#nuor").val(nuor);
    $("#camp_phon").val(camp_phonetic);
    $("#camp").val(camp);
    $("#afri_phon").val(afri_phonetic);
    $("#afri").val(afri);
    $("#proma_phon").val(proma_phonetic);
    $("#proma").val(proma);
}