(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Paper = require("../../js/values/Paper");
var relevantWords = require("../../js/stringProcessing/relevantWords");
var getRelevantWords = relevantWords.getRelevantWords;
var getWordCombinations = relevantWords.getWordCombinations;
var calculateOccurrences = relevantWords.calculateOccurrences;
var getRelevantCombinations = relevantWords.getRelevantCombinations;
var WordCombination = require("../../js/values/WordCombination");
var getWords = require("../../js/stringProcessing/getWords");
var template = require("../../js/templates.js").relevantWords;

var map = require("lodash/map");
var forEach = require("lodash/forEach");

/**
 * Binds the renewData function on the change of input elements.
 *
 * @returns {void}
 */
var bindEvents = function bindEvents() {
	var elems = ["content", "locale"];
	for (var i = 0; i < elems.length; i++) {
		document.getElementById(elems[i]).addEventListener("input", outputRelevantWords);
	}
};

/**
 * Rounds number to four decimals.
 *
 * @param {number} number The number to be rounded.
 * @returns {number} The rounded number.
 */
var formatNumber = function formatNumber(number) {

	if (Math.round(number) === number) {
		return number;
	}

	return Math.round(number * 10000) / 10000;
};

/**
 * Calculates all properties for the relevant word objects.
 *
 * @returns {object} The relevant word objects.
 */
var calculateRelevantWords = function calculateRelevantWords() {
	var locale = document.getElementById("locale").value || "en_US";
	var text = document.getElementById("content").value;
	return map(getRelevantWords(text, locale), function (word) {
		var words = getWords(text);

		var output = {
			"word": word.getCombination(),
			"relevance": formatNumber(word.getRelevance()),
			"length": word._length,
			"occurrences": word.getOccurrences(),
			"multiplier": formatNumber(word.getMultiplier(word.getRelevantWordPercentage())),
			"relevantWordPercentage": formatNumber(word.getRelevantWordPercentage())
		};

		if (word._length === 1) {
			output["lengthBonus"] = "";
		} else {
			output["lengthBonus"] = WordCombination.lengthBonus[word._length];
		}

		output["density"] = formatNumber(word.getDensity(words.length));
		return output;
	});
};

/**
 * Renders the relevant words table.
 *
 * @returns {void}
 */
var outputRelevantWords = function outputRelevantWords() {
	var foundRelevantWords = calculateRelevantWords();

	document.getElementById("contentOutput").innerHTML = template({
		words: foundRelevantWords
	});
};

/**
 * Executes the bindEvents function on load.
 *
 * @returns {void}
 */
window.onload = function () {
	bindEvents();
};

},{"../../js/stringProcessing/getWords":23,"../../js/stringProcessing/relevantWords":25,"../../js/templates.js":32,"../../js/values/Paper":33,"../../js/values/WordCombination":34,"lodash/forEach":181,"lodash/map":206}],2:[function(require,module,exports){
"use strict";

/** @module config/syllables */

var getLanguage = require("../helpers/getLanguage.js");
var isUndefined = require("lodash/isUndefined");

var de = require("./syllables/de.json");
var en = require('./syllables/en.json');
var nl = require('./syllables/nl.json');

module.exports = function (locale) {
	if (isUndefined(locale)) {
		locale = "en_US";
	}

	switch (getLanguage(locale)) {
		case "de":
			return de;
		case "nl":
			return nl;
		case "en":
		default:
			return en;
	}
};

},{"../helpers/getLanguage.js":6,"./syllables/de.json":3,"./syllables/en.json":4,"./syllables/nl.json":5,"lodash/isUndefined":203}],3:[function(require,module,exports){
module.exports={
	"vowels": "aeiouyäöüáéâàèîêâûôœ",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "ouil", "deaux", "deau$", "oard", "äthiop", "euil", "veau", "eau$", "ueue", "lienisch", "ance$", "ence$", "time$",
					"once$", "ziat", "guette", "ête", "ôte$", "[hp]omme$", "[qdscn]ue$", "aire$", "ture$", "êpe$", "[^q]ui$", "tiche$",
					"vice$", "oile$", "zial", "cruis", "leas", "coa[ct]", "[^i]deal", "[fw]eat", "[lsx]ed$" ],
				"countModifier": -1
			},
			{
				"fragments": [ "aau", "a[äöüo]", "äue", "äeu", "aei", "aue", "aeu", "ael", "ai[aeo]", "saik", "aismus", "ä[aeoi]", "auä", "éa",
					"e[äaoö]", "ei[eo]", "ee[aeiou]", "eu[aäe]", "eum$", "eü", "o[aäöü]", "poet", "oo[eo]", "oie", "oei[^l]", "oeu[^f]", "öa", "[fgrz]ieu",
					"mieun", "tieur", "ieum", "i[aiuü]", "[^l]iä", "[^s]chien", "io[bcdfhjkmpqtuvwx]", "[bdhmprv]ion", "[lr]ior",
					"[^g]io[gs]", "[dr]ioz", "elioz", "zioni", "bio[lnorz]", "iö[^s]", "ie[ei]", "rier$", "öi[eg]", "[^r]öisch",
					"[^gqv]u[aeéioöuü]", "quie$", "quie[^s]", "uäu", "^us-", "^it-", "üe", "naiv", "aisch$", "aische$", "aische[nrs]$", "[lst]ien",
					"dien$", "gois", "[^g]rient", "[aeiou]y[aeiou]", "byi", "yä", "[a-z]y[ao]", "yau", "koor", "scient", "eriel", "[dg]oing" ],
				"countModifier": 1
			},
			{
				"fragments": [ "eauü", "ioi", "ioo", "ioa", "iii", "oai", "eueu" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{ "word": "beach", "syllables": 1 },
				{ "word": "beat", "syllables": 1 },
				{ "word": "beau", "syllables": 1 },
				{ "word": "beaune", "syllables": 1 },
				{ "word": "belle", "syllables": 1 },
				{ "word": "bouche", "syllables": 1 },
				{ "word": "brake", "syllables": 1 },
				{ "word": "cache", "syllables": 1 },
				{ "word": "cache", "syllables": 1 },
				{ "word": "chaiselongue", "syllables": 2 },
				{ "word": "choke", "syllables": 1 },
				{ "word": "cordiale", "syllables": 3 },
				{ "word": "core", "syllables": 1 },
				{ "word": "dope", "syllables": 1 },
				{ "word": "eat", "syllables": 1 },
				{ "word": "eye", "syllables": 1 },
				{ "word": "fake", "syllables": 1 },
				{ "word": "fame", "syllables": 1 },
				{ "word": "fatigue", "syllables": 2 },
				{ "word": "femme", "syllables": 1 },
				{ "word": "force", "syllables": 1 },
				{ "word": "game", "syllables": 1 },
				{ "word": "games", "syllables": 1 },
				{ "word": "gate", "syllables": 1 },
				{ "word": "grande", "syllables": 1 },
				{ "word": "ice", "syllables": 1 },
				{ "word": "ion", "syllables": 2 },
				{ "word": "joke", "syllables": 1 },
				{ "word": "jupe", "syllables": 1 },
				{ "word": "maisch", "syllables": 1 },
				{ "word": "maische", "syllables": 2 },
				{ "word": "move", "syllables": 1 },
				{ "word": "native", "syllables": 2 },
				{ "word": "nice", "syllables": 1 },
				{ "word": "one", "syllables": 1 },
				{ "word": "pipe", "syllables": 1 },
				{ "word": "prime", "syllables": 1 },
				{ "word": "rate", "syllables": 1 },
				{ "word": "rhythm", "syllables": 2 },
				{ "word": "ride", "syllables": 1 },
				{ "word": "rides", "syllables": 1 },
				{ "word": "rien", "syllables": 2 },
				{ "word": "save", "syllables": 1 },
				{ "word": "science", "syllables": 2 },
				{ "word": "siècle", "syllables": 1 },
				{ "word": "site", "syllables": 1 },
				{ "word": "suite", "syllables": 1 },
				{ "word": "take", "syllables": 1 },
				{ "word": "taupe", "syllables": 1 },
				{ "word": "universe", "syllables": 3 },
				{ "word": "vogue", "syllables": 1 },
				{ "word": "wave", "syllables": 1 },
				{ "word": "zion", "syllables": 2}
			],
			"fragments": {
				"global": [
					{ "word": "abreaktion", "syllables": 4 },
					{ "word": "adware", "syllables": 2 },
					{ "word": "affaire", "syllables": 3 },
					{ "word": "aiguière", "syllables": 2 },
					{ "word": "anisette", "syllables": 3 },
					{ "word": "appeal", "syllables": 2 },
					{ "word": "backstage", "syllables": 2 },
					{ "word": "bankrate", "syllables": 2 },
					{ "word": "baseball", "syllables": 2 },
					{ "word": "basejump", "syllables": 2 },
					{ "word": "beachcomber", "syllables": 3 },
					{ "word": "beachvolleyball", "syllables": 4 },
					{ "word": "beagle", "syllables": 2 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "béarnaise", "syllables": 3 },
					{ "word": "beaufort", "syllables": 2 },
					{ "word": "beaujolais", "syllables": 3 },
					{ "word": "beauté", "syllables": 2 },
					{ "word": "beauty", "syllables": 2 },
					{ "word": "belgier", "syllables": 3 },
					{ "word": "bestien", "syllables": 2 },
					{ "word": "biskuit", "syllables": 2 },
					{ "word": "bleach", "syllables": 1 },
					{ "word": "blue", "syllables": 1 },
					{ "word": "board", "syllables": 1 },
					{ "word": "boat", "syllables": 1 },
					{ "word": "bodysuit", "syllables": 3 },
					{ "word": "bordelaise", "syllables": 3 },
					{ "word": "break", "syllables": 1 },
					{ "word": "build", "syllables": 1 },
					{ "word": "bureau", "syllables": 2 },
					{ "word": "business", "syllables": 2 },
					{ "word": "cabrio", "syllables": 3 },
					{ "word": "cabriolet", "syllables": 4 },
					{ "word": "cachesexe", "syllables": 2 },
					{ "word": "camaieu", "syllables": 3 },
					{ "word": "canyon", "syllables": 2 },
					{ "word": "case", "syllables": 1 },
					{ "word": "catsuit", "syllables": 2 },
					{ "word": "centime", "syllables": 3 },
					{ "word": "chaise", "syllables": 2 },
					{ "word": "champion", "syllables": 2 },
					{ "word": "championat", "syllables": 3 },
					{ "word": "chapiteau", "syllables": 3 },
					{ "word": "chateau", "syllables": 2 },
					{ "word": "château", "syllables": 2 },
					{ "word": "cheat", "syllables": 1 },
					{ "word": "cheese", "syllables": 1 },
					{ "word": "chihuahua", "syllables": 3 },
					{ "word": "choice", "syllables": 1 },
					{ "word": "circonflexe", "syllables": 3 },
					{ "word": "clean", "syllables": 1 },
					{ "word": "cloche", "syllables": 1 },
					{ "word": "close", "syllables": 1 },
					{ "word": "clothes", "syllables": 1 },
					{ "word": "commerce", "syllables": 2 },
					{ "word": "crime", "syllables": 1 },
					{ "word": "crossrate", "syllables": 2 },
					{ "word": "cuisine", "syllables": 2 },
					{ "word": "culotte", "syllables": 2 },
					{ "word": "death", "syllables": 1 },
					{ "word": "defense", "syllables": 2 },
					{ "word": "détente", "syllables": 2 },
					{ "word": "dread", "syllables": 1 },
					{ "word": "dream", "syllables": 1 },
					{ "word": "dresscode", "syllables": 2 },
					{ "word": "dungeon", "syllables": 2 },
					{ "word": "easy", "syllables": 2 },
					{ "word": "engagement", "syllables": 3 },
					{ "word": "entente", "syllables": 2 },
					{ "word": "eye-catcher", "syllables": 3 },
					{ "word": "eyecatcher", "syllables": 3 },
					{ "word": "eyeliner", "syllables": 3 },
					{ "word": "eyeword", "syllables": 2 },
					{ "word": "fashion", "syllables": 2 },
					{ "word": "feature", "syllables": 2 },
					{ "word": "ferien", "syllables": 3 },
					{ "word": "fineliner", "syllables": 3 },
					{ "word": "fisheye", "syllables": 2 },
					{ "word": "flake", "syllables": 1 },
					{ "word": "flambeau", "syllables": 2 },
					{ "word": "flatrate", "syllables": 2 },
					{ "word": "fleece", "syllables": 1 },
					{ "word": "fraîche", "syllables": 1 },
					{ "word": "freak", "syllables": 1 },
					{ "word": "frites", "syllables": 1 },
					{ "word": "future", "syllables": 2 },
					{ "word": "gaelic", "syllables": 2 },
					{ "word": "game-show", "syllables": 2 },
					{ "word": "gameboy", "syllables": 2 },
					{ "word": "gamepad", "syllables": 2 },
					{ "word": "gameplay", "syllables": 2 },
					{ "word": "gameport", "syllables": 2 },
					{ "word": "gameshow", "syllables": 2 },
					{ "word": "garigue", "syllables": 2 },
					{ "word": "garrigue", "syllables": 2 },
					{ "word": "gatefold", "syllables": 2 },
					{ "word": "gateway", "syllables": 2 },
					{ "word": "geflashed", "syllables": 2 },
					{ "word": "georgier", "syllables": 4 },
					{ "word": "goal", "syllables": 1 },
					{ "word": "grapefruit", "syllables": 2 },
					{ "word": "great", "syllables": 1 },
					{ "word": "groupware", "syllables": 2 },
					{ "word": "gueule", "syllables": 1 },
					{ "word": "guide", "syllables": 1 },
					{ "word": "guilloche", "syllables": 2 },
					{ "word": "gynäzeen", "syllables": 4 },
					{ "word": "gynözeen", "syllables": 4 },
					{ "word": "haircare", "syllables": 2 },
					{ "word": "hardcore", "syllables": 2 },
					{ "word": "hardware", "syllables": 2 },
					{ "word": "head", "syllables": 1 },
					{ "word": "hearing", "syllables": 2 },
					{ "word": "heart", "syllables": 1 },
					{ "word": "heavy", "syllables": 2 },
					{ "word": "hedge", "syllables": 1 },
					{ "word": "heroin", "syllables": 3 },
					{ "word": "inclusive", "syllables": 3 },
					{ "word": "initiative", "syllables": 4 },
					{ "word": "inside", "syllables": 2 },
					{ "word": "jaguar", "syllables": 3 },
					{ "word": "jalousette", "syllables": 3 },
					{ "word": "jeans", "syllables": 1 },
					{ "word": "jeunesse", "syllables": 2 },
					{ "word": "juice", "syllables": 1 },
					{ "word": "jukebox", "syllables": 2 },
					{ "word": "jumpsuit", "syllables": 2 },
					{ "word": "kanarien", "syllables": 4 },
					{ "word": "kapriole", "syllables": 4 },
					{ "word": "karosserielinie", "syllables": 6 },
					{ "word": "konopeen", "syllables": 4 },
					{ "word": "lacrosse", "syllables": 2 },
					{ "word": "laplace", "syllables": 2 },
					{ "word": "late-", "syllables": 1 },
					{ "word": "lead", "syllables": 1 },
					{ "word": "league", "syllables": 1 },
					{ "word": "learn", "syllables": 1 },
					{ "word": "légière", "syllables": 2 },
					{ "word": "lizenziat", "syllables": 4 },
					{ "word": "load", "syllables": 1 },
					{ "word": "lotterielos", "syllables": 4 },
					{ "word": "lounge", "syllables": 1 },
					{ "word": "lyzeen", "syllables": 3 },
					{ "word": "madame", "syllables": 2 },
					{ "word": "mademoiselle", "syllables": 3 },
					{ "word": "magier", "syllables": 3 },
					{ "word": "make-up", "syllables": 2 },
					{ "word": "malware", "syllables": 2 },
					{ "word": "management", "syllables": 3 },
					{ "word": "manteau", "syllables": 2 },
					{ "word": "mausoleen", "syllables": 4 },
					{ "word": "mauve", "syllables": 1 },
					{ "word": "medien", "syllables": 3 },
					{ "word": "mesdames", "syllables": 2 },
					{ "word": "mesopotamien", "syllables": 6 },
					{ "word": "milliarde", "syllables": 3 },
					{ "word": "missile", "syllables": 2 },
					{ "word": "miszellaneen", "syllables": 5 },
					{ "word": "mousse", "syllables": 1 },
					{ "word": "mousseline", "syllables": 3 },
					{ "word": "museen", "syllables": 3 },
					{ "word": "musette", "syllables": 2 },
					{ "word": "nahuatl", "syllables": 2 },
					{ "word": "noisette", "syllables": 2 },
					{ "word": "notebook", "syllables": 2 },
					{ "word": "nuance", "syllables": 3 },
					{ "word": "nuklease", "syllables": 4 },
					{ "word": "odeen", "syllables": 3 },
					{ "word": "offline", "syllables": 2 },
					{ "word": "offside", "syllables": 2 },
					{ "word": "oleaster", "syllables": 4 },
					{ "word": "on-stage", "syllables": 2 },
					{ "word": "online", "syllables": 2 },
					{ "word": "orpheen", "syllables": 3 },
					{ "word": "parforceritt", "syllables": 3 },
					{ "word": "patiens", "syllables": 2 },
					{ "word": "patient", "syllables": 2 },
					{ "word": "peace", "syllables": 1 },
					{ "word": "peace", "syllables": 1 },
					{ "word": "peanuts", "syllables": 2 },
					{ "word": "people", "syllables": 2 },
					{ "word": "perineen", "syllables": 4 },
					{ "word": "peritoneen", "syllables": 5 },
					{ "word": "picture", "syllables": 2 },
					{ "word": "piece", "syllables": 1 },
					{ "word": "pipeline", "syllables": 2 },
					{ "word": "plateau", "syllables": 2 },
					{ "word": "poesie", "syllables": 3 },
					{ "word": "poleposition", "syllables": 4 },
					{ "word": "portemanteau", "syllables": 3 },
					{ "word": "portemonnaie", "syllables": 3 },
					{ "word": "primerate", "syllables": 2 },
					{ "word": "primerate", "syllables": 2 },
					{ "word": "primetime", "syllables": 2 },
					{ "word": "protease", "syllables": 4 },
					{ "word": "protein", "syllables": 3 },
					{ "word": "prytaneen", "syllables": 4 },
					{ "word": "quotient", "syllables": 2 },
					{ "word": "radio", "syllables": 3 },
					{ "word": "reader", "syllables": 2 },
					{ "word": "ready", "syllables": 2 },
					{ "word": "reallife", "syllables": 2 },
					{ "word": "repeat", "syllables": 2 },
					{ "word": "retake", "syllables": 2 },
					{ "word": "rigole", "syllables": 2 },
					{ "word": "risolle", "syllables": 2 },
					{ "word": "road", "syllables": 1 },
					{ "word": "roaming", "syllables": 2 },
					{ "word": "roquefort", "syllables": 2 },
					{ "word": "safe", "syllables": 1 },
					{ "word": "savonette", "syllables": 3 },
					{ "word": "sciencefiction", "syllables": 3 },
					{ "word": "search", "syllables": 1 },
					{ "word": "selfmade", "syllables": 2 },
					{ "word": "septime", "syllables": 3 },
					{ "word": "serapeen", "syllables": 4 },
					{ "word": "service", "syllables": 2 },
					{ "word": "serviette", "syllables": 2 },
					{ "word": "share", "syllables": 1 },
					{ "word": "shave", "syllables": 1 },
					{ "word": "shore", "syllables": 1 },
					{ "word": "sidebar", "syllables": 2 },
					{ "word": "sideboard", "syllables": 2 },
					{ "word": "sidekick", "syllables": 2 },
					{ "word": "silhouette", "syllables": 3 },
					{ "word": "sitemap", "syllables": 2 },
					{ "word": "slide", "syllables": 1 },
					{ "word": "sneak", "syllables": 1 },
					{ "word": "soap", "syllables": 1 },
					{ "word": "softcore", "syllables": 2 },
					{ "word": "software", "syllables": 2 },
					{ "word": "soutanelle", "syllables": 3 },
					{ "word": "speak", "syllables": 1 },
					{ "word": "special", "syllables": 2 },
					{ "word": "spracheinstellung", "syllables": 5 },
					{ "word": "spyware", "syllables": 2 },
					{ "word": "square", "syllables": 1 },
					{ "word": "stagediving", "syllables": 3 },
					{ "word": "stakeholder", "syllables": 3 },
					{ "word": "statement", "syllables": 2 },
					{ "word": "steady", "syllables": 2 },
					{ "word": "steak", "syllables": 1 },
					{ "word": "stealth", "syllables": 1 },
					{ "word": "steam", "syllables": 1 },
					{ "word": "stoned", "syllables": 1 },
					{ "word": "stracciatella", "syllables": 4 },
					{ "word": "stream", "syllables": 1 },
					{ "word": "stride", "syllables": 1 },
					{ "word": "strike", "syllables": 1 },
					{ "word": "suitcase", "syllables": 2 },
					{ "word": "sweepstake", "syllables": 2 },
					{ "word": "t-bone", "syllables": 2 },
					{ "word": "t-shirt", "syllables": 1 },
					{ "word": "tailgate", "syllables": 2 },
					{ "word": "take-off", "syllables": 2 },
					{ "word": "take-over", "syllables": 3 },
					{ "word": "takeaway", "syllables": 3 },
					{ "word": "takeoff", "syllables": 2 },
					{ "word": "takeover", "syllables": 3 },
					{ "word": "throat", "syllables": 1 },
					{ "word": "time-out", "syllables": 2 },
					{ "word": "timelag", "syllables": 2 },
					{ "word": "timeline", "syllables": 2 },
					{ "word": "timesharing", "syllables": 3 },
					{ "word": "toast", "syllables": 1 },
					{ "word": "traubenmaische", "syllables": 4 },
					{ "word": "tristesse", "syllables": 2 },
					{ "word": "usenet", "syllables": 2 },
					{ "word": "varietät", "syllables": 4 },
					{ "word": "varieté", "syllables": 4 },
					{ "word": "vinaigrette", "syllables": 3 },
					{ "word": "vintage", "syllables": 2 },
					{ "word": "violett", "syllables": 3 },
					{ "word": "voice", "syllables": 1 },
					{ "word": "wakeboard", "syllables": 2 },
					{ "word": "washed", "syllables": 1 },
					{ "word": "waveboard", "syllables": 2 },
					{ "word": "wear", "syllables": 1 },
					{ "word": "wear", "syllables": 1 },
					{ "word": "website", "syllables": 2 },
					{ "word": "white", "syllables": 1 },
					{ "word": "widescreen", "syllables": 2 },
					{ "word": "wire", "syllables": 1 },
					{ "word": "yacht", "syllables": 1 },
					{ "word": "yorkshire", "syllables": 2 },
					{ "word": "éprouvette", "syllables": 3, "notFollowedBy": ["n"] },
					{ "word": "galette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "gigue", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "groove", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "morgue", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "paillette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "raclette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "roulette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "spike", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "style", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "tablette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "grunge", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "size", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "value", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "quiche", "syllables": 1, "notFollowedBy": ["s"] },
					{ "word": "house", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "sauce", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "space", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "airline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "autosave", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "bagpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "bike", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "dance", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "deadline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "halfpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "headline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "home", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "hornpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "hotline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "infoline", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "inline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "kite", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "rollerblade", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "score", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "skyline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "slackline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "slice", "syllables": 1, "notFollowedBy": ["n", "r", "s"] },
					{ "word": "snooze", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "storyline", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "office", "syllables": 2, "notFollowedBy": ["s", "r"] },
					{ "word": "space", "syllables": 1, "notFollowedBy": ["n", "s", "r"] },
					{ "word": "tease", "syllables": 1, "notFollowedBy": ["n", "s", "r"] },
					{ "word": "cache", "syllables": 1, "notFollowedBy": ["t"] }
				],
				"atBeginningOrEnd": [
					{ "word": "case", "syllables": 1 },
					{ "word": "life", "syllables": 1 },
					{ "word": "teak", "syllables": 1 },
					{ "word": "team", "syllables": 1 },
					{ "word": "creme", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "crème", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "drive", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "skate", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "update", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "upgrade", "syllables": 2, "notFollowedBy": ["n", "r"] }
				],
				"atBeginning": [
					{ "word": "anion", "syllables": 3 },
					{ "word": "facelift", "syllables": 2 },
					{ "word": "jiu", "syllables": 1 },
					{ "word": "pace", "syllables": 1 },
					{ "word": "shake", "syllables": 1 },
					{ "word": "tea", "syllables": 1 },
					{ "word": "trade", "syllables": 1 },
					{ "word": "deal", "syllables": 1 }
				],
				"atEnd": [
					{ "word": "face", "syllables": 1 },
					{ "word": "file", "syllables": 1 },
					{ "word": "mousse", "syllables": 1 },
					{ "word": "plate", "syllables": 1 },
					{ "word": "tape", "syllables": 1 },
					{ "word": "byte", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "cape", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "five", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "hype", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "leak", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "like", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "make", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "phone", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "rave", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "regime", "syllables": 2, "alsoFollowedBy": ["s"] },
					{ "word": "statue", "syllables": 2, "alsoFollowedBy": ["s"] },
					{ "word": "store", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "wave", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "date", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "image", "syllables": 2, "notFollowedBy": ["s"] }
				]
			}
		}
	}
}

},{}],4:[function(require,module,exports){
module.exports={
	"vowels": "aeiouy",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "cial", "tia", "cius", "giu", "ion",
					"[^bdnprv]iou", "sia$", "[^aeiuot]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e$",
					"[a-z]ely$", "[cgy]ed$", "rved$", "[aeiouy][dt]es?$", "eau", "ieu",
					"oeu", "[aeiouy][^aeiouydt]e[sd]?$", "[aeouy]rse$", "^eye" ],
				"countModifier": -1
			},
			{
				"fragments": [ "ia", "iu", "ii", "io", "[aeio][aeiou]{2}", "[aeiou]ing", "[^aeiou]ying", "ui[aeou]" ],
				"countModifier": 1
			},
			{
				"fragments": [ "^ree[jmnpqrsx]", "^reele", "^reeva", "riet",
					"dien", "[aeiouym][bdp]le$", "uei", "uou",
					"^mc", "ism$", "[^l]lien", "^coa[dglx].",
					"[^gqauieo]ua[^auieo]", "dn't$", "uity$", "ie(r|st)",
					"[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$" ],
				"countModifier": 1
			},
			{
				"fragments": [ "eoa", "eoo", "ioa", "ioe", "ioo" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{
					"word": "business",
					"syllables": 2
				},
				{
					"word": "coheiress",
					"syllables": 3
				},
				{
					"word": "colonel",
					"syllables": 2
				},
				{
					"word": "heiress",
					"syllables": 2
				},
				{
					"word": "i.e",
					"syllables": 2
				},
				{
					"word": "shoreline",
					"syllables": 2
				},
				{
					"word": "simile",
					"syllables": 3
				},
				{
					"word": "unheired",
					"syllables": 2
				},
				{
					"word": "wednesday",
					"syllables": 2
				}
			],
			"fragments": {
				"global": [
					{
						"word": "coyote",
						"syllables": 3
					},
					{
						"word": "graveyard",
						"syllables": 2
					},
					{
						"word": "lawyer",
						"syllables": 2
					}
				]
			}
		}
	}
}

},{}],5:[function(require,module,exports){
module.exports={
	"vowels": "aáäâeéëêiíïîoóöôuúüûy",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "ue$", "dge$", "[tcp]iënt",
					"ace$", "[br]each", "[ainpr]tiaal", "[io]tiaan",
					"gua[yc]", "[^i]deal", "tive$", "load", "[^e]coke",
					"[^s]core$" ],
				"countModifier": -1
			},
			{
				"fragments": [ "aä", "aeu", "aie", "ao", "ë", "eo",
					"eú", "ieau", "ea$", "ea[^u]", "ei[ej]",
					"eu[iu]", "ï", "iei", "ienne", "[^l]ieu[^w]",
					"[^l]ieu$", "i[auiy]", "stion",
					"[^cstx]io", "^sion", "riè", "oö", "oa", "oeing",
					"oie", "[eu]ü", "[^q]u[aeèo]", "uie",
					"[bhnpr]ieel", "[bhnpr]iël" ],
				"countModifier": 1
			},
			{
				"fragments": [ "[aeolu]y[aeéèoóu]" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{ "word": "bye", "syllables": 1 },
				{ "word": "core", "syllables": 1 },
				{ "word": "cure", "syllables": 1 },
				{ "word": "dei", "syllables": 2 },
				{ "word": "dope", "syllables": 1 },
				{ "word": "dude", "syllables": 1 },
				{ "word": "fake", "syllables": 1 },
				{ "word": "fame", "syllables": 1 },
				{ "word": "five", "syllables": 1 },
				{ "word": "hole", "syllables": 1 },
				{ "word": "least", "syllables": 1 },
				{ "word": "lone", "syllables": 1 },
				{ "word": "minute", "syllables": 2 },
				{ "word": "move", "syllables": 1 },
				{ "word": "nice", "syllables": 1 },
				{ "word": "one", "syllables": 1 },
				{ "word": "state", "syllables": 1 },
				{ "word": "surplace", "syllables": 2 },
				{ "word": "take", "syllables": 1 },
				{ "word": "trade", "syllables": 1 },
				{ "word": "wide", "syllables": 1 }
			],
			"fragments": {
				"global": [
					{ "word": "adieu", "syllables": 2 },
					{ "word": "airline", "syllables": 2 },
					{ "word": "airmiles", "syllables": 2 },
					{ "word": "alien", "syllables": 3 },
					{ "word": "ambient", "syllables": 3 },
					{ "word": "announcement", "syllables": 3 },
					{ "word": "appearance", "syllables": 3 },
					{ "word": "appeasement", "syllables": 3 },
					{ "word": "atheneum", "syllables": 4 },
					{ "word": "awesome", "syllables": 2 },
					{ "word": "baccalaurei", "syllables": 5 },
					{ "word": "baccalaureus", "syllables": 5 },
					{ "word": "baseball", "syllables": 3 },
					{ "word": "basejump", "syllables": 2 },
					{ "word": "banlieue", "syllables": 3 },
					{ "word": "bapao", "syllables": 2 },
					{ "word": "barbecue", "syllables": 3 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "beanie", "syllables": 2 },
					{ "word": "beat", "syllables": 1 },
					{ "word": "belle", "syllables": 2 },
					{ "word": "bête", "syllables": 1 },
					{ "word": "bingewatch", "syllables": 2 },
					{ "word": "blocnote", "syllables": 2 },
					{ "word": "blue", "syllables": 1 },
					{ "word": "board", "syllables": 1 },
					{ "word": "break", "syllables": 1 },
					{ "word": "broad", "syllables": 1 },
					{ "word": "bulls-eye", "syllables": 2 },
					{ "word": "business", "syllables": 2 },
					{ "word": "byebye", "syllables": 2 },
					{ "word": "cacao", "syllables": 2 },
					{ "word": "caesar", "syllables": 2 },
					{ "word": "camaieu", "syllables": 3 },
					{ "word": "caoutchouc", "syllables": 2 },
					{ "word": "carbolineum", "syllables": 5 },
					{ "word": "catchphrase", "syllables": 1 },
					{ "word": "carrier", "syllables": 3 },
					{ "word": "cheat", "syllables": 1 },
					{ "word": "cheese", "syllables": 1 },
					{ "word": "circonflexe", "syllables": 3 },
					{ "word": "clean", "syllables": 1 },
					{ "word": "cloak", "syllables": 1 },
					{ "word": "cobuying", "syllables": 3 },
					{ "word": "comeback", "syllables": 2 },
					{ "word": "comfortzone", "syllables": 3 },
					{ "word": "communiqué", "syllables": 4 },
					{ "word": "conopeum", "syllables": 4 },
					{ "word": "console", "syllables": 2 },
					{ "word": "corporate", "syllables": 3 },
					{ "word": "coûte", "syllables": 1 },
					{ "word": "creamer", "syllables": 2 },
					{ "word": "crime", "syllables": 1 },
					{ "word": "cruesli", "syllables": 2 },
					{ "word": "deadline", "syllables": 2 },
					{ "word": "deautoriseren", "syllables": 6 },
					{ "word": "deuce", "syllables": 1 },
					{ "word": "deum", "syllables": 2 },
					{ "word": "dirndl", "syllables": 2 },
					{ "word": "dread", "syllables": 2 },
					{ "word": "dreamteam", "syllables": 2 },
					{ "word": "drone", "syllables": 1 },
					{ "word": "enquête", "syllables": 3 },
					{ "word": "escape", "syllables": 2 },
					{ "word": "exposure", "syllables": 3 },
					{ "word": "extranei", "syllables": 4 },
					{ "word": "extraneus", "syllables": 4 },
					{ "word": "eyecatcher", "syllables": 3 },
					{ "word": "eyeliner", "syllables": 3 },
					{ "word": "eyeopener", "syllables": 4 },
					{ "word": "eyetracker", "syllables": 3 },
					{ "word": "eyetracking", "syllables": 3 },
					{ "word": "fairtrade", "syllables": 2 },
					{ "word": "fauteuil", "syllables": 2 },
					{ "word": "feature", "syllables": 2 },
					{ "word": "feuilletee", "syllables": 3 },
					{ "word": "feuilleton", "syllables": 3 },
					{ "word": "fisheye", "syllables": 2 },
					{ "word": "fineliner", "syllables": 3 },
					{ "word": "finetunen", "syllables": 3 },
					{ "word": "forehand", "syllables": 2 },
					{ "word": "freak", "syllables": 1 },
					{ "word": "fusioneren", "syllables": 4 },
					{ "word": "gayparade", "syllables": 3 },
					{ "word": "gaypride", "syllables": 2 },
					{ "word": "goal", "syllables": 1 },
					{ "word": "grapefruit", "syllables": 2 },
					{ "word": "gruyère", "syllables": 3 },
					{ "word": "guele", "syllables": 1 },
					{ "word": "guerrilla", "syllables": 3 },
					{ "word": "guest", "syllables": 1 },
					{ "word": "hardware", "syllables": 2 },
					{ "word": "haute", "syllables": 1 },
					{ "word": "healing", "syllables": 2 },
					{ "word": "heater", "syllables": 2 },
					{ "word": "heavy", "syllables": 2 },
					{ "word": "hoax", "syllables": 1 },
					{ "word": "hotline", "syllables": 2 },
					{ "word": "idee-fixe", "syllables": 3 },
					{ "word": "inclusive", "syllables": 3 },
					{ "word": "inline", "syllables": 2 },
					{ "word": "intake", "syllables": 2 },
					{ "word": "intensive", "syllables": 3 },
					{ "word": "jeans", "syllables": 1 },
					{ "word": "Jones", "syllables": 1 },
					{ "word": "jubileum", "syllables": 4 },
					{ "word": "kalfsribeye", "syllables": 3 },
					{ "word": "kraaiennest", "syllables": 3 },
					{ "word": "lastminute", "syllables": 3 },
					{ "word": "learning", "syllables": 2 },
					{ "word": "league", "syllables": 1 },
					{ "word": "line-up", "syllables": 2 },
					{ "word": "linoleum", "syllables": 4 },
					{ "word": "load", "syllables": 1 },
					{ "word": "loafer", "syllables": 2 },
					{ "word": "longread", "syllables": 2 },
					{ "word": "lookalike", "syllables": 3 },
					{ "word": "louis", "syllables": 3 },
					{ "word": "lyceum", "syllables": 3 },
					{ "word": "magazine", "syllables": 3 },
					{ "word": "mainstream", "syllables": 2 },
					{ "word": "make-over", "syllables": 3 },
					{ "word": "make-up", "syllables": 2 },
					{ "word": "malware", "syllables": 2 },
					{ "word": "marmoleum", "syllables": 4 },
					{ "word": "mausoleum", "syllables": 4 },
					{ "word": "medeauteur", "syllables": 4 },
					{ "word": "midlifecrisis", "syllables": 4 },
					{ "word": "migraineaura", "syllables": 5 },
					{ "word": "milkshake", "syllables": 2 },
					{ "word": "millefeuille", "syllables": 4 },
					{ "word": "mixed", "syllables": 1 },
					{ "word": "muesli", "syllables": 2 },
					{ "word": "museum", "syllables": 3 },
					{ "word": "must-have", "syllables": 2 },
					{ "word": "must-read", "syllables": 2 },
					{ "word": "notebook", "syllables": 2 },
					{ "word": "nonsense", "syllables": 2 },
					{ "word": "nowhere", "syllables": 2 },
					{ "word": "nurture", "syllables": 2 },
					{ "word": "offline", "syllables": 2 },
					{ "word": "oneliner", "syllables": 3 },
					{ "word": "onesie", "syllables": 2 },
					{ "word": "online", "syllables": 2 },
					{ "word": "opinion", "syllables": 3 },
					{ "word": "paella", "syllables": 3 },
					{ "word": "pacemaker", "syllables": 3 },
					{ "word": "panache", "syllables": 2 },
					{ "word": "papegaaienneus", "syllables": 5 },
					{ "word": "passe-partout", "syllables": 3 },
					{ "word": "peanuts", "syllables": 2 },
					{ "word": "perigeum", "syllables": 4 },
					{ "word": "perineum", "syllables": 4 },
					{ "word": "perpetuum", "syllables": 4 },
					{ "word": "petroleum", "syllables": 4 },
					{ "word": "phone", "syllables": 3 },
					{ "word": "picture", "syllables": 2 },
					{ "word": "placemat", "syllables": 2 },
					{ "word": "porte-manteau", "syllables": 3 },
					{ "word": "portefeuille", "syllables": 4 },
					{ "word": "presse-papier", "syllables": 3 },
					{ "word": "primetime", "syllables": 2 },
					{ "word": "queen", "syllables": 1 },
					{ "word": "questionnaire", "syllables": 3 },
					{ "word": "queue", "syllables": 1 },
					{ "word": "reader", "syllables": 2 },
					{ "word": "reality", "syllables": 3 },
					{ "word": "reallife", "syllables": 2 },
					{ "word": "remake", "syllables": 2 },
					{ "word": "repeat", "syllables": 2 },
					{ "word": "repertoire", "syllables": 3 },
					{ "word": "research", "syllables": 2 },
					{ "word": "reverence", "syllables": 3 },
					{ "word": "ribeye", "syllables": 2 },
					{ "word": "ringtone", "syllables": 3 },
					{ "word": "road", "syllables": 1 },
					{ "word": "roaming", "syllables": 2 },
					{ "word": "sciencefiction", "syllables": 4 },
					{ "word": "selfmade", "syllables": 2 },
					{ "word": "sidekick", "syllables": 2 },
					{ "word": "sightseeing", "syllables": 3 },
					{ "word": "skyline", "syllables": 2 },
					{ "word": "smile", "syllables": 1 },
					{ "word": "sneaky", "syllables": 2 },
					{ "word": "software", "syllables": 2 },
					{ "word": "sparerib", "syllables": 2 },
					{ "word": "speaker", "syllables": 2 },
					{ "word": "spread", "syllables": 1 },
					{ "word": "statement", "syllables": 2 },
					{ "word": "steak", "syllables": 1 },
					{ "word": "steeplechase", "syllables": 3 },
					{ "word": "stonewash", "syllables": 2 },
					{ "word": "store", "syllables": 1 },
					{ "word": "streaken", "syllables": 2 },
					{ "word": "stream", "syllables": 1 },
					{ "word": "streetware", "syllables": 1 },
					{ "word": "supersoaker", "syllables": 4 },
					{ "word": "surprise-party", "syllables": 4 },
					{ "word": "sweater", "syllables": 2 },
					{ "word": "teaser", "syllables": 2 },
					{ "word": "tenue", "syllables": 2 },
					{ "word": "template", "syllables": 2 },
					{ "word": "timeline", "syllables": 2 },
					{ "word": "tissue", "syllables": 2 },
					{ "word": "toast", "syllables": 1 },
					{ "word": "tête-à-tête", "syllables": 3 },
					{ "word": "typecast", "syllables": 2 },
					{ "word": "unique", "syllables": 2 },
					{ "word": "ureum", "syllables": 3 },
					{ "word": "vibe", "syllables": 1 },
					{ "word": "vieux", "syllables": 1 },
					{ "word": "ville", "syllables": 1 },
					{ "word": "vintage", "syllables": 2 },
					{ "word": "wandelyup", "syllables": 3 },
					{ "word": "wiseguy", "syllables": 2 },
					{ "word": "wake-up-call", "syllables": 3 },
					{ "word": "webcare", "syllables": 2 },
					{ "word": "winegum", "syllables": 2 },
					{ "word": "base", "syllables": 1, "notFollowedBy": [ "e", "n", "r" ] },
					{ "word": "game", "syllables": 1, "notFollowedBy": [ "n", "l", "r" ] },
					{ "word": "style", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "douche", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "space", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "striptease", "syllables": 2, "notFollowedBy": [ "n", "s" ] },
					{ "word": "jive", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "keynote", "syllables": 2, "notFollowedBy": [ "n", "r" ] },
					{ "word": "mountainbike", "syllables": 3, "notFollowedBy": [ "n", "r" ] },
					{ "word": "face", "syllables": 1, "notFollowedBy": [ "n", "t" ] },
					{ "word": "challenge", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "cruise", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "house", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "dance", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "franchise", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "freelance", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "lease", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "linedance", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "lounge", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "merchandise", "syllables": 3, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "performance", "syllables": 3, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "release", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "resource", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "cache", "syllables": 1, "notFollowedBy": [ "c", "l", "n", "t", "x" ] },
					{ "word": "office", "syllables": 2, "notFollowedBy": [ "r", "s" ] },
					{ "word": "close", "syllables": 1, "notFollowedBy": [ "r", "t" ] }
				],
				"atBeginningOrEnd": [
					{ "word": "byte", "syllables": 1 },
					{ "word": "cake", "syllables": 1 },
					{ "word": "care", "syllables": 1 },
					{ "word": "coach", "syllables": 1 },
					{ "word": "coat", "syllables": 1 },
					{ "word": "earl", "syllables": 1 },
					{ "word": "foam", "syllables": 1 },
					{ "word": "gate", "syllables": 1 },
					{ "word": "head", "syllables": 1 },
					{ "word": "home", "syllables": 1 },
					{ "word": "live", "syllables": 1 },
					{ "word": "safe", "syllables": 1 },
					{ "word": "site", "syllables": 1 },
					{ "word": "soap", "syllables": 1 },
					{ "word": "teak", "syllables": 1 },
					{ "word": "team", "syllables": 1 },
					{ "word": "wave", "syllables": 1 },
					{ "word": "brace", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "case", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "fleece", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "service", "syllables": 2, "notFollowedBy": [ "s" ] },
					{ "word": "voice", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "kite", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "skate", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "race", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] }
				],
				"atBeginning": [
					{ "word": "coke", "syllables": 1 },
					{ "word": "deal", "syllables": 1 },
					{ "word": "image", "syllables": 2, "notFollowedBy": [ "s" ] }
				],
				"atEnd": [
					{ "word": "force", "syllables": 1 },
					{ "word": "tea", "syllables": 1 },
					{ "word": "time", "syllables": 1 },
					{ "word": "date", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "hype", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "quote", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "tape", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "upgrade", "syllables": 2, "alsoFollowedBy": [ "s" ] }
				]
			}
		}
	}
}

},{}],6:[function(require,module,exports){
"use strict";

/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
module.exports = function (locale) {
  return locale.split("_")[0];
};

},{}],7:[function(require,module,exports){
"use strict";

var blockElements = ["address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"];
var inlineElements = ["b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button", "input", "label", "select", "textarea"];

var blockElementsRegex = new RegExp("^(" + blockElements.join("|") + ")$", "i");
var inlineElementsRegex = new RegExp("^(" + inlineElements.join("|") + ")$", "i");

var blockElementStartRegex = new RegExp("^<(" + blockElements.join("|") + ")[^>]*?>$", "i");
var blockElementEndRegex = new RegExp("^</(" + blockElements.join("|") + ")[^>]*?>$", "i");

var inlineElementStartRegex = new RegExp("^<(" + inlineElements.join("|") + ")[^>]*>$", "i");
var inlineElementEndRegex = new RegExp("^</(" + inlineElements.join("|") + ")[^>]*>$", "i");

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;

var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;

var commentRegex = /<!--(.|[\r\n])*?-->/g;

var core = require("tokenizer2/core");
var forEach = require("lodash/forEach");
var memoize = require("lodash/memoize");

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core(function (token) {
		tokens.push(token);
	});

	htmlBlockTokenizer.addRule(contentRegex, "content");
	htmlBlockTokenizer.addRule(greaterThanContentRegex, "greater-than-sign-content");

	htmlBlockTokenizer.addRule(blockElementStartRegex, "block-start");
	htmlBlockTokenizer.addRule(blockElementEndRegex, "block-end");
	htmlBlockTokenizer.addRule(inlineElementStartRegex, "inline-start");
	htmlBlockTokenizer.addRule(inlineElementEndRegex, "inline-end");

	htmlBlockTokenizer.addRule(otherElementStartRegex, "other-element-start");
	htmlBlockTokenizer.addRule(otherElementEndRegex, "other-element-end");
}

/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement(htmlElementName) {
	return blockElementsRegex.test(htmlElementName);
}

/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement(htmlElementName) {
	return inlineElementsRegex.test(htmlElementName);
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks(text) {
	var blocks = [],
	    depth = 0,
	    blockStartTag = "",
	    currentBlock = "",
	    blockEndTag = "";

	// Remove all comments because it is very hard to tokenize them.
	text = text.replace(commentRegex, "");

	createTokenizer();
	htmlBlockTokenizer.onText(text);

	htmlBlockTokenizer.end();

	forEach(tokens, function (token, i) {
		var nextToken = tokens[i + 1];

		switch (token.type) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
				if (!nextToken || depth === 0 && (nextToken.type === "block-start" || nextToken.type === "block-end")) {
					currentBlock += token.src;

					blocks.push(currentBlock);
					blockStartTag = "";
					currentBlock = "";
					blockEndTag = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				if (depth !== 0) {
					if (currentBlock.trim() !== "") {
						blocks.push(currentBlock);
					}
					currentBlock = "";
					blockEndTag = "";
				}

				depth++;
				blockStartTag = token.src;
				break;

			case "block-end":
				depth--;
				blockEndTag = token.src;

				/*
     * We try to match the most deep blocks so discard any other blocks that have been started but not
     * finished.
     */
				if ("" !== blockStartTag && "" !== blockEndTag) {
					blocks.push(blockStartTag + currentBlock + blockEndTag);
				} else if ("" !== currentBlock.trim()) {
					blocks.push(currentBlock);
				}
				blockStartTag = "";
				currentBlock = "";
				blockEndTag = "";
				break;
		}

		// Handles HTML with too many closing tags.
		if (depth < 0) {
			depth = 0;
		}
	});

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize(getBlocks)
};

},{"lodash/forEach":181,"lodash/memoize":207,"tokenizer2/core":220}],8:[function(require,module,exports){
"use strict";

var SyllableCountStep = require("./syllableCountStep.js");

var isUndefined = require("lodash/isUndefined");
var forEach = require("lodash/forEach");

/**
 * Creates a syllable count iterator.
 *
 * @param {object} config The config object containing an array with syllable exclusions.
 * @constructor
 */
var SyllableCountIterator = function SyllableCountIterator(config) {
  this.countSteps = [];
  if (!isUndefined(config)) {
    this.createSyllableCountSteps(config.deviations.vowels);
  }
};

/**
 * Creates a syllable count step object for each exclusion.
 *
 * @param {object} syllableCounts The object containing all exclusion syllables including the multipliers.
 * @returns {void}
 */
SyllableCountIterator.prototype.createSyllableCountSteps = function (syllableCounts) {
  forEach(syllableCounts, function (syllableCountStep) {
    this.countSteps.push(new SyllableCountStep(syllableCountStep));
  }.bind(this));
};

/**
 * Returns all available count steps.
 *
 * @returns {Array} All available count steps.
 */
SyllableCountIterator.prototype.getAvailableSyllableCountSteps = function () {
  return this.countSteps;
};

/**
 * Counts the syllables for all the steps and returns the total syllable count.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions.
 */
SyllableCountIterator.prototype.countSyllables = function (word) {
  var syllableCount = 0;
  forEach(this.countSteps, function (step) {
    syllableCount += step.countSyllables(word);
  });
  return syllableCount;
};

module.exports = SyllableCountIterator;

},{"./syllableCountStep.js":9,"lodash/forEach":181,"lodash/isUndefined":203}],9:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");

var arrayToRegex = require("../stringProcessing/createRegexFromArray.js");

/**
 * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions.
 * @constructor
 */
var SyllableCountStep = function SyllableCountStep(syllableRegex) {
  this._hasRegex = false;
  this._regex = "";
  this._multiplier = "";
  this.createRegex(syllableRegex);
};

/**
 * Returns if a valid regex has been set.
 *
 * @returns {boolean} True if a regex has been set, false if not.
 */
SyllableCountStep.prototype.hasRegex = function () {
  return this._hasRegex;
};

/**
 * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
 * @returns {void}
 */
SyllableCountStep.prototype.createRegex = function (syllableRegex) {
  if (!isUndefined(syllableRegex) && !isUndefined(syllableRegex.fragments)) {
    this._hasRegex = true;
    this._regex = arrayToRegex(syllableRegex.fragments, true);
    this._multiplier = syllableRegex.countModifier;
  }
};

/**
 * Returns the stored regular expression.
 *
 * @returns {RegExp} The stored regular expression.
 */
SyllableCountStep.prototype.getRegex = function () {
  return this._regex;
};

/**
 * Matches syllable exclusions in a given word and the returns the number found multiplied with the
 * given multiplier.
 *
 * @param {String} word The word to match for syllable exclusions.
 * @returns {number} The amount of syllables found.
 */
SyllableCountStep.prototype.countSyllables = function (word) {
  if (this._hasRegex) {
    var match = word.match(this._regex) || [];
    return match.length * this._multiplier;
  }
  return 0;
};

module.exports = SyllableCountStep;

},{"../stringProcessing/createRegexFromArray.js":21,"lodash/isUndefined":203}],10:[function(require,module,exports){
"use strict";

var transitionWords = require("./transitionWords.js")().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher.
 * @returns {Array} The array filled with exceptions.
 */

var articles = ["de", "het", "een", "der", "des", "den"];

var numerals = ["eén", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien", "twintig", "eerste", "tweede", "derde", "vierde", "vijfde", "zesde", "zevende", "achtste", "negende", "tiende", "elfde", "twaalfde", "dertiende", "veertiende", "vijftiende", "zestiende", "zeventiende", "achttiende", "negentiende", "twinstigste", "honderd", "honderden", "duizend", "duizenden", "miljoen", "miljoenen", "biljoen", "biljoenen"];

// 'Het' is already included in the list of articles.
var personalPronounsNominative = ["ik", "je", "jij", "hij", "ze", "we", "wij", "jullie", "zij", "u", "ge", "gij"];
var personalPronounsAccusative = ["mij", "jou", "hem", "haar", "hen", "hun", "uw"];
var demonstrativePronouns = ["dit", "dat", "deze", "die", "zelf"];

// What to do with 'zijn', since it is also a verb?
var possessivePronouns = ["mijn", "mijne", "jouw", "jouwe", "zijne", "hare", "ons", "onze", "hunne", "uwe"];
var quantifiers = ["alle", "sommige", "sommigen", "allen", "weinig", "weinige", "weinigen", "veel", "vele", "velen", "geen", "beetje", "elke", "elk", "genoeg", "meer", "meest", "meeste", "meesten", "paar", "zoveel", "enkele", "enkelen", "zoveelste", "hoeveelste", "laatste", "laatsten", "ieder", "iedere", "allemaal", "alles", "al", "zekere", "ander", "andere", "gene", "enig", "enige", "verscheidene", "verschillende", "voldoende", "wat", "allerlei", "allerhande", "enerlei", "enerhande", "beiderlei", "beiderhande", "tweeërlei", "tweeërhande", "drieërlei", "drieërhande", "velerlei", "velerhande", "menigerlei", "menigerhande", "enigerlei", "enigerhande", "generlei", "generhande"];

var reflexivePronouns = ["mezelf", "mijzelf", "jezelf", "jouzelf", "zichzelf", "haarzelf", "hemzelf", "onszelf", "julliezelf", "henzelf", "hunzelf", "uzelf", "zich"];

var reciprocalPronouns = ["mekaar", "elkaar", "elkander", "mekander"];

var indefinitePronouns = ["iedereen", "ieder", "eenieder", "alleman", "allen", "alles", "iemand", "niemand", "iets", "niets", "menigeen"];

var indefinitePronounsPossessive = ["ieders", "aller", "iedereens", "eenieders"];

var interrogativePronouns = ["welke", "welk", "wat", "wie", "wiens", "wier"];

var interrogativeAdverbs = ["hoe", "waarom", "waar", "hoezo", "wanneer", "hoeveel"];

var pronominalAdverbs = ["daaraan", "daarachter", "daaraf", "daarbij", "daarbinnen", "daarboven", "daarbuiten", "daardoor", "daardoorheen", "daarheen", "daarin", "daarjegens", "daarmede", "daarmee", "daarna", "daarnaar", "daarnaartoe", "daarnaast", "daarom", "daaromtrent", "daaronder", "daarop", "daarover", "daaroverheen", "daarrond", "daartegen", "daartoe", "daartussen", "daartussenuit", "daaruit", "daarvan", "daarvandaan", "daarvoor", "eraan", "erachter", "erachteraan", "eraf", "erbij", "erbinnen", "erboven", "erbuiten", "erdoor", "erdoorheen", "erheen", "erin", "erjegens", "ermede", "ermee", "erna", "ernaar", "ernaartoe", "ernaast", "erom", "eromtrent", "eronder", "eronderdoor", "erop", "eropaf", "eropuit", "erover", "eroverheen", "errond", "ertegen", "ertegenaan", "ertoe", "ertussen", "ertussenuit", "eruit", "ervan", "ervandaan", "ervandoor", "ervoor", "hieraan", "hierachter", "hieraf", "hierbij", "hierbinnen", "hierboven", "hierbuiten", "hierdoor", "hierdoorheen", "hierheen", "hierin", "hierjegens", "hierlangs", "hiermede", "hiermee", "hierna", "hiernaar", "hiernaartoe", "hiernaast", "hierom", "hieromheen", "hieromtrent", "hieronder", "hierop", "hierover", "hieroverheen", "hierrond", "hiertegen", "hiertoe", "hiertussen", "hiertussenuit", "hieruit", "hiervan", "hiervandaan", "hiervoor", "vandaan", "waaraan", "waarachter", "waaraf", "waarbij", "waarboven", "waarbuiten", "waardoor", "waardoorheen", "waarheen", "waarin", "waarjegens", "waarmede", "waarmee", "waarna", "waarnaar", "waarnaartoe", "waarnaast", "waaronder", "waarop", "waarover", "waaroverheen", "waarrond", "waartegen", "waartegenin", "waartoe", "waartussen", "waartussenuit", "waaruit", "waarvan", "waarvandaan", "waarvoor"];

var locativeAdverbs = ["daar", "hier", "ginder", "daarginds", "ginds", "ver", "veraf", "ergens", "nergens", "overal", "dichtbij", "nabij", "kortbij"];

var filteredPassiveAuxiliaries = ["word", "wordt", "werd", "werden", "ben", "bent", "is", "was", "waren"];

var infinitivePassiveAuxiliaries = ["worden", "zijn"];

var otherAuxiliaries = ["heb", "hebt", "heeft", "hebben", "hadden", "had", "kun", "kan", "kunt", "kunnen", "kon", "konden", "mag", "mogen", "mocht", "mochten", "dien", "dient", "dienen", "diende", "dienden", "moet", "moeten", "moest", "moesten", "ga", "gaat", "gaan", "ging", "gingen"];

// 'Vóórkomen' (appear) is not included, because we don't want to filter out 'voorkómen' (prevent).
var copula = ["blijken", "blijkt", "blijk", "bleek", "bleken", "gebleken", "dunken", "dunkt", "dunk", "dunkte", "dunkten", "gedunkt", "heet", "heten", "heette", "heetten", "geheten", "lijkt", "lijk", "lijken", "geleken", "leek", "leken", "schijnen", "schijn", "schijnt", "scheen", "schenen", "toescheen", "toeschijnt", "toeschijnen", "toeschijn", "toeschenen"];

var prepositions = ["à", "aan", "aangaande", "achter", "behalve", "behoudens", "beneden", "benevens", "benoorden", "benoordoosten", "benoordwesten", "beoosten", "betreffende", "bewesten", "bezijden", "bezuiden", "bezuidoosten", "bezuidwesten", "bij", "binnen", "blijkens", "boven", "bovenaan", "buiten", "circa", "conform", "contra", "cum", "dankzij", "door", "gedurende", "gezien", "in", "ingevolge", "inzake", "jegens", "krachtens", "langs", "luidens", "met", "middels", "mits", "na", "naar", "naast", "nabij", "namens", "nevens", "niettegenstaande", "nopens", "om", "omstreeks", "omtrent", "ondanks", "onder", "onderaan", "ongeacht", "onverminderd", "op", "over", "overeenkomstig", "per", "plus", "post", "richting", "rond", "rondom", "sedert", "sinds", "spijts", "staande", "te", "tegen", "tegenover", "ten", "ter", "tijdens", "tot", "tussen", "uit", "uitgezonderd", "van", "vanaf", "vanuit", "vanwege", "versus", "via", "vis-à-vis", "volgens", "voor", "voorbij", "wegens", "zijdens", "zonder"];

// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = ["af", "buiten", "door", "heen", "mee", "toe", "vandaan", "achterop", "onderin", "voorin", "bovenaan", "bovenop", "buitenop", "onderaan", "achteraan", "onderop", "binnenin", "tevoren", "erin", "daarnaast"];

var coordinatingConjunctions = ["en", "noch", "alsmede", "alsook", "maar", "doch", "of", "ofwel", "dan", "want", "dus"];

/* 'Zowel' and 'als' are part of 'zowel...als', 'evenmin' is part of 'evenmin...als', 'zomin' is part of 'zomin...als',
 'hetzij' is part of 'hetzij...hetzij'. */
var correlativeConjunctions = ["zowel", "als", "evenmin", "zomin", "hetzij"];

var subordinatingConjunctions = ["omdat", "doordat", "aangezien", "vermits", "dewijl", "dorodien", "naardien", "nademaal", "overmits", "wijl", "voordat", "eer", "eerdat", "aleer", "vooraleer", "alvorens", "tot", "totdat", "terwijl", "zolang", "zodra", "sinds", "sedert", "toen", "nu", "nadat", "zodat", "opdat", "teneinde", "indien", "ingeval", "tenware", "hoewel", "alhoewel", "ofschoon", "hoezeer", "behalve", "uitgezonderd", "zoverre", "zover", "naargelang", "naarmate", "alsof", "zoals", "evenals"];

// These verbs are frequently used in interviews to indicate questions and answers.
var interviewVerbs = ["zegt", "zei", "aldus", "vraagt", "vroeg", "denkt", "dacht", "stelt", "pleit", "pleitte"];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["absoluut", "zeker", "ongetwijfeld", "sowieso", "onmiddelijk", "meteen", "inclusief", "direct", "ogenblikkelijk", "terstond", "namelijk", "natuurlijk", "vanzelfsprekend", "tegenwoordig", "gewoonlijk", "normaliter", "doorgaans", "werkelijk", "daadwerkelijk", "inderdaad", "uiteindelijk", "waarachtig", "oprecht", "bijna", "meestal", "misschien", "waarschijnlijk", "wellicht", "mogelijk", "vermoedelijk", "ongetwijfeld", "allicht", "aannemelijk", "oorspronkelijk", "aanvankelijk", "allereerst", "initieel", "eigenlijk", "feitelijk", "wezenlijk", "juist", "reeds", "alvast", "bijv.", "vaak", "dikwijls", "veelal", "geregeld", "menigmaal", "regelmatig", "veelvuldig", "eenvoudigweg", "simpelweg", "louter", "kortweg", "stomweg", "domweg", "zomaar", "eventueel", "mogelijkerwijs", "eens", "weleens", "nooit", "ooit", "anders", "momenteel", "thans", "incidenteel", "trouwens", "elders", "volgend", "recent", "onlangs", "recentelijk", "laatst", "zojuist", "relatief", "duidelijk", "overduidelijk", "klaarblijkelijk", "nadrukkelijk", "ogenschijnlijk", "duidelijk", "kennelijk", "schijnbaar", "alweer", "continu", "herhaaldelijk", "nog", "steeds"];

var intensifiers = ["zeer", "erg", "redelijk", "flink", "beetje", "tikkeltje", "bijzonder", "ernstig", "enigszins", "hoe", "zo", "wat", "tamelijk", "nogal", "vrij", "genoeg", "behoorlijk", "hard", "zwaar", "heel", "hele", "reuze", "buitengewoon", "ontzettend", "vreselijk"];

// These verbs convey little meaning.
var delexicalisedVerbs = ["laten", "laat", "liet", "lieten", "komen", "kom", "komt", "kwam", "kwamen", "maken", "maakt", "maak", "maakte", "maakten", "doen", "doe", "doet", "deed", "deden", "vinden", "vindt", "vind", "vond", "vonden"];

/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
Keyword combinations containing these adjectives/adverbs are fine. */
var generalAdjectivesAdverbs = ["nieuw", "nieuwe", "nieuwer", "nieuwere", "nieuwst", "nieuwste", "oud", "oude", "ouder", "oudere", "oudst", "oudste", "vorig", "vorige", "goed", "goede", "beter", "betere", "best", "beste", "groot", "grote", "groter", "grotere", "grootst", "grootste", "makkelijk", "makkelijke", "makkelijker", "makkelijkere", "makkelijkst", "makkelijste", "gemakkelijk", "gemakkelijke", "gemakkelijker", "gemakkelijkere", "gemakkelijkst", "gemakkelijste", "simpel", "simpele", "simpeler", "simpeler", "simpelst", "simpelste", "snel", "snelle", "sneller", "snellere", "snelst", "snelste", "ver", "verre", "verder", "verdere", "verst", "verste", "lang", "lange", "langer", "langere", "langst", "langste", "hard", "harde", "harder", "hardere", "hardst", "hardste", "weinig", "weinige", "minder", "mindere", "minst", "minste", "eigen", "laag", "lage", "lager", "lagere", "laagst", "laagste", "hoog", "hoge", "hoger", "hogere", "hoogst", "hoogste", "klein", "kleine", "kleiner", "kleinere", "kleinst", "kleinste", "kort", "korte", "korter", "kortere", "kortst", "kortste", "zekere", "herhaaldelijke", "directe", "ongeveer", "slecht", "slechte", "slechter", "slechtere", "slechtst", "slechtste", "zulke", "zulk", "zo'n", "zulks", "er", "extreem", "extreme", "bijbehorende", "bijbehorend"];

var interjections = ["oh", "wauw", "hèhè", "hè", "hé", "au", "ai", "jaja", "welja", "jawel", "ssst", "heremijntijd", "hemeltjelief", "aha", "er", "foei", "hmm", "nou", "nee", "tja", "nja", "okido", "ho", "halt", "komaan", "komop", "verrek", "nietwaar", "brr", "oef", "ach", "och", "bah", "enfin", "afijn", "haha", "hihi", "hatsjie", "hatsjoe", "hm", "tring", "vroem", "boem", "hopla"];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["ml", "cl", "dl", "l", "tl", "el", "mg", "g", "gr", "kg", "ca", "theel", "min", "sec", "uur"];

var vagueNouns = ["ding", "dingen", "manier", "manieren", "item", "items", "keer", "maal", "procent", "geval", "aspect", "persoon", "personen", "deel"];

var miscellaneous = ["niet", "wel", "ja", "nee", "neen", "oké", "oke", "okee", "ok", "niets", "zoiets", "%", "€", "euro"];

/*
Exports all function words concatenated, and specific word categories and category combinations
to be used as filters for the prominent words.
 */

module.exports = function () {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat(personalPronounsAccusative, possessivePronouns),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat(subordinatingConjunctions),
		verbs: filteredPassiveAuxiliaries.concat(infinitivePassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs),
		quantifiers: quantifiers,
		relativePronouns: interrogativePronouns.concat(interrogativeAdverbs),
		passiveAuxiliaries: filteredPassiveAuxiliaries,
		transitionWords: transitionWords.concat(additionalTransitionWords),
		miscellaneous: miscellaneous,
		pronominalAdverbs: pronominalAdverbs,
		interjections: interjections,
		reflexivePronouns: reflexivePronouns,
		reciprocalPronouns: reciprocalPronouns,
		all: articles.concat(numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, reciprocalPronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, indefinitePronounsPossessive, interrogativePronouns, interrogativeAdverbs, pronominalAdverbs, locativeAdverbs, prepositionalAdverbs, filteredPassiveAuxiliaries, infinitivePassiveAuxiliaries, otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous)
	};
};

},{"./transitionWords.js":11}],11:[function(require,module,exports){
"use strict";

var singleWords = ["aangezien", "al", "aldus", "allereerst", "als", "alsook", "anderzijds", "bijgevolg", "bijvoorbeeld", "bovendien", "concluderend", "daardoor", "daarentegen", "daarmee", "daarna", "daarnaast", "daarom", "daartoe", "daarvoor", "dadelijk", "dan", "desondanks", "dienovereenkomstig", "dientegevolge", "doch", "doordat", "dus", "echter", "eerst", "evenals", "eveneens", "evenzeer", "hierom", "hoewel", "immers", "indien", "integendeel", "intussen", "kortom", "later", "maar", "mits", "nadat", "namelijk", "net als", "niettemin", "noch", "nu", "ofschoon", "omdat", "ondanks", "ondertussen", "ook", "opdat", "resumerend", "samengevat", "samenvattend", "tegenwoordig", "teneinde", "tenzij", "terwijl", "tevens", "toch", "toen", "uiteindelijk", "vanwege", "verder", "vervolgens", "voorafgaand", "vooralsnog", "voordat", "voorts", "vroeger", "waardoor", "waarmee", "waaronder", "wanneer", "want", "zo", "zoals", "zodat", "zodoende", "zodra"];

var multipleWords = ["aan de andere kant", "aan de ene kant", "aangenomen dat", "al met al", "alles afwegend", "alles bij elkaar", "alles in aanmerking nemend", "als gevolg van", "anders gezegd", "daar staat tegenover", "daarbij komt", "daaruit volgt", "dat betekent", "dat blijkt uit", "de oorzaak daarvan is", "de oorzaak hiervan is", "door middel van", "een voorbeeld hiervan", "een voorbeeld van", "gesteld dat", "hetzelfde als", "hieruit kunnen we afleiden", "hieruit volgt", "hoe het ook zij", "in de derde plaats", "in de eerste plaats", "in de tweede plaats", "in één woord", "in het bijzonder", "in het geval dat", "in plaats van", "in tegenstelling tot", "in vergelijking met", "maar ook", "met als doel", "met andere woorden", "met behulp van", "met de bedoeling", "neem nou", "net als", "om kort te gaan", "onder andere", "op dezelfde wijze", "stel dat", "te danken aan", "te wijten aan", "ten derde", "ten eerste", "ten gevolge van", "ten slotte", "ten tweede", "ter conclusie", "ter illustratie", "ter verduidelijking", "tot nog toe", "tot slot", "vandaar dat", "vergeleken met", "voor het geval dat"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

},{}],12:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().notFilteredAuxiliaries;
var transitionWords = require("./transitionWords.js")().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher
 * @returns {Array} The array filled with exceptions.
 */

var articles = ["the", "an", "a"];
var numerals = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "hundred", "hundreds", "thousand", "thousands", "million", "million", "billion", "billions"];
var personalPronounsNominative = ["i", "you", "he", "she", "it", "we", "they"];
var personalPronounsAccusative = ["me", "him", "her", "us", "them"];
var demonstrativePronouns = ["this", "that", "these", "those"];
var possessivePronouns = ["my", "your", "his", "her", "its", "their", "our", "mine", "yours", "hers", "theirs", "ours"];
var quantifiers = ["all", "some", "many", "few", "lot", "lots", "tons", "bit", "no", "every", "enough", "little", "less", "much", "more", "most", "plenty", "several", "few", "fewer", "many", "kind"];
var reflexivePronouns = ["myself", "yourself", "himself", "herself", "itself", "oneself", "ourselves", "yourselves", "themselves"];
var indefinitePronouns = ["none", "nobody", "everyone", "everybody", "someone", "somebody", "anyone", "anybody", "nothing", "everything", "something", "anything", "each", "another", "other", "whatever", "whichever", "whoever", "whomever", "whomsoever", "whosoever", "others", "neither", "both", "either", "any", "such"];
var indefinitePronounsPossessive = ["one's", "nobody's", "everyone's", "everybody's", "someone's", "somebody's", "anyone's", "anybody's", "nothing's", "everything's", "something's", "anything's", "whoever's", "others'", "other's", "another's", "neither's", "either's"];

var interrogativeDeterminers = ["which", "what", "whose"];
var interrogativePronouns = ["who", "whom"];
var interrogativeProAdverbs = ["where", "whither", "whence", "how", "why", "whether", "wherever", "whomever", "whenever", "however", "whyever", "whoever", "whatever", "wheresoever", "whomsoever", "whensoever", "howsoever", "whysoever", "whosoever", "whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso"];
var pronominalAdverbs = ["therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby"];
var locativeAdverbs = ["there", "here", "whither", "thither", "hither", "whence", "thence", "hence"];
var adverbialGenitives = ["always", "afterwards", "towards", "once", "twice", "thrice", "amidst", "amongst", "midst", "whilst"];
var otherAuxiliaries = ["can", "cannot", "can't", "could", "couldn't", "could've", "dare", "dares", "dared", "daring", "do", "don't", "does", "doesn't", "did", "didn't", "doing", "done", "have", "haven't", "had", "hadn't", "has", "hasn't", "having", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd", "would", "wouldn't", "would've", "may", "might", "must", "need", "needn't", "needs", "ought", "shall", "shalln't", "shan't", "should", "shouldn't", "will", "won't", "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "there's", "there're", "there'll", "here's", "here're", "there'll"];
var copula = ["appear", "appears", "appearing", "appeared", "become", "becomes", "becoming", "became", "come", "comes", "coming", "came", "keep", "keeps", "kept", "keeping", "remain", "remains", "remaining", "remained", "stay", "stays", "stayed", "staying", "turn", "turns", "turned"];

var prepositions = ["in", "from", "with", "under", "throughout", "atop", "for", "on", "until", "of", "to", "aboard", "about", "above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "midst", "mid", "among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "before", "afore", "tofore", "behind", "ahind", "below", "ablow", "beneath", "neath", "beside", "besides", "between", "atween", "beyond", "ayond", "but", "by", "chez", "circa", "come", "despite", "spite", "down", "during", "except", "into", "less", "like", "minus", "near", "nearer", "nearest", "anear", "notwithstanding", "off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua", "sans", "sauf", "since", "sithence", "than", "through", "thru", "truout", "toward", "underneath", "unlike", "until", "up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago", "apart", "aside", "aslant", "away", "withal"];

// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = ["back", "within", "forward", "backward", "ahead"];

var coordinatingConjunctions = ["so", "and", "nor", "but", "or", "yet", "for"];

// 'Rather' is part of 'rather...than', 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
var correlativeConjunctions = ["rather", "sooner", "just", "only"];
var subordinatingConjunctions = ["after", "although", "when", "as", "if", "though", "because", "before", "even", "since", "unless", "whereas", "while"];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'states' are not included, because these words are also nouns.
var interviewVerbs = ["say", "says", "said", "saying", "claimed", "ask", "asks", "asked", "asking", "stated", "stating", "explain", "explains", "explained", "think", "thinks"];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["and", "or", "about", "absolutely", "again", "definitely", "eternally", "expressively", "expressly", "extremely", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays", "ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "first", "second", "third", "maybe", "probably", "granted", "initially", "overall", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply", "optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally", "elsewhere", "following", "particular", "recently", "relatively", "f.i", "clearly", "apparently"];

var intensifiers = ["highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite", "somewhat", "seriously", "fairly", "fully", "amazingly"];

// These verbs convey little meaning. 'Show', 'shows', 'uses', "meaning" are not included, because these words could be relevant nouns.
var delexicalisedVerbs = ["seem", "seems", "seemed", "seeming", "let", "let's", "lets", "letting", "make", "making", "makes", "made", "want", "showing", "showed", "shown", "go", "goes", "going", "went", "gone", "take", "takes", "took", "taken", "set", "sets", "setting", "put", "puts", "putting", "use", "using", "used", "try", "tries", "tried", "trying", "mean", "means", "meant", "called", "based", "add", "adds", "adding", "added", "contain", "contains", "containing", "contained"];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best", "big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest", "least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher", "highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest", "short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual", "so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly", "continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar", "widely", "bad", "worse", "worst", "great"];

var interjections = ["oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha", "yikes"];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl", "l", "mg", "g", "kg", "quart"];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = ["thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times", "part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "idea", "theme", "person"];

// 'No' is already included in the quantifier list.
var miscellaneous = ["not", "yes", "rid", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "%"];

module.exports = function () {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat(personalPronounsAccusative, possessivePronouns),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat(subordinatingConjunctions),
		verbs: filteredPassiveAuxiliaries.concat(notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat(interrogativePronouns, interrogativeProAdverbs),
		passiveAuxiliaries: filteredPassiveAuxiliaries,
		transitionWords: transitionWords.concat(additionalTransitionWords),
		miscellaneous: miscellaneous,
		pronominalAdverbs: pronominalAdverbs,
		interjections: interjections,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat(numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, indefinitePronounsPossessive, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous)
	};
};

},{"./passivevoice/auxiliaries.js":13,"./transitionWords.js":14}],13:[function(require,module,exports){
"use strict";

// These auxiliaries are filtered from the beginning of word combinations in the prominent words.
var filteredAuxiliaries = ["am", "is", "are", "was", "were", "been", "get", "gets", "got", "gotten", "be", "she's", "he's", "it's", "i'm", "we're", "they're", "you're", "isn't", "weren't", "wasn't", "that's", "aren't"];

// These auxiliaries are not filtered from the beginning of word combinations in the prominent words.
var notFilteredAuxiliaries = ["being", "getting", "having", "what's"];

module.exports = function () {
	return {
		filteredAuxiliaries: filteredAuxiliaries,
		notFilteredAuxiliaries: notFilteredAuxiliaries,
		all: filteredAuxiliaries.concat(notFilteredAuxiliaries)
	};
};

},{}],14:[function(require,module,exports){
"use strict";

/** @module config/transitionWords */

var singleWords = ["accordingly", "additionally", "afterward", "afterwards", "albeit", "also", "although", "altogether", "another", "basically", "because", "before", "besides", "but", "certainly", "chiefly", "comparatively", "concurrently", "consequently", "contrarily", "conversely", "correspondingly", "despite", "doubtedly", "during", "e.g.", "earlier", "emphatically", "equally", "especially", "eventually", "evidently", "explicitly", "finally", "firstly", "following", "formerly", "forthwith", "fourthly", "further", "furthermore", "generally", "hence", "henceforth", "however", "i.e.", "identically", "indeed", "instead", "last", "lastly", "later", "lest", "likewise", "markedly", "meanwhile", "moreover", "nevertheless", "nonetheless", "nor", "notwithstanding", "obviously", "occasionally", "otherwise", "overall", "particularly", "presently", "previously", "rather", "regardless", "secondly", "shortly", "significantly", "similarly", "simultaneously", "since", "so", "soon", "specifically", "still", "straightaway", "subsequently", "surely", "surprisingly", "than", "then", "thereafter", "therefore", "thereupon", "thirdly", "though", "thus", "till", "too", "undeniably", "undoubtedly", "unless", "unlike", "unquestionably", "until", "when", "whenever", "whereas", "while"];
var multipleWords = ["above all", "after all", "after that", "all in all", "all of a sudden", "all things considered", "analogous to", "although this may be true", "analogous to", "another key point", "as a matter of fact", "as a result", "as an illustration", "as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown", "as long as", "as much as", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last", "at least", "at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time", "balanced against", "being that", "by all means", "by and large", "by comparison", "by the same token", "by the time", "compared to", "be that as it may", "coupled with", "different from", "due to", "equally important", "even if", "even more", "even so", "even though", "first thing to remember", "for example", "for fear that", "for instance", "for one thing", "for that reason", "for the most part", "for the purpose of", "for the same reason", "for this purpose", "for this reason", "from time to time", "given that", "given these points", "important to realize", "in a word", "in addition", "in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast", "in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of", "in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality", "in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that", "in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of", "in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place", "in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as", "most compelling evidence", "most important", "must be remembered", "not to mention", "now that", "of course", "on account of", "on balance", "on condition that", "on one hand", "on the condition that", "on the contrary", "on the negative side", "on the other hand", "on the positive side", "on the whole", "on this occasion", "once", "once in a while", "only if", "owing to", "point often overlooked", "prior to", "provided that", "seeing that", "so as to", "so far", "so long as", "so that", "sooner or later", "such as", "summing up", "take the case of", "that is", "that is to say", "then again", "this time", "to be sure", "to begin with", "to clarify", "to conclude", "to demonstrate", "to emphasize", "to enumerate", "to explain", "to illustrate", "to list", "to point out", "to put it another way", "to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up", "to summarize", "to that end", "to the end that", "to this end", "together with", "under those circumstances", "until now", "up against", "up to the present time", "vis a vis", "what's more", "while it may be true", "while this may be true", "with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind", "without a doubt", "without delay", "without doubt", "without reservation"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

},{}],15:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().filteredAuxiliaries;
var infinitivePassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().infinitiveAuxiliaries;
var transitionWords = require("./transitionWords.js")().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher
 * @returns {Array} The array filled with exceptions.
 */

var articles = ["das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines"];

var numerals = ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "zwoelf", "dreizehn", "vierzehn", "fünfzehn", "fuenfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "erste", "erster", "ersten", "erstem", "erstes", "zweite", "zweites", "zweiter", "zweitem", "zweiten", "dritte", "dritter", "drittes", "dritten", "drittem", "vierter", "vierten", "viertem", "viertes", "vierte", "fünfte", "fünfter", "fünfted", "fünften", "fünftem", "fuenfte", "fuenfter", "fuenftem", "fuenften", "fuenftes", "sechste", "sechster", "sechstes", "sechsten", "sechstem", "siebte", "siebter", "siebten", "siebtem", "siebtes", "achte", "achter", "achten", "achtem", "achtes", "neunte", "neunter", "neuntes", "neunten", "neuntem", "zehnte", "zehnter", "zehnten", "zehntem", "zehntes", "elfte", "elfter", "elftes", "elften", "elftem", "zwölfte", "zwölfter", "zwölften", "zwölftem", "zwölftes", "zwoelfte", "zwoelfter", "zwoelften", "zwoelftem", "zwoelftes", "dreizehnte", "dreizehnter", "dreizehntes", "dreizehnten", "dreizehntem", "vierzehnte", "vierzehnter", "vierzehntes", "vierzehnten", "vierzehntem", "fünfzehnte", "fünfzehnten", "fünfzehntem", "fünfzehnter", "fünfzehntes", "fuenfzehnte", "fuenfzehnten", "fuenfzehntem", "fuenfzehnter", "fuenfzehntes", "sechzehnte", "sechzehnter", "sechzehnten", "sechzehntes", "sechzehntem", "siebzehnte", "siebzehnter", "siebzehntes", "siebzehntem", "siebzehnten", "achtzehnter", "achtzehnten", "achtzehntem", "achtzehntes", "achtzehnte", "nehnzehnte", "nehnzehnter", "nehnzehntem", "nehnzehnten", "nehnzehntes", "zwanzigste", "zwanzigster", "zwanzigstem", "zwanzigsten", "zwanzigstes", "hundert", "einhundert", "zweihundert", "zweihundert", "dreihundert", "vierhundert", "fünfhundert", "fuenfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert", "tausend", "million", "milliarde", "billion", "billiarde"];

var personalPronounsNominative = ["ich", "du", "er", "sie", "es", "wir", "ihr", "sie"];

var personalPronounsAccusative = ["mich", "dich", "ihn", "sie", "es", "uns", "euch"];

var personalPronounsDative = ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"];

var demonstrativePronouns = ["denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches", "derjenige", "desjenigen", "demjenigen", "denjenigen", "diejenige", "derjenigen", "dasjenige", "diejenigen"];

var possessivePronouns = ["mein", "meine", "meinem", "meiner", "meines", "dein", "deine", "deinem", "deiner", "deines", "deinen", "sein", "seine", "seinem", "seiner", "seines", "ihr", "ihre", "ihrem", "ihren", "ihrer", "ihres", "unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer", "eures"];

var quantifiers = ["manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "all", "alle", "aller", "alles", "allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "manch", "wenige", "weniger", "wenigen", "wenigem", "weniges", "wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig", "bisschen", "paar", "kein", "keines", "keinem", "keinen", "keine", "mehr", "mehrere", "nichts", "genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene", "verschiedener", "verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen", "verschiednem", "verschiednes", "art", "arten", "sorte", "sorten"];

var reflexivePronouns = ["mich", "mir", "dich", "dir", "sich", "uns", "euch"];

// "Welch", "welcher", and "welches" are already included in the demonstrativePronouns.
var indefinitePronouns = ["andere", "anderer", "anderem", "anderen", "anderes", "andren", "andern", "andrem", "anderm", "andre", "andrer", "andres", "beide", "beides", "beidem", "beider", "beiden", "etwas", "irgendetwas", "irgendein", "irgendeinen", "irgendeinem", "irgendeines", "irgendeine", "irgendeiner", "irgendwas", "irgendwessen", "irgendwer", "irgendwen", "irgendwem", "irgendwessen", "irgendwelche", "irgendwelcher", "irgendwelchem", "irgendwelchen", "irgendwelches", "irgendjemand", "irgendjemanden", "irgendjemandem", "irgendjemandes", "irgendwie", "wer", "wen", "wem", "wessen", "was", "wessen", "welchen", "welchem", "welche", "jeder", "jedes", "jedem", "jeden", "jede", "jedweder", "jedweden", "jedwedem", "jedwedes", "jedwede", "jeglicher", "jeglichen", "jeglichem", "jegliches", "jegliche", "jedermann", "jedermanns", "jemand", "jemanden", "jemandem", "jemands", "jemandes", "man", "meinesgleichen", "niemanden", "niemandem", "niemands", "niemandes", "niemand", "sämtlich", "saemtlich", "sämtlicher", "saemtlicher", "sämtlichen", "saemtlichen", "sämtlichem", "saemtlichem", "sämtliches", "saemtliches", "sämtliche", "saemtliche", "solche", "solcher", "solchen", "solchem", "solches", "niemand", "niemanden", "niemandem", "niemandes", "niemands", "nichts", "jeglicher", "jeglichen", "jeglichem", "jegliches", "jegliche", "zweiter"];

var relativePronouns = ["dessen", "deren", "derer", "denen", "wes"];

var interrogativeProAdverbs = ["warum", "wie", "wo", "woher", "wohin", "wann"];

var pronominalAdverbs = ["dabei", "dadurch", "dafür", "dafuer", "dagegen", "dahinter", "damit", "danach", "daneben", "daran", "darauf", "daraus", "darin", "darum", "darunter", "darüber", "darueber", "davon", "davor", "dazu", "dazwischen", "hieran", "hierauf", "hieraus", "hierbei", "hierdurch", "hierfuer", "hierfür", "hiergegen", "hierhinter", "hierin", "hiermit", "hiernach", "hierum", "hierunter", "hierueber", "hierüber", "hiervor", "hierzu", "hierzwischen", "hierneben", "hiervon", "wobei", "wodurch", "worin", "worauf", "wobei", "wofür", "wofuer", "wogegen", "wohinter", "womit", "wonach", "woneben", "woran", "worauf", "woraus", "worin", "worum", "worunter", "worüber", "worueber", "wovon", "wovor", "wozu", "wozwischen"];

var locativeAdverbs = ["da", "hier", "dorthin", "hierher", "whence", "dorther", "daher"];

var adverbialGenitives = ["allenfalls", "keinesfalls", "anderenfalls", "andernfalls", "andrenfalls", "äußerstenfalls", "bejahendenfalls", "bestenfalls", "ebenfalls", "eintretendenfalls", "entgegengesetztenfalls", "erforderlichenfalls", "gegebenenfalls", "geringstenfalls", "gleichfalls", "günstigenfalls", "günstigstenfalls", "höchstenfalls", "jedenfalls", "möglichenfalls", "notfalls", "nötigenfalls", "notwendigenfalls", "schlimmstenfalls", "vorkommendenfalls", "widrigenfalls", "zutreffendenfalls", "angesichts", "morgens", "mittags", "abends", "nachts", "keineswegs", "durchwegs", "geradenwegs", "geradeswegs", "geradewegs", "gradenwegs", "halbwegs", "mittwegs", "unterwegs"];

var otherAuxiliaries = ["habe", "hast", "hat", "habt", "habest", "habet", "hatte", "hattest", "hatten", "hätte", "haette", "hättest", "haettest", "hätten", "haetten", "haettet", "hättet", "hab", "bin", "bist", "ist", "sind", "sei", "seiest", "seien", "seiet", "war", "warst", "waren", "wart", "wäre", "waere", "wärest", "waerest", "wärst", "waerst", "wären", "waeren", "wäret", "waeret", "wärt", "waert", "seid", "darf", "darfst", "dürft", "duerft", "dürfe", "duerfe", "dürfest", "duerfest", "dürfet", "duerfet", "durfte", "durftest", "durften", "durftet", "dürfte", "duerfte", "dürftest", "duerftest", "dürften", "duerften", "dürftet", "duerftet", "kann", "kannst", "könnt", "koennt", "könne", "koenne", "könnest", "koennest", "könnet", "koennet", "konnte", "konntest", "konnten", "konntet", "könnte", "koennte", "könntest", "koenntest", "könnten", "koennten", "könntet", "koenntet", "mag", "magst", "mögt", "moegt", "möge", "moege", "mögest", "moegest", "möget", "moeget", "mochte", "mochtest", "mochten", "mochtet", "möchte", "moechte", "möchtest", "moechtest", "möchten", "moechten", "möchtet", "moechtet", "muss", "muß", "musst", "mußt", "müsst", "muesst", "müßt", "mueßt", "müsse", "muesse", "müssest", "muessest", "müsset", "muesset", "musste", "mußte", "musstest", "mußtest", "mussten", "mußten", "musstet", "mußtet", "müsste", "muesste", "müßte", "mueßte", "müsstest", "muesstest", "müßtest", "mueßtest", "müssten", "muessten", "müßten", "mueßten", "müsstet", "muesstet", "müßtet", "mueßtet", "soll", "sollst", "sollt", "solle", "sollest", "sollet", "sollte", "solltest", "sollten", "solltet", "will", "willst", "wollt", "wolle", "wollest", "wollet", "wollte", "wolltest", "wollten", "wolltet", "lasse", "lässt", "laesst", "läßt", "laeßt", "lasst", "laßt", "lassest", "lasset", "ließ", "ließest", "ließt", "ließen", "ließe", "ließet", "liess", "liessest", "liesst", "liessen", "liesse", "liesset"];

var otherAuxiliariesInfinitive = ["haben", "sein", "dürfen", "duerfen", "können", "koennen", "mögen", "moegen", "müssen", "muessen", "sollen", "wollen", "lassen"];

// Forms from 'aussehen' with two parts, like 'sehe aus', are not included, because we remove words on an single word basis.
var copula = ["bleibe", "bleibst", "bleibt", "bleibest", "bleibet", "blieb", "bliebst", "bliebt", "blieben", "bliebe", "bliebest", "bliebet", "heiße", "heißt", "heißest", "heißet", "heisse", "heisst", "heissest", "heisset", "hieß", "hießest", "hießt", "hießen", "hieße", "hießet", "hiess", "hiessest", "hiesst", "hiessen", "hiesse", "hiesset", "gelte", "giltst", "gilt", "geltet", "gelte", "geltest", "galt", "galtest", "galtst", "galten", "galtet", "gälte", "gaelte", "gölte", "goelte", "gältest", "gaeltest", "göltest", "goeltest", "gälten", "gaelten", "gölten", "goelten", "gältet", "gaeltet", "göltet", "goeltet", "aussehe", "aussiehst", "aussieht", "ausseht", "aussehest", "aussehet", "aussah", "aussahst", "aussah", "aussahen", "aussaht", "aussähe", "aussaehe", "aussähest", "aussaehest", "aussähst", "aussaehst", "aussähet", "aussaehet", "aussäht", "aussaeht", "aussähen", "aussaehen", "scheine", "scheinst", "scheint", "scheinest", "scheinet", "schien", "schienst", "schienen", "schient", "schiene", "schienest", "schienet", "erscheine", "erscheinst", "erscheint", "erscheinest", "erscheinet", "erschien", "erschienst", "erschienen", "erschient", "erschiene", "erschienest", "erschienet"];

var copulaInfinitive = ["bleiben", "heißen", "heissen", "gelten", "aussehen", "scheinen", "erscheinen"];

var prepositions = ["a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "am", "an", "anfangs", "angelegentlich", "angesichts", "anhand", "anlässlich", "anlaesslich", "ans", "anstatt", "anstelle", "auf", "aufgrund", "aufs", "aufseiten", "aus", "ausgangs", "ausgenommen", "ausschließlich", "ausschliesslich", "ausser", "außer", "außerhalb", "ausserhalb", "ausweislich", "bar", "behufs", "bei", "beidseits", "beiderseits", "beim", "betreffs", "bezüglich", "bezueglich", "binnen", "bis", "contra", "dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingangs", "eingedenk", "einschließlich", "einschliesslich", "entgegen", "entlang", "entsprechend", "exklusive", "fern", "fernab", "fuer", "für", "fuers", "fürs", "gegen", "gegenüber", "gegenueber", "gelegentlich", "gemäß", "gemaeß", "gen", "getreu", "gleich", "halber", "hinsichtlich", "hinter", "hinterm", "hinters", "im", "in", "infolge", "inklusive", "inmitten", "innerhalb", "innert", "ins", "je", "jenseits", "kontra", "kraft", "lang", "längs", "laengs", "längsseits", "laengsseits", "laut", "links", "mangels", "minus", "mit", "mithilfe", "mitsamt", "mittels", "nach", "nächst", "naechst", "nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich", "nordwestlich", "ob", "oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich", "ruecksichtlich", "samt", "seit", "seitens", "seitlich", "seitwärts", "seitwaerts", "statt", "südlich", "suedlich", "südöstlich", "suedoestlich", "südwestlich", "suedwestlich", "trotz", "über", "ueber", "überm", "ueberm", "übern", "uebern", "übers", "uebers", "um", "ums", "unbeschadet", "unerachtet", "unfern", "ungeachtet", "unter", "unterhalb", "unterm", "untern", "unters", "unweit", "vermittels", "vermittelst", "vermöge", "vermoege", "via", "vom", "von", "vonseiten", "vor", "vorbehaltlich", "wegen", "wider", "während", "waehrend", "zeit", "zu", "zufolge", "zugunsten", "zulieb", "zuliebe", "zum", "zur", "zusätzlich", "zusaetzlich", "zuungunsten", "zuwider", "zuzüglich", "zuzueglich", "zwecks", "zwischen"];

// Many coordinating conjunctions are already included in the transition words list.
var coordinatingConjunctions = ["und", "oder", "als", "umso"];

/*
'Entweder' is part of 'wntweder...oder', 'sowohl', 'auch' is part of 'sowohl als...auch', 'weder' and 'noch' are part of 'weder...noch',
 'nur' is part of 'nicht nur...sondern auch'.
 */
var correlativeConjunctions = ["entweder", "sowohl", "auch", "weder", "noch", "nur"];

// Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
var subordinatingConjunctions = ["nun", "so", "gleichwohl"];

/*
These verbs are frequently used in interviews to indicate questions and answers. 'Frage' and 'fragen' are not included,
because those words are also nouns.
 */
var interviewVerbs = ["sage", "sagst", "sagt", "sagest", "saget", "sagte", "sagtest", "sagte", "sagten", "sagtet", "gesagt", "fragst", "fragt", "fragest", "fraget", "fragte", "fragtest", "fragten", "fragtet", "gefragt", "erkläre", "erklärst", "erklärt", "erklaere", "erklaerst", "erklaert", "erklärte", "erklärtest", "erklärte", "erklärtet", "erklärten", "erklaerte", "erklaertest", "erklaerte", "erklaertet", "erklaerten", "denke", "denkst", "denkt", "denkest", "denket", "dachte", "dachtest", "dachten", "dachtet", "dächte", "dächtest", "dächten", "dächtet", "daechte", "daechtest", "daechten", "daechtet", "finde", "findest", "findet", "gefunden"];

var interviewVerbsInfinitive = ["sagen", "erklären", "erklaeren", "denken", "finden"];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["etwa", "absolut", "unbedingt", "wieder", "definitiv", "bestimmt", "immer", "äußerst", "aeußerst", "höchst", "hoechst", "sofort", "augenblicklich", "umgehend", "direkt", "unmittelbar", "nämlich", "naemlich", "natürlich", "natuerlich", "besonders", "hauptsächlich", "hauptsaechlich", "jetzt", "eben", "heute", "heutzutage", "positiv", "eindeutig", "wirklich", "echt", "wahrhaft", "ehrlich", "aufrichtig", "wahrhaft", "wahrheitsgemäß", "treu", "letztlich", "einmalig", "unübertrefflich", "normalerweise", "gewöhnlich", "gewoehnlich", "üblicherweise", "ueblicherweise", "sonst", "fast", "nahezu", "beinahe", "knapp", "annähernd", "annaehernd", "geradezu", "ziemlich", "bald", "vielleicht", "wahrscheinlich", "wohl", "voraussichtlich", "zugegeben", "ursprünglich", "insgesamt", "tatsächlich", "eigentlich", "wahrhaftig", "bereits", "schon", "oft", "häufig", "haeufig", "regelmäßig", "regelmaeßig", "gleichmäßig", "gleichmaeßig", "einfach", "einfach", "nur", "lediglich", "bloß", "bloss", "eben", "halt", "wahlweise", "eventuell", "manchmal", "teilweise", "nie", "niemals", "nimmer", "jemals", "allzeit", "irgendeinmal", "anders", "vorausgesetzt", "momentan", "gegenwärtig", "gegenwärtig", "nebenbei", "übrigens", "uebrigens", "anderswo", "woanders", "anderswohin", "anderorts", "besonders", "insbesondere", "namentlich", "sonderlich", "ausdrücklich", "ausdruecklich", "vollends", "kürzlich", "kuerzlich", "jüngst", "juengst", "unlängst", "unlaengst", "neuerdings", "neulich", "letztens", "neuerlich", "relativ", "verhältnismäßig", "verhaeltnismaessig", "deutlich", "klar", "eindeutig", "offenbar", "anscheinend", "genau", "u.a", "damals", "zumindest"];

var intensifiers = ["sehr", "recht", "überaus", "ueberaus", "ungemein", "weitaus", "einigermaßen", "einigermassen", "ganz", "schampar", "schwer", "stief", "tierisch", "ungleich", "voll", "ziemlich", "übelst", "uebelst", "stark", "volkommen", "durchaus", "gar"];

// These verbs convey little meaning.
var delexicalisedVerbs = ["geschienen", "meine", "meinst", "meint", "meinen", "meinest", "meinet", "meinte", "meintest", "meinten", "meintet", "gemeint", "stehe", "stehst", "steht"];

var delexicalisedVerbsInfinitive = ["geschienen", "meinen", "tun", "machen", "stehen", "wissen", "gehen", "kommen"];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["einerlei", "egal", "neu", "neue", "neuer", "neuen", "neues", "neuem", "neuerer", "neueren", "neuerem", "neueres", "neuere", "neuester", "neuster", "neuesten", "neusten", "neuestem", "neustem", "neuestes", "neustes", "neueste", "neuste", "alt", "alter", "alten", "altem", "altes", "alte", "ältere", "älteren", "älterer", "älteres", "ältester", "ältesten", "ältestem", "ältestes", "älteste", "aeltere", "aelteren", "aelterer", "aelteres", "aeltester", "aeltesten", "aeltestem", "aeltestes", "aelteste", "gut", "guter", "gutem", "guten", "gutes", "gute", "besser", "besserer", "besseren", "besserem", "besseres", "bester", "besten", "bestem", "bestes", "beste", "größte", "grösste", "groß", "großer", "großen", "großem", "großes", "große", "großerer", "großerem", "großeren", "großeres", "großere", "großter", "großten", "großtem", "großtes", "großte", "gross", "grosser", "grossen", "grossem", "grosses", "grosse", "grosserer", "grosserem", "grosseren", "grosseres", "grossere", "grosster", "grossten", "grosstem", "grosstes", "grosste", "einfach", "einfacher", "einfachen", "einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachste", "einfachster", "einfachsten", "einfachstes", "einfachstem", "schnell", "schneller", "schnellen", "schnellem", "schnelles", "schnelle", "schnellere", "schnellerer", "schnelleren", "schnelleres", "schnellerem", "schnellster", "schnellste", "schnellsten", "schnellstem", "schnellstes", "weiter", "weit", "weiten", "weitem", "weites", "weiterer", "weiteren", "weiterem", "weiteres", "weitere", "weitester", "weitesten", "weitestem", "weitestes", "weiteste", "eigen", "eigener", "eigenen", "eigenes", "eigenem", "eigene", "eigenerer", "eignerer", "eigeneren", "eigneren", "eigenerem", "eignerem", "eigeneres", "eigneres", "eigenere", "eignere", "eigenster", "eigensten", "eigenstem", "eigenstes", "eigenste", "wenig", "weniger", "wenigen", "wenigem", "weniges", "wenigerer", "wenigeres", "wenigerem", "wenigeren", "wenigere", "wenigster", "wenigsten", "wenigstem", "wenigstes", "wenigste", "minderer", "minderen", "minderem", "mindere", "minderes", "mindester", "mindesten", "mindestes", "mindestem", "mindeste", "lang", "langer", "langen", "langem", "langes", "längerer", "längeren", "längerem", "längeres", "längere", "längster", "längsten", "längstem", "längstes", "längste", "laengerer", "laengeren", "laengerem", "laengeres", "laengere", "laengster", "laengsten", "laengstem", "laengstes", "laengste", "tief", "tiefer", "tiefen", "tiefem", "tiefes", "tiefe", "tieferer", "tieferen", "tieferem", "tieferes", "tiefere", "tiefster", "tiefsten", "tiefstem", "tiefste", "tiefstes", "hoch", "hoher", "hohen", "hohem", "hohes", "hohe", "höherer", "höhere", "höheren", "höherem", "höheres", "hoeherer", "hoehere", "hoeheren", "hoeherem", "hoeheres", "höchster", "höchste", "höchsten", "höchstem", "höchstes", "hoechster", "hoechste", "hoechsten", "hoechstem", "hoechstes", "regulär", "regulärer", "regulären", "regulärem", "reguläres", "reguläre", "regulaer", "regulaerer", "regulaeren", "regulaerem", "regulaeres", "regulaere", "regulärerer", "reguläreren", "regulärerem", "reguläreres", "regulärere", "regulaererer", "regulaereren", "regulaererem", "regulaereres", "regulaerere", "regulärster", "regulärsten", "regulärstem", "regulärstes", "regulärste", "regulaerster", "regulaersten", "regulaerstem", "regulaerstes", "regulaerste", "normal", "normaler", "normalen", "normalem", "normales", "normale", "normalerer", "normaleren", "normalerem", "normaleres", "normalere", "normalster", "normalsten", "normalstem", "normalstes", "normalste", "einfach", "einfacher", "einfachen", "einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachster", "einfachsten", "einfachstem", "einfachstes", "einfachste", "klein", "kleiner", "kleinen", "kleinem", "kleines", "kleine", "kleinerer", "kleineres", "kleineren", "kleinerem", "kleinere", "kleinster", "kleinsten", "kleinstem", "kleinstes", "kleinste", "winzig", "winziger", "winzigen", "winzigem", "winziges", "winzigerer", "winzigeren", "winzigerem", "winzigeres", "winzigere", "winzigster", "winzigsten", "winzigstem", "winzigste", "winzigstes", "sogenannt", "sogenannter", "sogenannten", "sogenanntem", "sogenanntes", "sogenannte", "kurz", "kurzer", "kurzen", "kurzem", "kurzes", "kurze", "kürzerer", "kürzeres", "kürzeren", "kürzerem", "kürzere", "kuerzerer", "kuerzeres", "kuerzeren", "kuerzerem", "kuerzere", "kürzester", "kürzesten", "kürzestem", "kürzestes", "kürzeste", "kuerzester", "kuerzesten", "kuerzestem", "kuerzestes", "kuerzeste", "wirklicher", "wirklichen", "wirklichem", "wirkliches", "wirkliche", "wirklicherer", "wirklicheren", "wirklicherem", "wirklicheres", "wirklichere", "wirklichster", "wirklichsten", "wirklichstes", "wirklichstem", "wirklichste", "eigentlich", "eigentlicher", "eigentlichen", "eigentlichem", "eigentliches", "eigentliche", "schön", "schöner", "schönen", "schönem", "schönes", "schöne", "schönerer", "schöneren", "schönerem", "schöneres", "schönere", "schönster", "schönsten", "schönstem", "schönstes", "schönste", "real", "realer", "realen", "realem", "reales", "realerer", "realeren", "realerem", "realeres", "realere", "realster", "realsten", "realstem", "realstes", "realste", "derselbe", "denselben", "demselben", "desselben", "dasselbe", "dieselbe", "derselben", "dieselben", "gleich", "gleicher", "gleichen", "gleichem", "gleiches", "gleiche", "gleicherer", "gleicheren", "gleicherem", "gleicheres", "gleichere", "gleichster", "gleichsten", "gleichstem", "gleichstes", "gleichste", "bestimmter", "bestimmten", "bestimmtem", "bestimmtes", "bestimmte", "bestimmtere", "bestimmterer", "bestimmterem", "bestimmteren", "bestimmteres", "bestimmtester", "bestimmtesten", "bestimmtestem", "bestimmtestes", "bestimmteste", "hauptsächlich", "hauptsaechlich", "überwiegend", "ueberwiegend", "zumeist", "meistens", "meisten", "kürzlich", "kuerzlich", "großenteils", "grossenteils", "meistenteils", "gewöhnlich", "gewoehnlich", "häufig", "haeufig", "weithin", "ständig", "staendig", "laufend", "dauernd", "andauernd", "immerfort", "irgendwo", "irgendwann", "ähnlicher", "ähnlichen", "ähnlichem", "ähnliches", "ähnliche", "ähnlich", "ähnlicherer", "ähnlicheren", "ähnlicherem", "ähnlicheres", "ähnlichere", "ähnlichster", "ähnlichsten", "ähnlichstem", "ähnlichstes", "ähnlichste", "schlecht", "schlechter", "schlechten", "schlechtem", "schlechtes", "schlechte", "schlechterer", "schlechteren", "schlechterem", "schlechteres", "schlechtere", "schlechtester", "schlechtesten", "schlechtestem", "schlechtestes", "schlechteste", "schlimm", "schlimmer", "schlimmen", "schlimmem", "schlimmes", "schlimme", "schlimmerer", "schlimmeren", "schlimmerem", "schlimmeres", "schlimmere", "schlimmster", "schlimmsten", "schlimmstem", "schlimmstes", "schlimmste", "toll", "toller", "tollen", "tollem", "tolles", "tolle", "tollerer", "tolleren", "tollerem", "tollere", "tolleres", "tollster", "tollsten", "tollstem", "tollstes", "tollste", "super", "mögliche", "möglicher", "mögliches", "möglichen", "möglichem", "möglich", "moegliche", "moeglicher", "moegliches", "moeglichen", "moeglichem", "moeglich", "nächsten", "naechsten", "voll", "voller", "vollen", "vollem", "volle", "volles", "vollerer", "volleren", "vollerem", "vollere", "volleres", "vollster", "vollsten", "vollstem", "vollste", "vollstes", "außen", "ganzer", "ganzen", "ganzem", "ganze", "ganzes", "gerne", "oben", "unten", "zurück", "zurueck"];

var interjections = ["ach", "aha", "oh", "au", "bäh", "baeh", "igitt", "huch", "hurra", "hoppla", "nanu", "oha", "olala", "pfui", "tja", "uups", "wow", "grr", "äh", "aeh", "ähm", "aeh", "öhm", "oehm", "hm", "mei", "nun", "tja", "mhm", "okay", "richtig", "eijeijeijei"];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["g", "el", "es", "tl", "wg", "be", "bd", "cl", "dl", "dag", "do", "gl", "gr", "kg", "kl", "cb", "ccm", "l", "ms", "mg", "ml", "mi", "pk", "pr", "pp", "sc", "sp", "st", "sk", "ta", "tr", "cm", "mass"];

var timeWords = ["sekunde", "sekunden", "minute", "minuten", "uhr", "uhren", "tag", "tages", "tags", "tage", "tagen", "woche", "wochen", "jahr", "jahres", "jahrs", "jahre", "jahren"];

var vagueNouns = ["ding", "dinge", "dinges", "dinger", "dingern", "dingen", "sache", "sachen", "weise", "weisen", "wahrscheinlichkeit", "zeug", "zeuge", "zeuges", "zeugen", "mal", "einmal", "teil", "teile", "teiles", "teilen", "prozent", "prozents", "prozentes", "prozente", "prozenten", "beispiel", "beispiele", "beispieles", "beispiels", "beispielen", "aspekt", "aspekte", "aspektes", "aspekts", "aspekten", "idee", "ideen", "ahnung", "ahnungen", "thema", "themas", "themata", "themen", "fall", "falle", "falles", "falls", "fälle", "fällen", "faelle", "faellen", "mensch", "menschen", "leute"];

var miscellaneous = ["nix", "nixe", "nixes", "nixen", "usw.", "%", "nicht", "amen", "ja", "nein", "euro", "prozent", "was"];

module.exports = function () {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat(personalPronounsAccusative, personalPronounsDative, possessivePronouns),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat(subordinatingConjunctions, correlativeConjunctions),
		verbs: copula.concat(interviewVerbs, otherAuxiliaries, filteredPassiveAuxiliaries),
		quantifiers: quantifiers,
		relativePronouns: relativePronouns,
		interrogativeProAdverbs: interrogativeProAdverbs,
		transitionWords: transitionWords.concat(additionalTransitionWords),
		// These verbs that should be filtered at the beginning of prominent word combinations.
		beginningVerbs: otherAuxiliariesInfinitive.concat(infinitivePassiveAuxiliaries, delexicalisedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive),
		miscellaneous: miscellaneous,
		interjections: interjections,
		pronominalAdverbs: pronominalAdverbs,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat(numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives, filteredPassiveAuxiliaries, infinitivePassiveAuxiliaries, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, delexicalisedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, timeWords)
	};
};

},{"./passivevoice/auxiliaries.js":16,"./transitionWords.js":17}],16:[function(require,module,exports){
"use strict";

// These passive auxiliaries start with be-, ge- or er- en and with -t, and therefore look like a participle.
var participleLike = ["bekommst", "bekommt", "bekamst", "bekommest", "bekommet", "bekämest", "bekämst", "bekämet", "bekämt", "gekriegt", "gehörst", "gehört", "gehörtest", "gehörtet", "gehörest", "gehöret", "erhältst", "erhält", "erhaltet", "erhielt", "erhieltest", "erhieltst", "erhieltet", "erhaltest"];

// These are all other passive auxiliaries.
var otherAuxiliaries = ["werde", "wirst", "wird", "werden", "werdet", "wurde", "ward", "wurdest", "wardst", "wurden", "wurdet", "worden", "werdest", "würde", "würdest", "würden", "würdet", "bekomme", "bekommen", "bekam", "bekamen", "bekäme", "bekämen", "kriege", "kriegst", "kriegt", "kriegen", "kriegte", "kriegtest", "kriegten", "kriegtet", "kriegest", "krieget", "gehöre", "gehören", "gehörte", "gehörten", "erhalte", "erhalten", "erhielten", "erhielte"];

// These first person plural auxiliaries also function as an infinitive.
var infinitiveAuxiliaries = ["werden", "bekommen", "kriegen", "gehören", "erhalten"];
/**
 * Returns lists with auxiliaries.
 * @returns {Array} The lists with auxiliaries.
 */
module.exports = function () {
	return {
		participleLike: participleLike,
		otherAuxiliaries: otherAuxiliaries.concat(infinitiveAuxiliaries),
		// These auxiliaries are filtered from the beginning and end of word combinations in the prominent words.
		filteredAuxiliaries: participleLike.concat(otherAuxiliaries),
		// These auxiliaries are not filtered from the beginning of word combinations in the prominent words.
		infinitiveAuxiliaries: infinitiveAuxiliaries,
		allAuxiliaries: participleLike.concat(otherAuxiliaries, infinitiveAuxiliaries)
	};
};

},{}],17:[function(require,module,exports){
"use strict";

/** @module config/transitionWords */

var singleWords = ["aber", "abschließend", "abschliessend", "alldieweil", "allerdings", "also", "anderenteils", "andererseits", "andernteils", "anfaenglich", "anfänglich", "anfangs", "angenommen", "anschliessend", "anschließend", "aufgrund", "ausgenommen", "ausser", "außer", "ausserdem", "außerdem", "beispielsweise", "bevor", "beziehungsweise", "bspw", "bzw", "d.h", "da", "dabei", "dadurch", "dafuer", "dafür", "dagegen", "daher", "dahingegen", "danach", "dann", "darauf", "darum", "dass", "davor", "dazu", "dementgegen", "dementsprechend", "demgegenüber", "demgegenueber", "demgemaess", "demgemäß", "demzufolge", "denn", "dennoch", "dergestalt", "desto", "deshalb", "desungeachtet", "deswegen", "doch", "dort", "drittens", "ebenfalls", "ebenso", "endlich", "ehe", "einerseits", "einesteils", "entsprechend", "entweder", "erst", "erstens", "falls", "ferner", "folgerichtig", "folglich", "fürderhin", "fuerderhin", "genauso", "hierdurch", "hierzu", "hingegen", "immerhin", "indem", "indes", "indessen", "infolge", "infolgedessen", "insofern", "insoweit", "inzwischen", "jedenfalls", "jedoch", "kurzum", "m.a.w", "mitnichten", "mitunter", "möglicherweise", "moeglicherweise", "nachdem", "nebenher", "nichtsdestotrotz", "nichtsdestoweniger", "ob", "obenrein", "obgleich", "obschon", "obwohl", "obzwar", "ohnehin", "richtigerweise", "schliesslich", "schließlich", "seit", "seitdem", "sobald", "sodass", "so dass", "sofern", "sogar", "solang", "solange", "somit", "sondern", "sooft", "soviel", "soweit", "sowie", "sowohl", "statt", "stattdessen", "trotz", "trotzdem", "überdies", "übrigens", "ueberdies", "uebrigens", "ungeachtet", "vielmehr", "vorausgesetzt", "vorher", "waehrend", "während", "währenddessen", "waehrenddessen", "weder", "wegen", "weil", "weiter", "weiterhin", "wenn", "wenngleich", "wennschon", "wennzwar", "weshalb", "widrigenfalls", "wiewohl", "wobei", "wohingegen", "z.b", "zudem", "zuerst", "zufolge", "zuletzt", "zumal", "zuvor", "zwar", "zweitens"];
var multipleWords = ["abgesehen von", "abgesehen davon", "als dass", "als wenn", "anders ausgedrückt", "anders ausgedrueckt", "anders formuliert", "anders gefasst", "anders gefragt", "anders gesagt", "anders gesprochen", "anstatt dass", "auch wenn", "auf grund", "auf jeden fall", "aus diesem grund", "ausser dass", "außer dass", "ausser wenn", "außer wenn", "besser ausgedrückt", "besser ausgedrueckt", "besser formuliert", "besser gesagt", "besser gesprochen", "bloss dass", "bloß dass", "das heisst", "das heißt", "des weiteren", "dessen ungeachtet", "ebenso wie", "genauso wie", "geschweige denn", "im fall", "im falle", "im folgenden", "im gegensatz dazu", "im grunde genommen", "in diesem sinne", "je nachdem", "kurz gesagt", "mit anderen worten", "ohne dass", "so dass", "umso mehr als", "umso weniger als", "umso mehr, als", "umso weniger, als", "unbeschadet dessen", "und zwar", "ungeachtet dessen", "unter dem strich", "zum beispiel"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

},{}],18:[function(require,module,exports){
"use strict";

var transitionWords = require("./transitionWords.js")().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher
 * @returns {Array} The array filled with exceptions.
 */

var articles = ["el", "la", "los", "las", "un", "una", "unos", "unas"];

// "Uno" is already included in the articles.
var numerals = ["dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte", "primero", "primera", "segundo", "segunda", "tercero", "tercera", "cuarto", "cuarta", "quinto", "quinta", "sexto", "sexta", "septimo", "septima", "octavo", "octava", "noveno", "novena", "décimo", "décima", "primero", "vigésimo", "vigésima", "cien", "centena", "mil", "millon", "millones"];

var personalPronounsNominative = ["yo", "tú", "él", "ella", "ello", "nosotros", "nosotras", "vosotros", "vosotras", "ustedes", "ellos", "ellas"];

var personalPronounsAccusative = ["me", "te", "lo", "la", "se", "nos", "os", "los", "las", "les"];

var personalPronounsGenitive = ["mío", "míos", "mía", "mías", "tuyo", "tuyos", "tuya", "tuyas", "suyo", "suyos", "suya", "suyas", "nuestros", "nuestro", "nuestra", "nuestras", "vuestros", "vuestro", "vuestra", "vuestras", "suyo", "suyos", "suya", "suyas"];

var personalPronounsPrepositional = ["mí", "ti", "ud", "uds", "usted", "sí", "nosotros", "nosotras", "vosotros", "vosotras"];

var personalPronounsComitative = ["conmigo", "contigo", "consigo"];

var demonstrativePronouns = ["este", "ese", "aquel", "esta", "esa", "aquella", "estos", "esos", "aquellos", "estas", "esas", "aquellas", "esto", "eso", "aquello"];

var possessivePronouns = ["mi", "mis", "mío", "míos", "mía", "mías", "nuestro", "nuestros", "nuestra", "nuestras", "tuyo", "tuyos", "tuya", "tuyas", "tu", "tus", "vuestro", "vuestros", "vuestra", "vuestras", "suyo", "suyos", "suya", "suyas", "suyo", "suyos", "suya", "suyas", "su", "sus"];

var quantifiers = ["bastante", "bastantes", "mucho", "muchas", "mucha", "muchos", "demasiado", "demasiada", "demasiados", "demasiadas", "poco", "poca", "pocos", "pocas", "demás", "otros", "otras", "muy", "todo", "toda", "todos", "todas", "demasiado", "demasiados", "demasiada", "demasiadas"];

var reflexivePronouns = ["os"];

var indefinitePronouns = ["alguien", "algo", "algún", "alguno", "alguna", "algunos", "algunas", "nadie", "nada", "ningún", "ninguno", "ninguna", "ningunos", "ningunas", "tanto", "tantos", "tanta", "tantas"];

var interrogativeDeterminers = ["que", "cuyas", "donde", "cual"];

var interrogativePronouns = ["cuyo"];

/*
'Qué' is part of 'por qué' ('why'). The combination 'quien sea' ('whoever') is separated into two entries: 'quien' and 'sea'.
'quira' is part of 'cuando quiera' ('whenever').
 */
var interrogativeProAdverbs = ["comoquiera", "cualesquiera", "cualquier", "cuando", "cuanta", "cuantas", "cuanto", "cuantos", "cuál", "cuáles", "cuánta", "cuántas", "cuánto", "cuántos", "como", "cómo", "dondequiera", "dónde", "donde", "quien", "quienes", "quienquiera", "quiera", "quién", "quiénes", "qué", "que", "sea"];

var locativeAdverbs = ["hay", "allí", "ahí", "allá", "aquí", "acá", "adónde", "delante", "detrás", "encima", "debajo", "dentro", "fuera", "adelante", "atrás", "arriba", "arriba", "abajo", "adentro", "afuera"];

var otherAuxiliaries = ["he", "has", "ha", "hay", "hemos", "habéis", "han", "hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron", "había", "habías", "habíamos", "habíais", "habían", "habría", "habrías", "habríais", "habrían", "habré", "habrás", "habrá", "habremos", "habréis", "habrán", "haya", "hayas", "hayamos", "hayáis", "hayan", "hubiera", "hubieras", "hubiéramos", "hubierais", "hubieran", "hubiese", "hubieses", "hubiésemos", "hubieseis", "hubiesen", "hubiere", "hubieres", "hubiéremos", "hubiereis", "hubieren", "habed", "habido", "debo", "debes", "debe", "debemos", "debéis", "deben", "debí", "debiste", "debió", "debimos", "debisteis", "debieron", "debía", "debías", "debíamos", "debíais", "debían", "debería", "deberías", "deberíamos", "deberíais", "deberían", "deberé", "deberás", "deberá", "deberemos", "deberéis", "deberán", "deba", "debas", "debamos", "debáis", "deban", "debiera", "debieras", "debiéramos", "debierais", "debieran", "debiese", "debieses", "debiésemos", "debieseis", "debiesen", "debiere", "debieres", "debiéremos", "debiereis", "debieren", "debed", "debido", "empiezo", "empiezas", "empieza", "empezáis", "empiezan", "empecé", "empezaste", "empezó", "empezamos", "empezasteis", "empezaron", "empezaba", "empezabas", "empezábamos", "empezabais", "empezaban", "empezaría", "empezarías", "empezaríamos", "empezaríais", "empezarían", "empezaré", "empezarás", "empezará", "empezaremos", "empezaréis", "empezarán", "empiece", "empieces", "empecemos", "empecéis", "empiecen", "empezara", "empezaras", "empezáramos", "empezarais", "empezaran", "empezase", "empezases", "empezásemos", "empezaseis", "empezasen", "empezare", "empezares", "empezáremos", "empezareis", "empezaren", "empezad", "empezado", "comienzo", "comienzas", "comienza", "comenzamos", "comenzáis", "comienzan", "comencé", "comenzaste", "comenzó", "comenzasteis", "comenzaron", "comenzaba", "comenzabas", "comenzábamos", "comenzabais", "comenzaban", "comenzaría", "comenzarías", "comenzaríamos", "comenzaríais", "comenzarían", "comenzaré", "comenzarás", "comenzará", "comenzaremos", "comenzaréis", "comenzarán", "comience", "comiences", "comencemos", "comencéis", "comiencen", "comenzara", "comenzaras", "comenzáramos", "comenzarais", "comenzaran", "comenzase", "comenzases", "comenzásemos", "comenzaseis", "comenzasen", "comenzare", "comenzares", "comenzáremos", "comenzareis", "comenzaren", "comenzad", "comenzado", "sigo", "sigues", "sigue", "seguimos", "seguis", "siguen", "seguí", "seguiste", "siguió", "seguisteis", "siguieron", "seguía", "seguías", "seguíamos", "seguíais", "seguían", "seguiría", "seguirías", "seguiríamos", "seguiríais", "seguirían", "seguiré", "seguirás", "seguirá", "seguiremos", "seguiréis", "seguirán", "siga", "sigas", "sigamos", "sigáis", "sigan", "siguiera", "siguieras", "siguiéramos", "siguierais", "siguieran", "siguiese", "siguieses", "siguiésemos", "siguieseis", "siguiesen", "siguiere", "siguieres", "siguiéremos", "siguiereis", "siguieren", "seguid", "seguido", "tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen", "tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron", "tenía", "tenías", "teníamos", "teníais", "tenían", "tendría", "tendrías", "tendríamos", "tendríais", "tendrían", "tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán", "tenga", "tengas", "tengamos", "tengáis", "tengan", "tuviera", "tuvieras", "tuviéramos", "tuvierais", "tuvieran", "tuviese", "tuvieses", "tuviésemos", "tuvieseis", "tuviesen", "tuviere", "tuvieres", "tuviéremos", "tuviereis", "tuvieren", "ten", "tened", "tenido", "ando", "andas", "andamos", "andáis", "andan", "anduve", "anduviste", "anduvo", "anduvimos", "anduvisteis", "anduvieron", "andaba", "andabas", "andábamos", "andabais", "andaban", "andaría", "andarías", "andaríamos", "andaríais", "andarían", "andaré", "andarás", "andará", "andaremos", "andaréis", "andarán", "ande", "andes", "andemos", "andéis", "anden", "anduviera", "anduvieras", "anduviéramos", "anduvierais", "anduvieran", "anduviese", "anduvieses", "anduviésemos", "anduvieseis", "anduviesen", "anduviere", "anduvieres", "anduviéremos", "anduviereis", "anduvieren", "andad", "andado", "quedo", "quedas", "queda", "quedamos", "quedáis", "quedan", "quedé", "quedasteis", "quedaron", "quedaba", "quedabas", "quedábamos", "quedabais", "quedaban", "quedaría", "quedarías", "quedaríamos", "quedaríais", "quedarían", "quedaré", "quedarás", "quedará", "quedaremos", "quedaréis", "quedarán", "quede", "quedes", "quedemos", "quedéis", "queden", "quedara", "quedaras", "quedáramos", "quedarais", "quedaran", "quedase", "quedases", "quedásemos", "quedaseis", "quedasen", "quedare", "quedares", "quedáremos", "quedareis", "quedaren", "quedad", "quedado", "hallo", "hallas", "halla", "hallamos", "halláis", "hallan", "hallé", "hallaste", "halló", "hallasteis", "hallaron", "hallaba", "hallabas", "hallábamos", "hallabais", "hallaban", "hallaría", "hallarías", "hallaríamos", "hallaríais", "hallarían", "hallaré", "hallarás", "hallará", "hallaremos", "hallaréis", "hallarán", "halle", "halles", "hallemos", "halléis", "hallen", "hallara", "hallaras", "halláramos", "hallarais", "hallaran", "hallase", "hallases", "hallásemos", "hallaseis", "hallasen", "hallare", "hallares", "halláremos", "hallareis", "hallaren", "hallad", "hallado", "vengo", "vienes", "viene", "venimos", "venis", "vienen", "vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron", "venía", "vanías", "verníamos", "veníais", "venían", "vendría", "vendrías", "vendríamos", "vendíais", "vendrían", "vendré", "vendrás", "vendrá", "vendremos", "vendréis", "vendrán", "venga", "vengas", "vengamos", "vengáis", "vengan", "viniera", "vinieras", "viniéramos", "vinierais", "vinieran", "viniese", "vinieses", "viniésemos", "vinieseis", "viniesen", "viniere", "vinieres", "viniéremos", "viniereis", "vinieren", "ven", "venid", "venido", "abro", "abres", "abre", "abrismos", "abrís", "abren", "abrí", "abriste", "abrió", "abristeis", "abrieron", "abría", "abrías", "abríais", "abrían", "abriría", "abrirías", "abriríamos", "abriríais", "abrirían", "abriré", "abrirás", "abrirá", "abriremos", "abriréis", "abrirán", "abra", "abras", "abramos", "abráis", "abran", "abriera", "abrieras", "abriéramos", "abrierais", "abrieran", "abriese", "abrieses", "abriésemos", "abrieseis", "abriesen", "abriere", "abrieres", "abriéremos", "abriereis", "abrieren", "abrid", "abierto", "voy", "vas", "va", "vamos", "vais", "van", "fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron", "iba", "ibas", "íbamos", "ibais", "iban", "iría", "irías", "iríamos", "iríais", "irían", "iré", "irás", "irá", "iremos", "iréis", "irán", "vaya", "vayas", "vayamos", "vayáis", "vayan", "fuera", "fueras", "fuéramos", "fuerais", "fueran", "fuese", "fueses", "fuésemos", "fueseis", "fuesen", "fuere", "fueres", "fuéremos", "fuereis", "fueren", "ve", "id", "ido", "acabo", "acabas", "acaba", "acabamos", "acabáis", "acaban", "acabé", "acabaste", "acabó", "acabasteis", "acabaron", "acababa", "acababas", "acabábamos", "acababais", "acababan", "acabaría", "acabarías", "acabaríamos", "acabaríais", "acabarían", "acabaré", "acabarás", "acabará", "acabaremos", "acabaréis", "acabarán", "acabe", "acabes", "acabemos", "acabéis", "acaben", "acabara", "acabaras", "acabáramos", "acabarais", "acabaran", "acabase", "acabases", "acabásemos", "acabaseis", "acabasen", "acabare", "acabares", "acabáremos", "acabareis", "acabaren", "acabad", "acabado", "llevo", "llevas", "lleva", "llevamos", "lleváis", "llevan", "llevé", "llevaste", "llevó", "llevasteis", "llevaron", "llevaba", "llevabas", "llevábamos", "llevabais", "llevaban", "llevaría", "llevarías", "llevaríamos", "llevaríais", "llevarían", "llevaré", "llevarás", "llevará", "llevaremos", "llevaréis", "llevarán", "lleve", "lleves", "llevemos", "llevéis", "lleven", "llevara", "llevaras", "lleváramos", "llevarais", "llevaran", "llevase", "llevases", "llevásemos", "llevaseis", "llevasen", "llevare", "llevares", "lleváremos", "llevareis", "llevaren", "llevad", "llevado", "alcanzo", "alcanzas", "alcanza", "alcanzamos", "alcanzáis", "alcanzan", "alcancé", "alcanzaste", "alcanzó", "alcanzasteis", "alcanzaron", "alcanzaba", "alcanzabas", "alcanzábamos", "alcanzabais", "alcanzaban", "alcanzaría", "alcanzarías", "alcanzaríamos", "alcanzaríais", "alcanzarían", "alcanzaré", "alcanzarás", "alcanzará", "alcanzaremos", "alcanzaréis", "alcanzarán", "alcance", "alcances", "alcancemos", "alcancéis", "alcancen", "alcanzara", "alcanzaras", "alcanzáramos", "alcanzarais", "alcanzaran", "alcanzase", "alcanzases", "alcanzásemos", "alcanzaseis", "alcanzasen", "alcanzare", "alcanzares", "alcanzáremos", "alcanzareis", "alcanzaren", "alcanzad", "alcanzado", "digo", "dices", "dice", "decimos", "decís", "dicen", "dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron", "decía", "decías", "decíamos", "decíais", "decían", "diría", "dirías", "diríamos", "diríais", "dirían", "diré", "dirás", "dirá", "diremos", "diréis", "dirán", "diga", "digas", "digamos", "digáis", "digan", "dijera", "dijeras", "dijéramos", "dijerais", "dijeran", "dijese", "dijeses", "dijésemos", "dijeseis", "dijesen", "dijere", "dijeres", "dijéremos", "dijereis", "dijeren", "di", "decid", "dicho", "continúo", "continúas", "continúa", "continuamos", "continuáis", "continúan", "continué", "continuaste", "continuó", "continuasteis", "continuaron", "continuaba", "continuabas", "continuábamos", "continuabais", "continuaban", "continuaría", "continuarías", "continuaríamos", "continuaríais", "continuarían", "continuaré", "continuarás", "continuará", "continuaremos", "continuaréis", "continuarán", "continúe", "continúes", "continuemos", "continuéis", "continúen", "continuara", "continuaras", "continuáramos", "continuarais", "continuaran", "continuase", "continuases", "continuásemos", "continuaseis", "continuasen", "continuare", "continuares", "continuáremos", "continuareis", "continuaren", "continuad", "continuado", "resulto", "resultas", "resulta", "resultamos", "resultáis", "resultan", "resulté", "resultaste", "resultó", "resultasteis", "resultaron", "resultaba", "resultabas", "resultábamos", "resultabais", "resultaban", "resultaría", "resultarías", "resultaríamos", "resultaríais", "resultarían", "resultaré", "resultarás", "resultará", "resultaremos", "resultaréis", "resultarán", "resulte", "resultes", "resultemos", "resultéis", "resulten", "resultara", "resultaras", "resultáramos", "resultarais", "resultaran", "resultase", "resultases", "resultásemos", "resultaseis", "resultasen", "resultare", "resultares", "resultáremos", "resultareis", "resultaren", "resultad", "resultado", "puedo", "puedes", "puede", "podemos", "podéis", "pueden", "pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron", "podía", "podías", "podíamos", "podíais", "podían", "podría", "podrías", "podríamos", "podríais", "podrían", "podré", "podrás", "podrá", "podremos", "podréis", "podrán", "pueda", "puedas", "podamos", "podáis", "puedan", "pudiera", "pudieras", "pudiéramos", "pudierais", "pudieran", "pudiese", "pudieses", "pudiésemos", "pudieseis", "pudiesen", "pudiere", "pudieres", "pudiéremos", "pudiereis", "pudieren", "poded", "podido", "quiero", "quieres", "quiere", "queremos", "queréis", "quieren", "quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron", "quería", "querías", "queríamos", "queríais", "querían", "querría", "querrías", "querríamos", "querríais", "querrían", "querré", "querrás", "querrá", "querremos", "querréis", "querrán", "quiera", "quieras", "queramos", "queráis", "quieran", "quisiera", "quisieras", "quisiéramos", "quisierais", "quisieran", "quisiese", "quisieses", "quisiésemos", "quisieseis", "quisiesen", "quisiere", "quisieres", "quisiéremos", "quisiereis", "quisieren", "quered", "querido", "sé", "sabes", "sabe", "sabemos", "sabéis", "saben", "supe", "supiste", "supo", "supimos", "supisteis", "supieron", "sabía", "sabías", "sabíamos", "sabíais", "sabían", "sabría", "sabrías", "sabríamos", "sabríais", "sabrían", "sabré", "sabrás", "sabrá", "sabremos", "sabréis", "sabrán", "sepa", "sepas", "sepamos", "sepáis", "sepan", "supiera", "supieras", "supiéramos", "supierais", "supieran", "supiese", "supieses", "supiésemos", "supieseis", "supiesen", "supiere", "supieres", "supiéremos", "supiereis", "supieren", "sabed", "sabido", "suelo", "sueles", "suele", "solemos", "soléis", "suelen", "solí", "soliste", "solió", "solimos", "solisteis", "solieron", "solía", "solías", "solíamos", "solíais", "solían", "solería", "solerías", "soleríamos", "soleríais", "solerían", "soleré", "solerás", "solerá", "soleremos", "soleréis", "solerán", "suela", "suelas", "solamos", "soláis", "suelan", "soliera", "solieras", "soliéramos", "solierais", "solieran", "soliese", "solieses", "soliésemos", "solieseis", "soliesen", "soliere", "solieres", "soliéremos", "soliereis", "solieren", "soled", "solido", "necesito", "necesitas", "necesitamos", "necesitáis", "necesitan", "necesité", "necesitaste", "necesitó", "necesitasteis", "necesitaron", "necesitaba", "necesitabas", "necesitábamos", "necesitabais", "necesitaban", "necesitaría", "necesitarías", "necesitaríamos", "necesitaríais", "necesitarían", "necesitaré", "necesitarás", "necesitará", "necesitaremos", "necesitaréis", "necesitarán", "necesite", "necesites", "necesitemos", "necesitéis", "necesiten", "necesitara", "necesitaras", "necesitáramos", "necesitarais", "necesitaran", "necesitase", "necesitases", "necesitásemos", "necesitaseis", "necesitasen", "necesitare", "necesitares", "necesitáremos", "necesitareis", "necesitaren", "necesita", "necesitad", "necesitado"];

var otherAuxiliariesInfinitive = ["haber", "deber", "empezar", "comenzar", "seguir", "tener", "andar", "quedar", "hallar", "venir", "abrir", "ir", "acabar", "llevar", "alcanzar", "decir", "continuar", "resultar", "poder", "querer", "saber", "soler", "necesitar"];

var copula = ["estoy", "estás", "está", "estamos", "estáis", "están", "estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron", "estuba", "estabas", "estábamos", "estabais", "estaban", "estraría", "estarías", "estaríamos", "estaríais", "estarían", "estaré", "estarás", "estará", "estaremos", "estaréis", "estarán", "esté", "estés", "estemos", "estéis", "estén", "estuviera", "estuviese", "estuvieras", "estuviéramos", "estuvierais", "estuvieran", "estuvieses", "estuviésemos", "estuvieseis", "estuviesen", "estuviere", "estuvieres", "estuviéremos", "estuviereis", "estuvieren", "estad", "estado", "soy", "eres", "es", "somos", "sois", "son", "fui", "fuiste", "fuimos", "fuisteis", "fueron", "era", "eras", "éramos", "erais", "eran", "sería", "serías", "seríamos", "seríais", "serían", "seré", "serás", "seremos", "seréis", "serán", "sea", "seas", "seamos", "seáis", "sean", "fuera", "fueras", "fuéramos", "fuerais", "fueran", "fuese", "fueses", "fuésemos", "fueseis", "fuesen", "fuere", "fueres", "fuéremos", "fuereis", "fueren", "sé", "sed", "sido"];

var copulaInfinitive = ["estar", "ser"];

var prepositions = ["a", "ante", "abajo", "adonde", "al", "allende", "alrededor", "amén", "ante", "antes", "arriba", "aun", "bajo", "cabe", "cabo", "como", "con", "conmigo", "consigo", "contigo", "contra", "cuando", "de", "dejante", "del", "dentro", "desde", "donde", "durante", "en", "encima", "entre", "excepto", "fuera", "hacia", "hasta", "incluso", "mediante", "menos", "más", "opuesto", "par", "para", "pero", "por", "próximo", "que", "salvo", "según", "sin", "so", "sobre", "tras", "versus", "vía"];

var prepositionalAdverbs = ["cerca", "lejos", "arriba", "abajo", "debajo", "delante", "detrás"];

var coordinatingConjunctions = ["pero", "o", "y", "entonces", "pues", "e", "u", "sino", "ni", "bien", "sea", "ya", "ora", "estos", "aquellos", "así", "luego", "mas", "aunque"];

/*
'Tanto' and 'como' together form 'tanto...como'. 'Ni' is part of 'ni...ni'. 'Bien' is part of 'bien...bien'.
 'Ora' is part of 'ora...ora'. 'Ya' is part of 'ya...ya'. 'Igual' is part of 'igual...que'. 'Menos' is part of 'menos...que'.
 */
var correlativeConjunctions = ["tanto", "como", "ni", "ora", "ya", "igual", "menos"];

var subordinatingConjunctions = ["apenas", "aun", "conque", "como", "cuando", "mientras", "porque", "segun", "según", "si", "tan", "tal"];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Dijo' is already included in the otherAuxiliaries category.
var interviewVerbs = ["apunto", "apunta", "confieso", "confiesa", "confesaba", "revelado", "revelo", "revela", "revelaba", "declarado", "declaro", "declara", "declaba", "señalo", "señala", "señalaba", "declarou", "declaro", "declara", "declaraba", "comentou", "comento", "comenta", "comentou", "revelou", "revelo", "revela", "revelaba"];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["básicamente", "esencialmente", "primeramente", "siempre", "nunca", "ahora", "obviamente", "apenas", "quizá", "acaso", "inclusive", "probablemente", "verdaderamente", "seguramente", "jamás", "obviamente", "indiscutiblement", "inmediatamente", "previamente", "y", "o"];

var intensifiers = ["muy", "tan", "demasiado", "bastante", "completamente", "algo", "tanto", "poco", "suficiente", "tal", "tales"];

// These verbs convey little meaning.
var delexicalisedVerbs = ["hago", "haces", "hace", "hacemos", "hacéis", "hacen", "hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron", "hacía", "hacías", "hacíamos", "hacíais", "hacían", "haría,", "harías", "haríamos", "haríais", "harían", "haré", "harás", "hará", "haremos", "haréis", "harán", "haga", "hagas", "hagamos", "hagáis", "hagan", "hiciera", "hicieras", "hiciéramos", "hicierais", "hicieran", "hiciese", "hicieses", "hiciésemos", "hicieseis", "hiciesen", "hiciere", "hicieres", "hiciéremos", "hiciereis", "hicieren", "haz", "haced", "hecho", "parezco", "pareces", "parece", "parecemos", "parecéis", "parecen", "parecí", "pareciste", "pareció", "parecimos", "parecisteis", "parecieron", "parecía", "parecías", "parecíamos", "parecíais", "parecían", "parecería", "parecerías", "pareceríamos", "pareceríais", "parecerían", "pareceré", "parecerás", "parecerá", "pareceremos", "pareceréis", "parecerán", "parezca", "parezcas", "parezcamos", "parezcáis", "parezcan", "pareciera", "parecieras", "pareciéramos", "parecierais", "parecieran", "pareciese", "parecieses", "pareciésemos", "parecieseis", "pareciesen", "pareciere", "parecieres", "pareciéremos", "pareciereis", "parecieren", "pareced", "parecido"];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["ayer", "hoy", "mañana", "enfrente", "mal", "mejor", "peor", "más", "menos", "claro", "bueno", "nuevo", "nueva", "nuevos", "nuevas", "viejo", "viejos", "vieja", "viejas", "anterior", "mejor", "grande", "gran", "grandes", "mayores", "fácil", "fáciles", "rápido", "rápida", "rápidos", "rápidas", "lejos", "lejas", "difícil", "difíciles", "propio", "propios", "propia", "propias", "largo", "larga", "largos", "largas", "bajo", "bajos", "baja", "bajos", "alto", "alta", "altos", "altas", "regular", "regulares", "normal", "pequeño", "pequeña", "pequeños", "pequeñas", "diminuta", "diminuto", "diminutas", "diminutos", "chiquitito", "chiquititos", "chiquitita", "chiquititas", "corta", "corto", "cortas", "cortos", "principal", "principales", "mismo", "mismos", "misma", "mismas", "capaz", "capaces", "cierta", "cierto", "ciertas", "ciertos", "llamado", "llamada", "llamados", "llamadas", "principalmente", "mayormente", "reciente", "recientes", "completa", "completo", "completas", "completos", "absoluta", "absoluto", "absolutas", "absolutos", "últimamente", "posible", "común", "comúnes", "comúnmente", "constantemente", "continuamente", "directamente", "fácilmente", "casi", "ligeramente", "estimado", "estima", "estimada", "estimado", "aproximada", "aproximadamente", "última", "últimas", "último", "últimos", "diferente", "diferentes", "similar", "mal", "malo", "malos", "mala", "malas", "perfectamente", "excelente", "final", "general"];

var interjections = ["ah", "eh", "ejem", "ele", "abajo", "achís", "adelante", "adentro", "adiós", "afuera", "agur", "ajá", "ajajá", "ala", "alá", "albricias", "aleluya", "alerta", "alirón", "aló", "amalaya", "amén", "ar", "aro", "arrarray", "arre", "arriba", "arsa", "atatay", "atrás", "aúpa", "ax", "ay", "ayayay", "bah", "banzai", "barajo", "bla", "bravo", "bueno", "buf", "bum", "ca", "caguendiós", "canastos", "caracho", "caracoles", "carajo", "caramba", "carape", "caray", "cáscaras", "cáspita", "cataplum", "ce", "chao", "chau", "che", "chis", "chist", "chitón", "cho", "chucho", "chus", "cielos", "claro", "clo", "coche", "cochi", "cojones", "cómo", "concho", "contra", "coño", "córcholis", "cuchí", "cuidado", "cuz", "demonio", "demontre", "despacio", "diablo", "diantre", "dios", "ea", "eh", "ejem", "ele", "entonces", "epa", "equilicuá", "estúpido", "eureka", "evohé", "exacto", "fantástico", "firmes", "fo", "forte", "fuera", "gua", "gualá", "guarte", "guay", "ha", "hala", "hale", "he", "hi", "hin", "hola", "hopo", "huesque", "huiche", "huichó", "huifa", "hurra", "huy", "ja", "jajajá", "jajay", "jaque", "jau", "jo", "jobar", "joder", "jolín", "jopo", "leñe", "listo", "malhayas", "mamola", "mecachis", "miéchica", "mondo", "moste", "mutis", "nanay", "narices", "oh", "ojalá", "ojo", "okay", "ole", "olé", "órdiga", "oste", "ostras", "ox", "oxte", "paf", "pardiez", "paso", "pucha", "puf", "puff", "pumba", "puñeta", "quedo", "quia", "quiúbole", "recórcholis", "rediez", "rediós", "salve", "sanseacabó", "sniff", "so", "socorro", "sus", "ta", "tararira", "tate", "tururú", "uf", "uh", "ui", "upa", "uste", "uy", "victoria", "vítor", "viva", "za", "zambomba", "zapateta", "zape", "zas"];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["kg", "mg", "gr", "g", "km", "m", "l", "ml", "cl"];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = ["cosa", "cosas", "manera", "maneras", "caso", "casos", "pieza", "piezas", "vez", "veces", "parte", "partes", "porcentaje", "instancia", "aspecto", "aspectos", "punto", "puntos", "objeto", "objectos", "persona", "personas"];

var miscellaneous = ["sí", "no", "%", "euros", "años"];

module.exports = function () {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat(personalPronounsAccusative, possessivePronouns, personalPronounsGenitive, personalPronounsPrepositional, personalPronounsComitative),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat(subordinatingConjunctions),
		verbs: otherAuxiliaries.concat(copula, interviewVerbs, delexicalisedVerbs, otherAuxiliariesInfinitive),
		infinitives: otherAuxiliariesInfinitive.concat(copulaInfinitive),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat(interrogativePronouns, interrogativeProAdverbs),
		transitionWords: transitionWords.concat(additionalTransitionWords),
		miscellaneous: miscellaneous,
		interjections: interjections,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat(numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, prepositionalAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous)
	};
};

},{"./transitionWords.js":19}],19:[function(require,module,exports){
"use strict";

/** @module config/transitionWords */

var singleWords = ["además", "adicional", "así", "asimismo", "aún", "aunque", "ciertamente", "como", "concluyendo", "conque", "contrariamente", "cuando", "decididamente", "decisivamente", "después", "diferentemente", "efectivamente", "entonces", "especialmente", "específicamente", "eventualmente", "evidentemente", "finalmente", "frecuentemente", "generalmente", "igualmente", "lógicamente", "luego", "mas", "mientras", "pero", "por", "porque", "posteriormente", "primero", "principalmente", "pronto", "próximamente", "pues", "raramente", "realmente", "seguidamente", "segundo", "semejantemente", "si", "siguiente", "sino", "súbitamente", "supongamos", "también", "tampoco", "tercero", "verbigracia", "vice-versa", "ya"];
var multipleWords = ["a causa de", "a continuación", "a diferencia de", "a fin de cuentas", "a la inversa", "a la misma vez", "a más de", "a más de esto", "a menos que", "a no ser que", "a pesar de", "a pesar de eso", "a pesar de todo", "a peser de", "a propósito", "a saber", "a todo esto", "ahora bien", "al contrario", "al fin y al cabo", "al final", "al inicio", "al mismo tiempo", "al principio", "ante todo", "antes bien", "antes de", "antes de nada", "antes que nada", "aparte de", "as así como", "así como", "así mismo", "así pues", "así que", "así y todo", "aún así", "claro está que", "claro que", "claro que sí", "como caso típico", "como decíamos", "como era de esperar", "como es de esperar", "como muestra", "como resultado", "como se ha notado", "como sigue", "comparado con", "con el objeto de", "con el propósito de", "con que", "con relación a", "con tal de que", "con todo", "dado que", "de ahí", "de cierta manera", "de cualquier manera", "de cualquier modo", "de ello resulta que", "de este modo", "de golpe", "de hecho", "de igual manera", "de igual modo", "de igualmanera", "de la manera siguiente", "de la misma forma", "de la misma manera", "de manera semejante", "del mismo modo", "de modo que", "de nuevo", "de otra manera", "de otro modo", "de pronto", "de qualquier manera", "de repente", "de suerte que", "de tal modo", "de todas formas", "de todas maneras", "de todos modos", "de veras", "debido a", "debido a que", "del mismo modo", "dentro de poco", "desde entonces", "después de", "después de todo", "ejemplo de esto", "el caso es que", "en aquel tiempo", "en cambio", "en cierto modo", "en comparación con", "en conclusión", "en concreto", "en conformidad con", "en consecuencia", "en consiguiente", "en contraste con", "en cualquier caso", "en cuanto", "en cuanto a", "en definitiva", "en efecto", "en el caso de que", "en este sentido", "en fin", "en fin de cuentas", "en general", "en lugar de", "en otras palabras", "en otro orden", "en otros términos", "en particular", "en primer lugar", "en primer término", "en primera instancia", "en realidad", "en relación a", "en relación con", "en representación de", "en resumen", "en resumidas cuentas", "en segundo lugar", "en seguida", "en síntesis", "en suma", "en todo caso", "en último término", "en verdad", "en vez de", "en virtud de", "entre ellas figura", "entre ellos figura", "es cierto que", "es decir", "es evidente que", "es incuestionable", "es indudable", "es más", "está claro que", "esto indica", "excepto si", "generalmente por ejemplo", "gracias a", "hasta aquí", "hasta cierto punto", "hasta el momento", "hay que añadir", "igual que", "la mayor parte del tiempo", "la mayoría del tiempo", "lo que es peor", "más tarde", "mejor dicho", "mientras tanto", "mirándolo todo", "nadie puede ignorar", "no faltaría más", "no obstante", "o sea", "otra vez", "otro aspecto", "par ilustrar", "para concluir", "para conclusión", "para continuar", "para empezar", "para finalizar", "para mencionar una cosa", "para que", "para resumir", "para terminar", "pongamos por caso", "por añadidura", "por cierto", "por consiguiente", "por ejemplo", "por el consiguiente", "por el contrario", "por el hecho que", "por eso", "por esta razón", "por esto", "por fin", "por la mayor parte", "por lo general", "por lo que", "por lo tanto", "por otro lado", "por otra parte", "por otro lado", "por supuesto", "por tanto", "por último", "por un lado", "por una parte", "primero que nada", "primero que todo", "pues bien", "puesto que", "rara vez", "resulta que", "sea como sea", "seguidamente entre tanto", "si bien", "siempre que", "siempre y cuando", "sigue que", "sin duda", "sin embargo", "sin ir más lejos", "sobre todo", "supuesto que", "tal como", "tales como", "tan pronto como", "tanto como", "una vez", "ya que"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

},{}],20:[function(require,module,exports){
"use strict";

/** @module stringProcessing/addWordboundary */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */
module.exports = function (matchString, extraWordBoundary) {
  var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
  var _extraWordBoundary = extraWordBoundary || "";

  wordBoundary = "[ \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
  wordBoundaryStart = "(^|" + wordBoundary + ")";
  wordBoundaryEnd = "($|" + wordBoundary + ")";

  return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],21:[function(require,module,exports){
"use strict";

/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require("../stringProcessing/addWordboundary.js");
var map = require("lodash/map");

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function (array, disableWordBoundary) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map(array, function (string) {
		if (_disableWordBoundary) {
			return string;
		}
		return addWordBoundary(string);
	});

	regexString = "(" + boundedArray.join(")|(") + ")";

	return new RegExp(regexString, "ig");
};

},{"../stringProcessing/addWordboundary.js":20,"lodash/map":206}],22:[function(require,module,exports){
"use strict";

var map = require("lodash/map");
var isUndefined = require("lodash/isUndefined");
var forEach = require("lodash/forEach");
var isNaN = require("lodash/isNaN");
var filter = require("lodash/filter");
var flatMap = require("lodash/flatMap");
var isEmpty = require("lodash/isEmpty");
var negate = require("lodash/negate");
var memoize = require("lodash/memoize");

var core = require("tokenizer2/core");

var getBlocks = require("../helpers/html.js").getBlocks;
var normalizeQuotes = require("../stringProcessing/quotes.js").normalize;

var unifyWhitespace = require("../stringProcessing/unifyWhitespace.js").unifyNonBreakingSpace;

// All characters that indicate a sentence delimiter.
var fullStop = ".";
// The \u2026 character is an ellipsis
var sentenceDelimiters = "?!;\u2026";
var newLines = "\n\r|\n|\r";

var fullStopRegex = new RegExp("^[" + fullStop + "]$");
var sentenceDelimiterRegex = new RegExp("^[" + sentenceDelimiters + "]$");
var sentenceRegex = new RegExp("^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$");
var htmlStartRegex = /^<([^>\s\/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
var newLineRegex = new RegExp(newLines);

var blockStartRegex = /^\s*[\[\(\{]\s*$/;
var blockEndRegex = /^\s*[\]\)}]\s*$/;

var tokens = [];
var sentenceTokenizer;

/**
 * Creates a tokenizer to create tokens from a sentence.
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	sentenceTokenizer = core(function (token) {
		tokens.push(token);
	});

	sentenceTokenizer.addRule(htmlStartRegex, "html-start");
	sentenceTokenizer.addRule(htmlEndRegex, "html-end");
	sentenceTokenizer.addRule(blockStartRegex, "block-start");
	sentenceTokenizer.addRule(blockEndRegex, "block-end");
	sentenceTokenizer.addRule(fullStopRegex, "full-stop");
	sentenceTokenizer.addRule(sentenceDelimiterRegex, "sentence-delimiter");
	sentenceTokenizer.addRule(sentenceRegex, "sentence");
}

/**
 * Returns whether or not a certain character is a capital letter.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isCapitalLetter(character) {
	return character !== character.toLocaleLowerCase();
}

/**
 * Returns whether or not a certain character is a number.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isNumber(character) {
	return !isNaN(parseInt(character, 10));
}

/**
 * Returns whether or not a given HTML tag is a break tag.
 *
 * @param {string} htmlTag The HTML tag to check.
 * @returns {boolean} Whether or not the given HTML tag is a break tag.
 */
function isBreakTag(htmlTag) {
	return (/<br/.test(htmlTag)
	);
}

/**
 * Returns whether or not a given character is quotation mark.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a quotation mark.
 */
function isQuotation(character) {
	character = normalizeQuotes(character);

	return "'" === character || "\"" === character;
}

/**
 * Returns whether or not a given character is a punctuation mark that can be at the beginning
 * of a sentence, like ¿ and ¡ used in Spanish.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a punctuation mark.
 */
function isPunctuation(character) {
	return "¿" === character || "¡" === character;
}

/**
 * Tokenizes a sentence, assumes that the text has already been split into blocks.
 *
 * @param {string} text The text to tokenize.
 * @returns {Array} An array of tokens.
 */
function tokenizeSentences(text) {
	createTokenizer();
	sentenceTokenizer.onText(text);

	sentenceTokenizer.end();

	return tokens;
}

/**
 * Removes duplicate whitespace from a given text.
 *
 * @param {string} text The text with duplicate whitespace.
 * @returns {string} The text without duplicate whitespace.
 */
function removeDuplicateWhitespace(text) {
	return text.replace(/\s+/, " ");
}

/**
 * Retrieves the next two characters from an array with the two next tokens.
 *
 * @param {Array} nextTokens The two next tokens. Might be undefined.
 * @returns {string} The next two characters.
 */
function getNextTwoCharacters(nextTokens) {
	var next = "";

	if (!isUndefined(nextTokens[0])) {
		next += nextTokens[0].src;
	}

	if (!isUndefined(nextTokens[1])) {
		next += nextTokens[1].src;
	}

	next = removeDuplicateWhitespace(next);

	return next;
}

/**
 * Checks if the sentenceBeginning beginning is a valid beginning.
 *
 * @param {string} sentenceBeginning The beginning of the sentence to validate.
 * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
 */
function isValidSentenceBeginning(sentenceBeginning) {
	return isCapitalLetter(sentenceBeginning) || isNumber(sentenceBeginning) || isQuotation(sentenceBeginning) || isPunctuation(sentenceBeginning);
}

/**
 * Checks if the token is a valid sentence ending.
 *
 * @param {Object} token The token to validate.
 * @returns {boolean} Returns true if the token is valid ending, false if it is not.
 */
function isSentenceStart(token) {
	return !isUndefined(token) && ("html-start" === token.type || "html-end" === token.type || "block-start" === token.type);
}

/**
 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
 *
 * @param {Array} tokens The tokens from the sentence tokenizer.
 * @returns {Array<string>} A list of sentences.
 */
function getSentencesFromTokens(tokens) {
	var tokenSentences = [],
	    currentSentence = "",
	    nextSentenceStart;

	var sliced;

	// Drop the first and last HTML tag if both are present.
	do {
		sliced = false;
		var firstToken = tokens[0];
		var lastToken = tokens[tokens.length - 1];

		if (firstToken.type === "html-start" && lastToken.type === "html-end") {
			tokens = tokens.slice(1, tokens.length - 1);

			sliced = true;
		}
	} while (sliced && tokens.length > 1);

	forEach(tokens, function (token, i) {
		var hasNextSentence;
		var nextToken = tokens[i + 1];
		var secondToNextToken = tokens[i + 2];
		var nextCharacters;

		switch (token.type) {

			case "html-start":
			case "html-end":
				if (isBreakTag(token.src)) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				} else {
					currentSentence += token.src;
				}
				break;

			case "sentence":
				currentSentence += token.src;
				break;

			case "sentence-delimiter":
				currentSentence += token.src;

				if (!isUndefined(nextToken) && "block-end" !== nextToken.type) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				}
				break;

			case "full-stop":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters([nextToken, secondToNextToken]);

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[1] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if (hasNextSentence && isNumber(nextCharacters[0])) {
					break;
				}
				// Only split on sentence delimiters when the next sentence looks like the start of a sentence.
				if (hasNextSentence && isValidSentenceBeginning(nextSentenceStart) || isSentenceStart(nextToken)) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				}
				break;

			case "block-start":
				currentSentence += token.src;
				break;

			case "block-end":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters([nextToken, secondToNextToken]);

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[0] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if (hasNextSentence && isNumber(nextCharacters[0])) {
					break;
				}

				if (hasNextSentence && isValidSentenceBeginning(nextSentenceStart) || isSentenceStart(nextToken)) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				}
				break;
		}
	});

	if ("" !== currentSentence) {
		tokenSentences.push(currentSentence);
	}

	tokenSentences = map(tokenSentences, function (sentence) {
		return sentence.trim();
	});

	return tokenSentences;
}

/**
 * Returns the sentences from a certain block.
 *
 * @param {string} block The HTML inside a HTML block.
 * @returns {Array<string>} The list of sentences in the block.
 */
function getSentencesFromBlock(block) {
	var tokens = tokenizeSentences(block);

	return tokens.length === 0 ? [] : getSentencesFromTokens(tokens);
}

var getSentencesFromBlockCached = memoize(getSentencesFromBlock);

/**
 * Returns sentences in a string.
 *
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function (text) {
	text = unifyWhitespace(text);
	var sentences,
	    blocks = getBlocks(text);

	// Split each block on newlines.
	blocks = flatMap(blocks, function (block) {
		return block.split(newLineRegex);
	});

	sentences = flatMap(blocks, getSentencesFromBlockCached);

	return filter(sentences, negate(isEmpty));
};

},{"../helpers/html.js":7,"../stringProcessing/quotes.js":24,"../stringProcessing/unifyWhitespace.js":31,"lodash/filter":176,"lodash/flatMap":179,"lodash/forEach":181,"lodash/isEmpty":193,"lodash/isNaN":196,"lodash/isUndefined":203,"lodash/map":206,"lodash/memoize":207,"lodash/negate":208,"tokenizer2/core":220}],23:[function(require,module,exports){
"use strict";

/** @module stringProcessing/countWords */

var stripTags = require("./stripHTMLTags.js").stripFullTags;
var stripSpaces = require("./stripSpaces.js");
var removePunctuation = require("./removePunctuation.js");
var map = require("lodash/map");
var filter = require("lodash/filter");

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function (text) {
	text = stripSpaces(stripTags(text));
	if (text === "") {
		return [];
	}

	var words = text.split(/\s/g);

	words = map(words, function (word) {
		return removePunctuation(word);
	});

	return filter(words, function (word) {
		return word.trim() !== "";
	});
};

},{"./removePunctuation.js":26,"./stripHTMLTags.js":27,"./stripSpaces.js":28,"lodash/filter":176,"lodash/map":206}],24:[function(require,module,exports){
"use strict";

/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes(text) {
  return text.replace(/[‘’‛`]/g, "'");
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes(text) {
  return text.replace(/[“”〝〞〟‟„]/g, "\"");
}

/**
 * Normalizes quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeQuotes(text) {
  return normalizeDoubleQuotes(normalizeSingleQuotes(text));
}

module.exports = {
  normalizeSingle: normalizeSingleQuotes,
  normalizeDouble: normalizeDoubleQuotes,
  normalize: normalizeQuotes
};

},{}],25:[function(require,module,exports){
"use strict";

var getWords = require("../stringProcessing/getWords.js");
var getSentences = require("../stringProcessing/getSentences.js");
var WordCombination = require("../values/WordCombination.js");
var normalizeQuotes = require("../stringProcessing/quotes.js").normalize;
var germanFunctionWords = require("../researches/german/functionWords.js");
var englishFunctionWords = require("../researches/english/functionWords.js");
var dutchFunctionWords = require("../researches/dutch/functionWords.js");
var spanishFunctionWords = require("../researches/spanish/functionWords.js");
var countSyllables = require("../stringProcessing/syllables/count.js");
var getLanguage = require("../helpers/getLanguage.js");

var filter = require("lodash/filter");
var map = require("lodash/map");
var forEach = require("lodash/forEach");
var has = require("lodash/has");
var flatMap = require("lodash/flatMap");
var values = require("lodash/values");
var take = require("lodash/take");
var includes = require("lodash/includes");
var intersection = require("lodash/intersection");
var isEmpty = require("lodash/isEmpty");

var densityLowerLimit = 0;
var densityUpperLimit = 0.03;
var relevantWordLimit = 100;
var wordCountLowerLimit = 200;

// En dash, em dash, hyphen-minus, and hash.
var specialCharacters = ["–", "—", "-", "#"];

/**
 * Returns the word combinations for the given text based on the combination size.
 *
 * @param {string} text The text to retrieve combinations for.
 * @param {number} combinationSize The size of the combinations to retrieve.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {WordCombination[]} All word combinations for the given text.
 */
function getWordCombinations(text, combinationSize, functionWords) {
	var sentences = getSentences(text);

	var words = void 0,
	    combination = void 0;

	return flatMap(sentences, function (sentence) {
		sentence = sentence.toLocaleLowerCase();
		sentence = normalizeQuotes(sentence);
		words = getWords(sentence);

		return filter(map(words, function (word, i) {
			// If there are still enough words in the sentence to slice of.
			if (i + combinationSize - 1 < words.length) {
				combination = words.slice(i, i + combinationSize);
				return new WordCombination(combination, 0, functionWords);
			}

			return false;
		}));
	});
}

/**
 * Calculates occurrences for a list of word combinations.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to calculate occurrences for.
 * @returns {WordCombination[]} Word combinations with their respective occurrences.
 */
function calculateOccurrences(wordCombinations) {
	var occurrences = {};

	forEach(wordCombinations, function (wordCombination) {
		var combination = wordCombination.getCombination();

		if (!has(occurrences, combination)) {
			occurrences[combination] = wordCombination;
		}

		occurrences[combination].incrementOccurrences();
	});

	return values(occurrences);
}

/**
 * Returns only the relevant combinations from a list of word combinations. Assumes
 * occurrences have already been calculated.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations(wordCombinations) {
	wordCombinations = wordCombinations.filter(function (combination) {
		return combination.getOccurrences() !== 1 && combination.getRelevance() !== 0;
	});
	return wordCombinations;
}

/**
 * Sorts combinations based on their relevance and length.
 *
 * @param {WordCombination[]} wordCombinations The combinations to sort.
 * @returns {void}
 */
function sortCombinations(wordCombinations) {
	wordCombinations.sort(function (combinationA, combinationB) {
		var difference = combinationB.getRelevance() - combinationA.getRelevance();
		// The combination with the highest relevance comes first.
		if (difference !== 0) {
			return difference;
		}
		// In case of a tie on relevance, the longest combination comes first.
		return combinationB.getLength() - combinationA.getLength();
	});
}

/**
 * Filters word combinations beginning with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginning(wordCombinations, functionWords) {
	return wordCombinations.filter(function (combination) {
		return !includes(functionWords, combination.getWords()[0]);
	});
}

/**
 * Filters word combinations ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtEnding(wordCombinations, functionWords) {
	return wordCombinations.filter(function (combination) {
		var words = combination.getWords();
		var lastWordIndex = words.length - 1;
		return !includes(functionWords, words[lastWordIndex]);
	});
}

/**
 * Filters word combinations beginning and ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {Array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWords(wordCombinations, functionWords) {
	wordCombinations = filterFunctionWordsAtBeginning(wordCombinations, functionWords);
	wordCombinations = filterFunctionWordsAtEnding(wordCombinations, functionWords);
	return wordCombinations;
}

/**
 * Filters word combinations containing a special character.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} specialCharacters The list of special characters.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterSpecialCharacters(wordCombinations, specialCharacters) {
	return wordCombinations.filter(function (combination) {
		return isEmpty(intersection(specialCharacters, combination.getWords()));
	});
}
/**
 * Filters word combinations with a length of one and a given syllable count.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} syllableCount The number of syllables to use for filtering.
 * @param {string} locale The paper's locale.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOnSyllableCount(wordCombinations, syllableCount, locale) {
	return wordCombinations.filter(function (combination) {
		return !(combination.getLength() === 1 && countSyllables(combination.getWords()[0], locale) <= syllableCount);
	});
}

/**
 * Filters word combinations based on keyword density if the word count is 200 or over.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} wordCount The number of words in the total text.
 * @param {number} densityLowerLimit The lower limit of keyword density.
 * @param {number} densityUpperLimit The upper limit of keyword density.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOnDensity(wordCombinations, wordCount, densityLowerLimit, densityUpperLimit) {
	return wordCombinations.filter(function (combination) {
		return combination.getDensity(wordCount) >= densityLowerLimit && combination.getDensity(wordCount) < densityUpperLimit;
	});
}

/**
 * Filters the list of word combination objects.
 * Word combinations with specific parts of speech at the beginning and/or end, as well as one-syllable single words, are removed.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @param {string} locale The paper's locale.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterCombinations(combinations, functionWords, locale) {
	combinations = filterFunctionWords(combinations, specialCharacters);
	combinations = filterFunctionWords(combinations, functionWords().articles);
	combinations = filterFunctionWords(combinations, functionWords().personalPronouns);
	combinations = filterFunctionWords(combinations, functionWords().prepositions);
	combinations = filterFunctionWords(combinations, functionWords().conjunctions);
	combinations = filterFunctionWords(combinations, functionWords().quantifiers);
	combinations = filterFunctionWords(combinations, functionWords().demonstrativePronouns);
	combinations = filterFunctionWords(combinations, functionWords().transitionWords);
	combinations = filterFunctionWords(combinations, functionWords().interjections);
	combinations = filterFunctionWordsAtEnding(combinations, functionWords().relativePronouns);
	combinations = filterFunctionWords(combinations, functionWords().pronominalAdverbs);
	combinations = filterFunctionWordsAtEnding(combinations, functionWords().miscellaneous);
	combinations = filterOnSyllableCount(combinations, 1, locale);
	switch (getLanguage(locale)) {
		case "en":
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().passiveAuxiliaries);
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().reflexivePronouns);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().verbs);
			break;
		case "es":
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().verbs);
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().infinitives);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().reflexivePronouns);
			break;
		case "de":
		case "nl":
			combinations = filterFunctionWords(combinations, functionWords().verbs);
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().beginningVerbs);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().reflexivePronouns);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().interrogativeProAdverbs);
			break;
	}
	return combinations;
}
/**
 * Returns the relevant words in a given text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @param {string} locale The paper's locale.
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords(text, locale) {
	var functionWords = void 0;
	switch (getLanguage(locale)) {
		case "de":
			functionWords = germanFunctionWords;
			break;
		case "nl":
			functionWords = dutchFunctionWords;
			break;
		case "es":
			functionWords = spanishFunctionWords;
			break;
		default:
		case "en":
			functionWords = englishFunctionWords;
			break;
	}

	var words = getWordCombinations(text, 1, functionWords().all);
	var wordCount = words.length;

	var oneWordCombinations = getRelevantCombinations(calculateOccurrences(words));

	sortCombinations(oneWordCombinations);
	oneWordCombinations = take(oneWordCombinations, 100);

	var oneWordRelevanceMap = {};

	forEach(oneWordCombinations, function (combination) {
		oneWordRelevanceMap[combination.getCombination()] = combination.getRelevance(functionWords);
	});

	var twoWordCombinations = calculateOccurrences(getWordCombinations(text, 2, functionWords().all));
	var threeWordCombinations = calculateOccurrences(getWordCombinations(text, 3, functionWords().all));
	var fourWordCombinations = calculateOccurrences(getWordCombinations(text, 4, functionWords().all));
	var fiveWordCombinations = calculateOccurrences(getWordCombinations(text, 5, functionWords().all));

	var combinations = oneWordCombinations.concat(twoWordCombinations, threeWordCombinations, fourWordCombinations, fiveWordCombinations);

	combinations = filterCombinations(combinations, functionWords, locale);

	forEach(combinations, function (combination) {
		combination.setRelevantWords(oneWordRelevanceMap);
	});

	combinations = getRelevantCombinations(combinations, wordCount);
	sortCombinations(combinations);

	if (wordCount >= wordCountLowerLimit) {
		combinations = filterOnDensity(combinations, wordCount, densityLowerLimit, densityUpperLimit);
	}

	return take(combinations, relevantWordLimit);
}

module.exports = {
	getWordCombinations: getWordCombinations,
	getRelevantWords: getRelevantWords,
	calculateOccurrences: calculateOccurrences,
	getRelevantCombinations: getRelevantCombinations,
	sortCombinations: sortCombinations,
	filterFunctionWordsAtBeginning: filterFunctionWordsAtBeginning,
	filterFunctionWords: filterFunctionWords,
	filterSpecialCharacters: filterSpecialCharacters,
	filterOnSyllableCount: filterOnSyllableCount,
	filterOnDensity: filterOnDensity
};

},{"../helpers/getLanguage.js":6,"../researches/dutch/functionWords.js":10,"../researches/english/functionWords.js":12,"../researches/german/functionWords.js":15,"../researches/spanish/functionWords.js":18,"../stringProcessing/getSentences.js":22,"../stringProcessing/getWords.js":23,"../stringProcessing/quotes.js":24,"../stringProcessing/syllables/count.js":30,"../values/WordCombination.js":34,"lodash/filter":176,"lodash/flatMap":179,"lodash/forEach":181,"lodash/has":183,"lodash/includes":186,"lodash/intersection":187,"lodash/isEmpty":193,"lodash/map":206,"lodash/take":214,"lodash/values":219}],26:[function(require,module,exports){
"use strict";

// Replace all other punctuation characters at the beginning or at the end of a word.
var punctuationRegexString = "[\\\u2013\\-\\(\\)_\\[\\]\u2019\u201C\u201D\"'.?!:;,\xBF\xA1\xAB\xBB\u2014\xD7+&]+";
var punctuationRegexStart = new RegExp("^" + punctuationRegexString);
var punctuationRegexEnd = new RegExp(punctuationRegexString + "$");

/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
module.exports = function (text) {
  text = text.replace(punctuationRegexStart, "");
  text = text.replace(punctuationRegexEnd, "");

  return text;
};

},{}],27:[function(require,module,exports){
"use strict";

/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require("../stringProcessing/stripSpaces.js");

var blockElements = require("../helpers/html.js").blockElements;

var blockElementStartRegex = new RegExp("^<(" + blockElements.join("|") + ")[^>]*?>", "i");
var blockElementEndRegex = new RegExp("</(" + blockElements.join("|") + ")[^>]*?>$", "i");

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
var stripIncompleteTags = function stripIncompleteTags(text) {
  text = text.replace(/^(<\/([^>]+)>)+/i, "");
  text = text.replace(/(<([^\/>]+)>)+$/i, "");
  return text;
};

/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
var stripBlockTagsAtStartEnd = function stripBlockTagsAtStartEnd(text) {
  text = text.replace(blockElementStartRegex, "");
  text = text.replace(blockElementEndRegex, "");
  return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function stripFullTags(text) {
  text = text.replace(/(<([^>]+)>)/ig, " ");
  text = stripSpaces(text);
  return text;
};

module.exports = {
  stripFullTags: stripFullTags,
  stripIncompleteTags: stripIncompleteTags,
  stripBlockTagsAtStartEnd: stripBlockTagsAtStartEnd
};

},{"../helpers/html.js":7,"../stringProcessing/stripSpaces.js":28}],28:[function(require,module,exports){
"use strict";

/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function (text) {
	// Replace multiple spaces with single space
	text = text.replace(/\s{2,}/g, " ");

	// Replace spaces followed by periods with only the period.
	text = text.replace(/\s\./g, ".");

	// Remove first/last character if space
	text = text.replace(/^\s+|\s+$/g, "");

	return text;
};

},{}],29:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
var pick = require("lodash/pick");

/**
 * Represents a partial deviation when counting syllables
 *
 * @param {Object} options Extra options about how to match this fragment.
 * @param {string} options.location The location in the word where this deviation can occur.
 * @param {string} options.word The actual string that should be counted differently.
 * @param {number} options.syllables The amount of syllables this fragment has.
 * @param {string[]} [options.notFollowedBy] A list of characters that this fragment shouldn't be followed with.
 * @param {string[]} [options.alsoFollowedBy] A list of characters that this fragment could be followed with.
 *
 * @constructor
 */
function DeviationFragment(options) {
	this._location = options.location;
	this._fragment = options.word;
	this._syllables = options.syllables;
	this._regex = null;

	this._options = pick(options, ["notFollowedBy", "alsoFollowedBy"]);
}

/**
 * Creates a regex that matches this fragment inside a word.
 *
 * @returns {void}
 */
DeviationFragment.prototype.createRegex = function () {
	var regexString = "";
	var options = this._options;

	var fragment = this._fragment;

	if (!isUndefined(options.notFollowedBy)) {
		fragment += "(?![" + options.notFollowedBy.join("") + "])";
	}

	if (!isUndefined(options.alsoFollowedBy)) {
		fragment += "[" + options.alsoFollowedBy.join("") + "]?";
	}

	switch (this._location) {
		case "atBeginning":
			regexString = "^" + fragment;
			break;

		case "atEnd":
			regexString = fragment + "$";
			break;

		case "atBeginningOrEnd":
			regexString = "(^" + fragment + ")|(" + fragment + "$)";
			break;

		default:
			regexString = fragment;
			break;
	}

	this._regex = new RegExp(regexString);
};

/**
 * Returns the regex that matches this fragment inside a word.
 *
 * @returns {RegExp} The regexp that matches this fragment.
 */
DeviationFragment.prototype.getRegex = function () {
	if (null === this._regex) {
		this.createRegex();
	}

	return this._regex;
};

/**
 * Returns whether or not this fragment occurs in a word.
 *
 * @param {string} word The word to match the fragment in.
 * @returns {boolean} Whether or not this fragment occurs in a word.
 */
DeviationFragment.prototype.occursIn = function (word) {
	var regex = this.getRegex();

	return regex.test(word);
};

/**
 * Removes this fragment from the given word.
 *
 * @param {string} word The word to remove this fragment from.
 * @returns {string} The modified word.
 */
DeviationFragment.prototype.removeFrom = function (word) {
	// Replace by a space to keep the remaining parts separated.
	return word.replace(this._fragment, " ");
};

/**
 * Returns the amount of syllables for this fragment.
 *
 * @returns {number} The amount of syllables for this fragment.
 */
DeviationFragment.prototype.getSyllables = function () {
	return this._syllables;
};

module.exports = DeviationFragment;

},{"lodash/isUndefined":203,"lodash/pick":209}],30:[function(require,module,exports){
"use strict";

/** @module stringProcessing/countSyllables */

var syllableMatchers = require("../../config/syllables.js");

var getWords = require("../getWords.js");

var forEach = require("lodash/forEach");
var filter = require("lodash/filter");
var find = require("lodash/find");
var isUndefined = require("lodash/isUndefined");
var map = require("lodash/map");
var sum = require("lodash/sum");
var memoize = require("lodash/memoize");
var flatMap = require("lodash/flatMap");

var SyllableCountIterator = require("../../helpers/syllableCountIterator.js");
var DeviationFragment = require("./DeviationFragment");

/**
 * Counts vowel groups inside a word.
 *
 * @param {string} word A text with words to count syllables.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} the syllable count.
 */
var countVowelGroups = function countVowelGroups(word, locale) {
	var numberOfSyllables = 0;
	var vowelRegex = new RegExp("[^" + syllableMatchers(locale).vowels + "]", "ig");
	var foundVowels = word.split(vowelRegex);
	var filteredWords = filter(foundVowels, function (vowel) {
		return vowel !== "";
	});
	numberOfSyllables += filteredWords.length;

	return numberOfSyllables;
};

/**
 * Counts the syllables using vowel exclusions. These are used for groups of vowels that are more or less
 * than 1 syllable.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelDeviations = function countVowelDeviations(word, locale) {
	var syllableCountIterator = new SyllableCountIterator(syllableMatchers(locale));
	return syllableCountIterator.countSyllables(word);
};

/**
 * Returns the number of syllables for the word if it is in the list of full word deviations.
 *
 * @param {String} word The word to retrieve the syllables for.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found.
 */
var countFullWordDeviations = function countFullWordDeviations(word, locale) {
	var fullWordDeviations = syllableMatchers(locale).deviations.words.full;

	var deviation = find(fullWordDeviations, function (fullWordDeviation) {
		return fullWordDeviation.word === word;
	});

	if (!isUndefined(deviation)) {
		return deviation.syllables;
	}

	return 0;
};

/**
 * Creates an array of deviation fragments for a certain locale.
 *
 * @param {Object} syllableConfig Syllable config for a certain locale.
 * @returns {DeviationFragment[]} A list of deviation fragments
 */
function createDeviationFragments(syllableConfig) {
	var deviationFragments = [];

	var deviations = syllableConfig.deviations;

	if (!isUndefined(deviations.words) && !isUndefined(deviations.words.fragments)) {
		deviationFragments = flatMap(deviations.words.fragments, function (fragments, fragmentLocation) {
			return map(fragments, function (fragment) {
				fragment.location = fragmentLocation;

				return new DeviationFragment(fragment);
			});
		});
	}

	return deviationFragments;
}

var createDeviationFragmentsMemoized = memoize(createDeviationFragments);

/**
 * Counts syllables in partial exclusions. If these are found, returns the number of syllables  found, and the modified word.
 * The word is modified so the excluded part isn't counted by the normal syllable counter.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {object} The number of syllables found and the modified word.
 */
var countPartialWordDeviations = function countPartialWordDeviations(word, locale) {
	var deviationFragments = createDeviationFragmentsMemoized(syllableMatchers(locale));
	var remainingParts = word;
	var syllableCount = 0;

	forEach(deviationFragments, function (deviationFragment) {
		if (deviationFragment.occursIn(remainingParts)) {
			remainingParts = deviationFragment.removeFrom(remainingParts);
			syllableCount += deviationFragment.getSyllables();
		}
	});

	return { word: remainingParts, syllableCount: syllableCount };
};

/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countUsingVowels = function countUsingVowels(word, locale) {
	var syllableCount = 0;

	syllableCount += countVowelGroups(word, locale);
	syllableCount += countVowelDeviations(word, locale);

	return syllableCount;
};

/**
 * Counts the number of syllables in a word.
 *
 * @param {string} word The word to count syllables of.
 * @param {string} locale The locale of the word.
 * @returns {number} The syllable count for the word.
 */
var countSyllablesInWord = function countSyllablesInWord(word, locale) {
	var syllableCount = 0;

	var fullWordExclusion = countFullWordDeviations(word, locale);
	if (fullWordExclusion !== 0) {
		return fullWordExclusion;
	}

	var partialExclusions = countPartialWordDeviations(word, locale);
	word = partialExclusions.word;
	syllableCount += partialExclusions.syllableCount;
	syllableCount += countUsingVowels(word, locale);

	return syllableCount;
};

/**
 * Counts the number of syllables in a text per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text The text to count the syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {int} The total number of syllables found in the text.
 */
var countSyllablesInText = function countSyllablesInText(text, locale) {
	text = text.toLocaleLowerCase();
	var words = getWords(text);

	var syllableCounts = map(words, function (word) {
		return countSyllablesInWord(word, locale);
	});

	return sum(syllableCounts);
};

module.exports = countSyllablesInText;

},{"../../config/syllables.js":2,"../../helpers/syllableCountIterator.js":8,"../getWords.js":23,"./DeviationFragment":29,"lodash/filter":176,"lodash/find":177,"lodash/flatMap":179,"lodash/forEach":181,"lodash/isUndefined":203,"lodash/map":206,"lodash/memoize":207,"lodash/sum":213}],31:[function(require,module,exports){
"use strict";

/** @module stringProcessing/unifyWhitespace */

/**
 * Replaces a non breaking space with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyNonBreakingSpace = function unifyNonBreakingSpace(text) {
  return text.replace(/&nbsp;/g, " ");
};

/**
 * Replaces all whitespaces with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyWhiteSpace = function unifyWhiteSpace(text) {
  return text.replace(/\s/g, " ");
};

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */
var unifyAllSpaces = function unifyAllSpaces(text) {
  text = unifyNonBreakingSpace(text);
  return unifyWhiteSpace(text);
};

module.exports = {
  unifyNonBreakingSpace: unifyNonBreakingSpace,
  unifyWhiteSpace: unifyWhiteSpace,
  unifyAllSpaces: unifyAllSpaces
};

},{}],32:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  var root = freeGlobal || freeSelf || Function('return this')();

  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.4';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"']/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol,
      symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
   * corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'assessmentPresenterResult': {},
    'hiddenSpan': {},
    'relevantWords': {},
    'snippetEditor': {}
  };

  templates['assessmentPresenterResult'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<ul class="wpseoanalysis assessment-results">\n    ';
     for (var i in scores) {
    __p += '\n        <li class="score">\n            <span class="assessment-results__mark-container">\n                ';
     if ( scores[ i ].marker ) {
    __p += '\n                    <button type="button" ';
     if ( markerButtonsDisabled ) {
    __p += ' disabled="disabled" ';
     }
    __p += '\n                        aria-label="';
     if ( markerButtonsDisabled ) {
    __p +=
    ((__t = ( i18n.disabledMarkText )) == null ? '' : __t);
     }
                                else if ( scores[ i ].identifier === activeMarker ) {
    __p +=
    ((__t = ( i18n.removeMarksInText )) == null ? '' : __t);
     }
                                else {
    __p +=
    ((__t = ( i18n.markInText )) == null ? '' : __t);
     }
    __p += '"\n                        class="assessment-results__mark ';

                            if ( markerButtonsDisabled ) {
    __p += ' icon-eye-disabled ';
     }
                            else if ( scores[ i ].identifier === activeMarker ) {
    __p += '\n                            icon-eye-active\n                        ';
     }
                            else {
    __p += '\n                            icon-eye-inactive\n                        ';
     }
    __p += '\n                        js-assessment-results__mark-' +
    ((__t = ( scores[ i ].identifier )) == null ? '' : __t) +
    ' yoast-tooltip yoast-tooltip-s">\n                        <span class="screen-reader-text">';
     if ( markerButtonsDisabled ) {
    __p +=
    ((__t = ( i18n.disabledMarkText )) == null ? '' : __t);
     }
                                else if ( scores[ i ].identifier === activeMarker ) {
    __p +=
    ((__t = ( i18n.removeMarksInText )) == null ? '' : __t);
     }
                                else {
    __p +=
    ((__t = ( i18n.markInText )) == null ? '' : __t);
     }
    __p += '\n                        </span></button>\n                ';
     }
    __p += '\n            </span>\n            <span class="wpseo-score-icon ' +
    __e( scores[ i ].className ) +
    '"></span>\n            <span class="screen-reader-text">' +
    ((__t = ( scores[ i ].screenReaderText )) == null ? '' : __t) +
    '</span>\n            <span class="wpseo-score-text">' +
    ((__t = ( scores[ i ].text )) == null ? '' : __t) +
    '</span>\n        </li>\n    ';
     }
    __p += '\n</ul>\n';

    }
    return __p
  };

  templates['hiddenSpan'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<span aria-hidden="true" style="width: ' +
    __e( width ) +
    '; height: auto; position: absolute; visibility: hidden; ';
     if ( "" !== whiteSpace ) {
    __p += 'white-space: ' +
    __e(whiteSpace );
       }
    __p += '">\n\n</span>\n';

    }
    return __p
  };

  templates['relevantWords'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<table>\n    <tr>\n        <th>Word</th>\n        <th>Density</th>\n        <th>Occurrences</th>\n        <th>Length</th>\n        <th>Relevant word percentage</th>\n        <th>Length bonus</th>\n        <th>Multiplier</th>\n        <th>Relevance</th>\n    </tr>\n    ';
     for (var i in words) {
    __p += '\n        <tr>\n            <td>' +
    ((__t = ( words[ i ].word )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].density )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].occurrences )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].length )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].relevantWordPercentage )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].lengthBonus )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].multiplier )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].relevance )) == null ? '' : __t) +
    '</td>\n        </tr>\n    ';
     }
    __p += '\n</table>\n';

    }
    return __p
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<div id="snippet_preview" class="yoast-section">\n	<section class="snippet-editor__preview">\n		<h3 class="snippet-editor__heading snippet-editor__heading-icon snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n	<p class="screen-reader-text">' +
    __e( i18n.snippetPreviewDescription ) +
    '</p>\n\n		<div id="snippet-preview-view" class="snippet-editor__view">\n			<div class="snippet_container snippet_container__title snippet-editor__container" id="title_container">\n				<span class="screen-reader-text">' +
    __e( i18n.titleLabel ) +
    '</span>\n				<span class="title" id="render_title_container">\n					<span id="snippet_title">\n						' +
    __e( rendered.title ) +
    '\n					</span>\n				</span>\n				<span class="title" id="snippet_sitename"></span>\n			</div>\n			<div class="snippet_container snippet_container__url snippet-editor__container" id="url_container">\n				<span class="screen-reader-text">' +
    __e( i18n.slugLabel ) +
    '</span>\n				<span class="urlFull">\n					<cite class="url urlBase" id="snippet_citeBase">\n						' +
    __e( rendered.baseUrl ) +
    '\n					</cite><cite class="url" id="snippet_cite">\n						' +
    __e( rendered.snippetCite ) +
    '\n					</cite>\n				</span><span class="down_arrow"></span>\n			</div>\n			<div class="snippet_container snippet_container__meta snippet-editor__container" id="meta_container">\n				<span class="screen-reader-text">' +
    __e( i18n.metaDescriptionLabel ) +
    '</span>\n				';
     if ( "" !== metaDescriptionDate ) {
    __p += '\n					<span class="snippet-editor__date">\n						' +
    __e( metaDescriptionDate ) +
    ' -\n					</span>\n				';
     }
    __p += '\n				<span class="desc" id="snippet_meta">\n					' +
    __e( rendered.meta ) +
    '\n				</span>\n			</div>\n		</div>\n\n		<div class="snippet-editor__is-scrollable-hintwrapper">\n			<span class=\'snippet-editor__is-scrollable-hint\' aria-hidden=\'true\'>' +
    __e( i18n.isScrollableHint ) +
    '</span>\n		</div>\n\n		<div class="snippet-editor__view-toggle">\n			<button class="snippet-editor__view-icon snippet-editor__view-icon-mobile yoast-tooltip yoast-tooltip-se" type="button" data-type="mobile" aria-label="' +
    __e( i18n.mobilePreviewMode ) +
    '" />\n			<button class="snippet-editor__view-icon snippet-editor__view-icon-desktop yoast-tooltip yoast-tooltip-se" type="button" data-type="desktop" aria-label="' +
    __e( i18n.desktopPreviewMode ) +
    '" />\n		</div>\n		<button class="snippet-editor__button snippet-editor__edit-button" type="button" aria-expanded="false">\n			' +
    __e( i18n.edit ) +
    '\n		</button>\n	</section>\n\n	<div class="snippet-editor__form snippet-editor--hidden">\n		<label for="snippet-editor-title" class="snippet-editor__label">\n			' +
    __e( i18n.title ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n		</label>\n		<progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title" aria-hidden="true">\n			<div class="snippet-editor__progress-bar"></div>\n		</progress>\n		<label for="snippet-editor-slug" class="snippet-editor__label">\n			' +
    __e( i18n.slug ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" placeholder="' +
    __e( placeholder.urlPath ) +
    '" />\n		</label>\n		<label for="snippet-editor-meta-description" class="snippet-editor__label">\n			' +
    __e( i18n.metaDescription ) +
    '\n			<textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description" placeholder="' +
    __e( placeholder.metaDesc ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n		</label>\n		<progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description" aria-hidden="true">\n			<div class="snippet-editor__progress-bar"></div>\n		</progress>\n\n		<button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n	</div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeModule) {
    (freeModule.exports = templates).templates = templates;
    freeExports.templates = templates;
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],33:[function(require,module,exports){
"use strict";

var defaults = require("lodash/defaults");

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, description: string, title: string, url: string}}
 */
var defaultAttributes = {
  keyword: "",
  description: "",
  title: "",
  titleWidth: 0,
  url: "",
  locale: "en_US",
  permalink: ""
};

/**
 * Construct the Paper object and set the keyword property.
 * @param {string} text The text to use in the analysis.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Paper = function Paper(text, attributes) {
  this._text = text || "";

  attributes = attributes || {};
  defaults(attributes, defaultAttributes);
  if (attributes.locale === "") {
    attributes.locale = defaultAttributes.locale;
  }
  this._attributes = attributes;
};

/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if the Paper has a keyword.
 */
Paper.prototype.hasKeyword = function () {
  return this._attributes.keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available.
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function () {
  return this._attributes.keyword;
};

/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if the paper has a text.
 */
Paper.prototype.hasText = function () {
  return this._text !== "";
};

/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function () {
  return this._text;
};

/**
 * Check whether a description is available.
 * @returns {boolean} Returns true if the paper has a description.
 */
Paper.prototype.hasDescription = function () {
  return this._attributes.description !== "";
};

/**
 * Return the description or an empty string if no description is available.
 * @returns {string} Returns the description.
 */
Paper.prototype.getDescription = function () {
  return this._attributes.description;
};

/**
 * Check whether an title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function () {
  return this._attributes.title !== "";
};

/**
 * Return the title, or an empty string of no title is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitle = function () {
  return this._attributes.title;
};

/**
 * Check whether an title width in pixels is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitleWidth = function () {
  return this._attributes.titleWidth !== 0;
};

/**
 * Return the title width in pixels, or an empty string of no title width in pixels is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitleWidth = function () {
  return this._attributes.titleWidth;
};

/**
 * Check whether an url is available
 * @returns {boolean} Returns true if the Paper has an Url.
 */
Paper.prototype.hasUrl = function () {
  return this._attributes.url !== "";
};

/**
 * Return the url, or an empty string of no url is available.
 * @returns {string} Returns the url
 */
Paper.prototype.getUrl = function () {
  return this._attributes.url;
};

/**
 * Check whether a locale is available
 * @returns {boolean} Returns true if the paper has a locale
 */
Paper.prototype.hasLocale = function () {
  return this._attributes.locale !== "";
};

/**
 * Return the locale or an empty string if no locale is available
 * @returns {string} Returns the locale
 */
Paper.prototype.getLocale = function () {
  return this._attributes.locale;
};

/**
 * Check whether a permalink is available
 * @returns {boolean} Returns true if the Paper has a permalink.
 */
Paper.prototype.hasPermalink = function () {
  return this._attributes.permalink !== "";
};

/**
 * Return the permalink, or an empty string of no permalink is available.
 * @returns {string} Returns the permalink.
 */
Paper.prototype.getPermalink = function () {
  return this._attributes.permalink;
};

module.exports = Paper;

},{"lodash/defaults":174}],34:[function(require,module,exports){
"use strict";

var forEach = require("lodash/forEach");
var has = require("lodash/has");

/**
 * Returns whether or not the given word is a function word.
 *
 * @param {string} word The word to check.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {boolean} Whether or not the word is a function word.
 */
function isFunctionWord(word, functionWords) {
  return -1 !== functionWords.indexOf(word.toLocaleLowerCase());
}

/**
 * Represents a word combination in the context of relevant words.
 *
 * @constructor
 *
 * @param {string[]} words The list of words that this combination consists of.
 * @param {number} [occurrences] The number of occurrences, defaults to 0.
 * @param {Function} functionWords The function containing the lists of function words.
 */
function WordCombination(words, occurrences, functionWords) {
  this._words = words;
  this._length = words.length;
  this._occurrences = occurrences || 0;
  this._functionWords = functionWords;
}

WordCombination.lengthBonus = {
  2: 3,
  3: 7,
  4: 12,
  5: 18
};

/**
 * Returns the base relevance based on the length of this combination.
 *
 * @returns {number} The base relevance based on the length.
 */
WordCombination.prototype.getLengthBonus = function () {
  if (has(WordCombination.lengthBonus, this._length)) {
    return WordCombination.lengthBonus[this._length];
  }

  return 0;
};

/**
 * Returns the list with words.
 *
 * @returns {array} The list with words.
 */
WordCombination.prototype.getWords = function () {
  return this._words;
};

/**
 * Returns the word combination length.
 *
 * @returns {number} The word combination length.
 */
WordCombination.prototype.getLength = function () {
  return this._length;
};

/**
 * Returns the combination as it occurs in the text.
 *
 * @returns {string} The combination.
 */
WordCombination.prototype.getCombination = function () {
  return this._words.join(" ");
};

/**
 * Returns the amount of occurrences of this word combination.
 *
 * @returns {number} The amount of occurrences.
 */
WordCombination.prototype.getOccurrences = function () {
  return this._occurrences;
};

/**
 * Increments the occurrences.
 *
 * @returns {void}
 */
WordCombination.prototype.incrementOccurrences = function () {
  this._occurrences += 1;
};

/**
 * Returns the relevance of the length.
 *
 * @param {number} relevantWordPercentage The relevance of the words within the combination.
 * @returns {number} The relevance based on the length and the word relevance.
 */
WordCombination.prototype.getMultiplier = function (relevantWordPercentage) {
  var lengthBonus = this.getLengthBonus();

  // The relevance scales linearly from the relevance of one word to the maximum.
  return 1 + relevantWordPercentage * lengthBonus;
};

/**
 * Returns if the given word is a relevant word based on the given word relevance.
 *
 * @param {string} word The word to check if it is relevant.
 * @returns {boolean} Whether or not it is relevant.
 */
WordCombination.prototype.isRelevantWord = function (word) {
  return has(this._relevantWords, word);
};

/**
 * Returns the relevance of the words within this combination.
 *
 * @returns {number} The percentage of relevant words inside this combination.
 */
WordCombination.prototype.getRelevantWordPercentage = function () {
  var relevantWordCount = 0,
      wordRelevance = 1;

  if (this._length > 1) {
    forEach(this._words, function (word) {
      if (this.isRelevantWord(word)) {
        relevantWordCount += 1;
      }
    }.bind(this));

    wordRelevance = relevantWordCount / this._length;
  }

  return wordRelevance;
};

/**
 * Returns the relevance for this word combination.
 *
 * @returns {number} The relevance of this word combination.
 */
WordCombination.prototype.getRelevance = function () {
  if (this._words.length === 1 && isFunctionWord(this._words[0], this._functionWords)) {
    return 0;
  }

  var wordRelevance = this.getRelevantWordPercentage();
  if (wordRelevance === 0) {
    return 0;
  }

  return this.getMultiplier(wordRelevance) * this._occurrences;
};

/**
 * Sets the relevance of single words
 *
 * @param {Object} relevantWords A mapping from a word to a relevance.
 * @returns {void}
 */
WordCombination.prototype.setRelevantWords = function (relevantWords) {
  this._relevantWords = relevantWords;
};

/**
 * Returns the density of this combination within the text.
 *
 * @param {number} wordCount The word count of the text this combination was found in.
 * @returns {number} The density of this combination.
 */
WordCombination.prototype.getDensity = function (wordCount) {
  return this._occurrences / wordCount;
};

module.exports = WordCombination;

},{"lodash/forEach":181,"lodash/has":183}],35:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":118,"./_root":157}],36:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":124,"./_hashDelete":125,"./_hashGet":126,"./_hashHas":127,"./_hashSet":128}],37:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":137,"./_listCacheDelete":138,"./_listCacheGet":139,"./_listCacheHas":140,"./_listCacheSet":141}],38:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":118,"./_root":157}],39:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":142,"./_mapCacheDelete":143,"./_mapCacheGet":144,"./_mapCacheHas":145,"./_mapCacheSet":146}],40:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":118,"./_root":157}],41:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":118,"./_root":157}],42:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":39,"./_setCacheAdd":158,"./_setCacheHas":159}],43:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":37,"./_stackClear":163,"./_stackDelete":164,"./_stackGet":165,"./_stackHas":166,"./_stackSet":167}],44:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":157}],45:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":157}],46:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":118,"./_root":157}],47:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],48:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],49:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],50:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":70}],51:[function(require,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

},{}],52:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":94,"./_isIndex":130,"./isArguments":188,"./isArray":189,"./isBuffer":192,"./isTypedArray":202}],53:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],54:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],55:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],56:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":58,"./eq":175}],57:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":175}],58:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":109}],59:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":64,"./_createBaseEach":105}],60:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./_baseEach":59}],61:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],62:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":54,"./_isFlattenable":129}],63:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":106}],64:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":63,"./keys":204}],65:[function(require,module,exports){
var castPath = require('./_castPath'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":101,"./_toKey":170}],66:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":54,"./isArray":189}],67:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":44,"./_getRawTag":119,"./_objectToString":154}],68:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;

},{}],69:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],70:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN'),
    strictIndexOf = require('./_strictIndexOf');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;

},{"./_baseFindIndex":61,"./_baseIsNaN":76,"./_strictIndexOf":168}],71:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;

},{"./_SetCache":42,"./_arrayIncludes":50,"./_arrayIncludesWith":51,"./_arrayMap":53,"./_baseUnary":96,"./_cacheHas":98}],72:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":67,"./isObjectLike":199}],73:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":74,"./isObjectLike":199}],74:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":43,"./_equalArrays":110,"./_equalByTag":111,"./_equalObjects":112,"./_getTag":121,"./isArray":189,"./isBuffer":192,"./isTypedArray":202}],75:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":43,"./_baseIsEqual":73}],76:[function(require,module,exports){
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;

},{}],77:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":134,"./_toSource":171,"./isFunction":194,"./isObject":198}],78:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":67,"./isLength":195,"./isObjectLike":199}],79:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":83,"./_baseMatchesProperty":84,"./identity":185,"./isArray":189,"./property":210}],80:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":135,"./_nativeKeys":151}],81:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./_isPrototype":135,"./_nativeKeysIn":152,"./isObject":198}],82:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":59,"./isArrayLike":190}],83:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":75,"./_getMatchData":117,"./_matchesStrictComparable":148}],84:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":73,"./_isKey":132,"./_isStrictComparable":136,"./_matchesStrictComparable":148,"./_toKey":170,"./get":182,"./hasIn":184}],85:[function(require,module,exports){
var basePickBy = require('./_basePickBy'),
    hasIn = require('./hasIn');

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

module.exports = basePick;

},{"./_basePickBy":86,"./hasIn":184}],86:[function(require,module,exports){
var baseGet = require('./_baseGet'),
    baseSet = require('./_baseSet'),
    castPath = require('./_castPath');

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;

},{"./_baseGet":65,"./_baseSet":90,"./_castPath":101}],87:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],88:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":65}],89:[function(require,module,exports){
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

},{"./_overRest":156,"./_setToString":161,"./identity":185}],90:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;

},{"./_assignValue":56,"./_castPath":101,"./_isIndex":130,"./_toKey":170,"./isObject":198}],91:[function(require,module,exports){
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

},{"./_defineProperty":109,"./constant":173,"./identity":185}],92:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],93:[function(require,module,exports){
/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

module.exports = baseSum;

},{}],94:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],95:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":44,"./_arrayMap":53,"./isArray":189,"./isSymbol":201}],96:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],97:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":53}],98:[function(require,module,exports){
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],99:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;

},{"./isArrayLikeObject":191}],100:[function(require,module,exports){
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

},{"./identity":185}],101:[function(require,module,exports){
var isArray = require('./isArray'),
    isKey = require('./_isKey'),
    stringToPath = require('./_stringToPath'),
    toString = require('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

},{"./_isKey":132,"./_stringToPath":169,"./isArray":189,"./toString":218}],102:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":56,"./_baseAssignValue":58}],103:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":157}],104:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_baseRest":89,"./_isIterateeCall":131}],105:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":190}],106:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],107:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":79,"./isArrayLike":190,"./keys":204}],108:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = customDefaultsAssignIn;

},{"./eq":175}],109:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":118}],110:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":42,"./_arraySome":55,"./_cacheHas":98}],111:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":44,"./_Uint8Array":45,"./_equalArrays":110,"./_mapToArray":147,"./_setToArray":160,"./eq":175}],112:[function(require,module,exports){
var getAllKeys = require('./_getAllKeys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./_getAllKeys":115}],113:[function(require,module,exports){
var flatten = require('./flatten'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;

},{"./_overRest":156,"./_setToString":161,"./flatten":180}],114:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],115:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":66,"./_getSymbols":120,"./keys":204}],116:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":133}],117:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":136,"./keys":204}],118:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":77,"./_getValue":122}],119:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":44}],120:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":49,"./stubArray":211}],121:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":35,"./_Map":38,"./_Promise":40,"./_Set":41,"./_WeakMap":46,"./_baseGetTag":67,"./_toSource":171}],122:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],123:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":101,"./_isIndex":130,"./_toKey":170,"./isArguments":188,"./isArray":189,"./isLength":195}],124:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":150}],125:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],126:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":150}],127:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":150}],128:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":150}],129:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

},{"./_Symbol":44,"./isArguments":188,"./isArray":189}],130:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],131:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":130,"./eq":175,"./isArrayLike":190,"./isObject":198}],132:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":189,"./isSymbol":201}],133:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],134:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":103}],135:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],136:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":198}],137:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],138:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":57}],139:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":57}],140:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":57}],141:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":57}],142:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":36,"./_ListCache":37,"./_Map":38}],143:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":116}],144:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":116}],145:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":116}],146:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":116}],147:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],148:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],149:[function(require,module,exports){
var memoize = require('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

},{"./memoize":207}],150:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":118}],151:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":155}],152:[function(require,module,exports){
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],153:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":114}],154:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],155:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],156:[function(require,module,exports){
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":47}],157:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":114}],158:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],159:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],160:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],161:[function(require,module,exports){
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

},{"./_baseSetToString":91,"./_shortOut":162}],162:[function(require,module,exports){
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

},{}],163:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":37}],164:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],165:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],166:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],167:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":37,"./_Map":38,"./_MapCache":39}],168:[function(require,module,exports){
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;

},{}],169:[function(require,module,exports){
var memoizeCapped = require('./_memoizeCapped');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./_memoizeCapped":149}],170:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":201}],171:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],172:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

},{"./_copyObject":102,"./_createAssigner":104,"./keysIn":205}],173:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],174:[function(require,module,exports){
var apply = require('./_apply'),
    assignInWith = require('./assignInWith'),
    baseRest = require('./_baseRest'),
    customDefaultsAssignIn = require('./_customDefaultsAssignIn');

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, customDefaultsAssignIn);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./_apply":47,"./_baseRest":89,"./_customDefaultsAssignIn":108,"./assignInWith":172}],175:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],176:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;

},{"./_arrayFilter":49,"./_baseFilter":60,"./_baseIteratee":79,"./isArray":189}],177:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

},{"./_createFind":107,"./findIndex":178}],178:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":61,"./_baseIteratee":79,"./toInteger":216}],179:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    map = require('./map');

/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

module.exports = flatMap;

},{"./_baseFlatten":62,"./map":206}],180:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

},{"./_baseFlatten":62}],181:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

},{"./_arrayEach":48,"./_baseEach":59,"./_castFunction":100,"./isArray":189}],182:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":65}],183:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":68,"./_hasPath":123}],184:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":69,"./_hasPath":123}],185:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],186:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

},{"./_baseIndexOf":70,"./isArrayLike":190,"./isString":200,"./toInteger":216,"./values":219}],187:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIntersection = require('./_baseIntersection'),
    baseRest = require('./_baseRest'),
    castArrayLikeObject = require('./_castArrayLikeObject');

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;

},{"./_arrayMap":53,"./_baseIntersection":71,"./_baseRest":89,"./_castArrayLikeObject":99}],188:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":72,"./isObjectLike":199}],189:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],190:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":194,"./isLength":195}],191:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":190,"./isObjectLike":199}],192:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":157,"./stubFalse":212}],193:[function(require,module,exports){
var baseKeys = require('./_baseKeys'),
    getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isPrototype = require('./_isPrototype'),
    isTypedArray = require('./isTypedArray');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;

},{"./_baseKeys":80,"./_getTag":121,"./_isPrototype":135,"./isArguments":188,"./isArray":189,"./isArrayLike":190,"./isBuffer":192,"./isTypedArray":202}],194:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":67,"./isObject":198}],195:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],196:[function(require,module,exports){
var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":197}],197:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

module.exports = isNumber;

},{"./_baseGetTag":67,"./isObjectLike":199}],198:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],199:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],200:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;

},{"./_baseGetTag":67,"./isArray":189,"./isObjectLike":199}],201:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":67,"./isObjectLike":199}],202:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":78,"./_baseUnary":96,"./_nodeUtil":153}],203:[function(require,module,exports){
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],204:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":52,"./_baseKeys":80,"./isArrayLike":190}],205:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":52,"./_baseKeysIn":81,"./isArrayLike":190}],206:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":53,"./_baseIteratee":79,"./_baseMap":82,"./isArray":189}],207:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":39}],208:[function(require,module,exports){
/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

module.exports = negate;

},{}],209:[function(require,module,exports){
var basePick = require('./_basePick'),
    flatRest = require('./_flatRest');

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;

},{"./_basePick":85,"./_flatRest":113}],210:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":87,"./_basePropertyDeep":88,"./_isKey":132,"./_toKey":170}],211:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],212:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],213:[function(require,module,exports){
var baseSum = require('./_baseSum'),
    identity = require('./identity');

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

module.exports = sum;

},{"./_baseSum":93,"./identity":185}],214:[function(require,module,exports){
var baseSlice = require('./_baseSlice'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;

},{"./_baseSlice":92,"./toInteger":216}],215:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":217}],216:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":215}],217:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":198,"./isSymbol":201}],218:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":95}],219:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;

},{"./_baseValues":97,"./keys":204}],220:[function(require,module,exports){
var findMatchingRule = function(rules, text){
  var i;
  for(i=0; i<rules.length; i++)
    if(rules[i].regex.test(text))
      return rules[i];
  return undefined;
};

var findMaxIndexAndRule = function(rules, text){
  var i, rule, last_matching_rule;
  for(i=0; i<text.length; i++){
    rule = findMatchingRule(rules, text.substring(0, i + 1));
    if(rule)
      last_matching_rule = rule;
    else if(last_matching_rule)
      return {max_index: i, rule: last_matching_rule};
  }
  return last_matching_rule ? {max_index: text.length, rule: last_matching_rule} : undefined;
};

module.exports = function(onToken_orig){
  var buffer = "";
  var rules = [];
  var line = 1;
  var col = 1;

  var onToken = function(src, type){
    onToken_orig({
      type: type,
      src: src,
      line: line,
      col: col
    });
    var lines = src.split("\n");
    line += lines.length - 1;
    col = (lines.length > 1 ? 1 : col) + lines[lines.length - 1].length;
  };

  return {
    addRule: function(regex, type){
      rules.push({regex: regex, type: type});
    },
    onText: function(text){
      var str = buffer + text;
      var m = findMaxIndexAndRule(rules, str);
      while(m && m.max_index !== str.length){
        onToken(str.substring(0, m.max_index), m.rule.type);

        //now find the next token
        str = str.substring(m.max_index);
        m = findMaxIndexAndRule(rules, str);
      }
      buffer = str;
    },
    end: function(){
      if(buffer.length === 0)
        return;

      var rule = findMatchingRule(rules, buffer);
      if(!rule){
        var err = new Error("unable to tokenize");
        err.tokenizer2 = {
          buffer: buffer,
          line: line,
          col: col
        };
        throw err;
      }

      onToken(buffer, rule.type);
    }
  };
};

},{}]},{},[1])