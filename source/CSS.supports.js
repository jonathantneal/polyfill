/** @license CSS.supports polyfill | @version 0.4 | MIT License | github.com/termi/CSS.supports */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name CSS.supports.js
// @check_types
// ==/ClosureCompiler==

/*
TODO::
1. element.style.webkitProperty == element.style.WebkitProperty in Webkit (Chrome at least), so
CSS.supporst("webkit-animation", "name") is true. Think this is wrong.
*/

;(function() {
	"use strict";

	var global = window
		, _CSS_supports
		, msie
		, testElement
		, prevResultsCache
		, _CSS = global["CSS"]
	;

	if( !_CSS ) {
		_CSS = global["CSS"] = {};
	}

	// ---=== HAS CSS.supports support ===---
	_CSS_supports = _CSS.supports;

	// ---=== HAS supportsCSS support ===---
	if( !_CSS_supports && global["supportsCSS"] ) {// Opera 12.10 impl
		_CSS_supports = _CSS.supports = global["supportsCSS"].bind(global);
		if( global.__proto__ ) {
			delete global.__proto__["supportsCSS"];
		}
	}


	if(typeof _CSS_supports === "function") {
		if( (function() {
			// Test for support [supports condition](http://www.w3.org/TR/css3-conditional/#supportscondition)
			try {
				_CSS_supports.call(_CSS, "(a:a)");
				// SUCCESS
				return !(global = _CSS_supports = null);//return true
			}
			catch(e) {//FAIL
				//_CSS_supports = _CSS_supports.bind(global);
			}
		})() ) {
			// EXIT
			return;// Do not need anything to do. Exit from polyfill
		}
	}
	else {
		// ---=== NO CSS.supports support ===---

		msie = "runtimeStyle" in document.documentElement;
		testElement = global["document"].createElement("_");
		prevResultsCache = {};

		_CSS_supports = function(ToCamel_replacer, testStyle, testElement, propertyName, propertyValue) {
			var name_and_value = propertyName + "\\/" + propertyValue;
			if( name_and_value in prevResultsCache ) {
				return prevResultsCache[name_and_value];
			}

			/* TODO:: for IE < 9:
			 _ = document.documentElement.appendChild(document.createElement("_"))
			 _.currentStyle[propertyName] == propertyValue
			*/
			var __bind__RE_FIRST_LETTER = this
				, propertyName_CC = (propertyName + "").replace(__bind__RE_FIRST_LETTER, ToCamel_replacer)
			;

			var result = propertyName && propertyValue && (propertyName_CC in testStyle);

			if( result ) {
				/*if( msie ) {

					try {
						testElement.style[propertyName] = propertyValue;// IE throw here, if unsupported this syntax
						testElement.style.cssText = "";
					}
					catch(e) {
						result = false;
					}

					if( result ) {
						testElement.id = uuid;
						_document.body.appendChild(testElement);

						if( (prevPropValue = testElement.currentStyle[propertyName]) != propertyValue ) {
							_document.body.insertAdjacentHTML("beforeend", "<br style='display:none' id='" + uuid + "br'><style id='" + uuid + "style'>" +
								"#" + uuid + "{display:none;height:0;width:0;visibility:hidden;position:absolute;position:fixed;" + propertyName + ":" + propertyValue + "}" +
								"</style>");

							if( !(propertyName in testElement.currentStyle) ) {
								partOfCompoundPropName
							}

							if( /\(|\s/.test(propertyValue) ) {
								currentPropValue = testElement.currentStyle[propertyName];
								result = !!currentPropValue && currentPropValue != prevPropValue;
							}
							else {
								result = testElement.currentStyle[propertyName] == propertyValue;
							}
							//_document.documentElement.removeChild(document.getElementById(uuid + "br"));
							//_document.documentElement.removeChild(document.getElementById(uuid + "style"));
						}

						//_document.documentElement.removeChild(testElement);
					}*/

				if( msie ) {
					if( /\(|\s/.test(propertyValue) ) {
						try {
							testStyle[propertyName_CC] = propertyValue;
							result = !!testStyle[propertyName_CC];
						}
						catch(e) {
							result = false;
						}
					}
					else {
						testStyle.cssText = "display:none;height:0;width:0;visibility:hidden;position:absolute;position:fixed;" + propertyName + ":" + propertyValue;
						document.documentElement.appendChild(testElement);
						result = testElement.currentStyle[propertyName_CC] == propertyValue;
						document.documentElement.removeChild(testElement);
					}
				}
				else {
					testStyle.cssText = propertyName + ":" + propertyValue;
					result = testStyle[propertyName_CC];
					result = result == propertyValue || result && testStyle.length > 0;
				}
			}

			testStyle.cssText = "";

			return prevResultsCache[name_and_value] = result;
		}.bind(
			/(-)([a-z])/g // __bind__RE_FIRST_LETTER
			, function(a, b, c) { // ToCamel_replacer
				return c.toUpperCase()
			}
			, testElement.style // testStyle
			, msie ? testElement : null // testElement
		);
	}

	// _supportsCondition("(a:b) or (display:block) or (display:none) and (display:block1)")
	function _supportsCondition(str) {
		if(!str) {
			_supportsCondition.throwSyntaxError();
		}

		/** @enum {number} @const */
		var RMAP = {
			NOT: 1
			, AND: 2
			, OR: 4
			, PROPERTY: 8
			, VALUE: 16
			, GROUP_START: 32
			, GROUP_END: 64
		};

		var resultsStack = []
			, chr
			, result
			, valid = true
			, isNot
			, start
			, currentPropertyName
			, expectedPropertyValue
			, passThisGroup
			, nextRuleCanBe = 
				RMAP.NOT | RMAP.GROUP_START | RMAP.PROPERTY
			, currentRule
			, i = -1
			, newI
			, len = str.length
		;

		resultsStack.push(void 0);

		function _getResult() {
			var l = resultsStack.length - 1;
			if( l < 0 )valid = false;
			return resultsStack[ l ];
		}

		/**
		 * @param {string=} val
		 * @private
		 */
		function _setResult(val) {
			var l = resultsStack.length - 1;
			if( l < 0 )valid = false;
			result = resultsStack[ l ] = val;
		}

		/**
		 * @param {string?} that
		 * @param {string?} notThat
		 * @param {number=} __i
		 * @param {boolean=} cssValue
		 * @return {(number|undefined)}
		 * @private
		 */
		function _checkNext(that, notThat, __i, cssValue) {
			newI = __i || i;

			var chr
				, isQuited
				, isUrl
				, special
			;

			if(cssValue) {
				newI--;
			}

			do {
				chr = str.charAt(++newI);

				if(cssValue) {
					special = chr && (isQuited || isUrl);
					if(chr == "'" || chr == "\"") {
						special = (isQuited = !isQuited);
					}
					else if(!isQuited) {
						if(!isUrl && chr == "(") {
							// TODO:: in Chrome: $0.style.background = "url('http://asd))')"; $0.style.background == "url(http://asd%29%29/)"
							isUrl = true;
							special = true;
						}
						else if(isUrl && chr == ")") {
							isUrl = false;
							special = true;
						}
					}
				}
			}
			while(special || (chr && (!that || chr != that) && (!notThat || chr == notThat)));

			if(that == null || chr == that) {
				return newI;
			}
		}

		while(++i < len) {
			if(currentRule == RMAP.NOT) {
				nextRuleCanBe = RMAP.GROUP_START | RMAP.PROPERTY;
			}
			else if(currentRule == RMAP.AND || currentRule == RMAP.OR || currentRule == RMAP.GROUP_START) {
				nextRuleCanBe = RMAP.GROUP_START | RMAP.PROPERTY | RMAP.NOT;
			}
			else if(currentRule == RMAP.GROUP_END) {
				nextRuleCanBe = RMAP.GROUP_START | RMAP.NOT | RMAP.OR | RMAP.AND;
			}
			else if(currentRule == RMAP.VALUE) {
				nextRuleCanBe = RMAP.GROUP_END | RMAP.GROUP_START | RMAP.NOT | RMAP.OR | RMAP.AND;
			}
			else if(currentRule == RMAP.PROPERTY) {
				nextRuleCanBe = RMAP.VALUE;
			}

			chr = str.charAt(i);

			if(nextRuleCanBe & RMAP.NOT && chr == "n" && str.substr(i, 3) == "not") {
				currentRule = RMAP.NOT;
				i += 2;
			}
			else if(nextRuleCanBe & RMAP.AND && chr == "a" && str.substr(i, 3) == "and") {
				currentRule = RMAP.AND;
				i += 2;
			}
			else if(nextRuleCanBe & RMAP.OR && chr == "o" && str.substr(i, 2) == "or") {
				currentRule = RMAP.OR;
				i++;
			}
			else if(nextRuleCanBe & RMAP.GROUP_START && chr == "(" && _checkNext("(", " ")) {
				currentRule = RMAP.GROUP_START;
				i = newI - 1;
			}
			else if(nextRuleCanBe & RMAP.GROUP_END && chr == ")" && resultsStack.length > 1) {
				currentRule = RMAP.GROUP_END;
			}
			else if(nextRuleCanBe & RMAP.PROPERTY && chr == "(" && (start = _checkNext(null, " ")) && _checkNext(":", null, start)) {
				currentRule = RMAP.PROPERTY;
				i = newI - 1;
				currentPropertyName = str.substr(start, i - start + 1).trim();
				start = 0;
				expectedPropertyValue = null;
				continue;
			}
			else if(nextRuleCanBe & RMAP.VALUE && (start = _checkNext(null, " ")) && _checkNext(")", null, start, true)) {
				currentRule = RMAP.VALUE;
				i = newI;
				expectedPropertyValue = str.substr(start, i - start).trim();
				start = 0;
				chr = " ";
			}
			else if(chr == " ") {
				continue;
			}
			else {
				currentRule = 0;
			}

			if(!valid || !chr || !(currentRule & nextRuleCanBe)) {
				_supportsCondition.throwSyntaxError();
			}
			valid = true;

			if(currentRule == RMAP.OR) {
				if(result === false) {
					_setResult();
					passThisGroup = false;
				}
				else if(result === true) {
					passThisGroup = true;
				}

				continue;
			}

			if( passThisGroup ) {
				continue;
			}

			result = _getResult();

			if(currentRule == RMAP.NOT) {
				isNot = true;

				continue;
			}

			if(currentRule == RMAP.AND) {
				if(result === false) {
					passThisGroup = true;
				}
				else {
					_setResult();
				}

				continue;
			}

			if(result === false && !(currentRule & (RMAP.GROUP_END | RMAP.GROUP_START))) {
				_setResult(result);
				continue;
			}

			if( currentRule == RMAP.GROUP_START ) { // Group start
				resultsStack.push(void 0);
			}
			else if( currentRule == RMAP.GROUP_END ) { // Group end
				passThisGroup = false;

				resultsStack.pop();
				if( _getResult() !== void 0) {
					result = !!(result & _getResult());
				}

				isNot = false;
			}
			else if( currentRule == RMAP.VALUE ) { // Property value
				_setResult(_CSS_supports(currentPropertyName, expectedPropertyValue));
				if(isNot)result = !result;

				isNot = false;
				expectedPropertyValue = currentPropertyName = null;
			}

			_setResult(result);
		}

		if(!valid || result === void 0 || resultsStack.length > 1) {
			_supportsCondition.throwSyntaxError();
		}

		return result;
	}
	_supportsCondition.throwSyntaxError = function() {
		throw new Error("SYNTAX_ERR");
	};

	/**
	 * @expose
	 */
	_CSS.supports = function(a, b) {
		if(!arguments.length) {
			throw new Error("WRONG_ARGUMENTS_ERR");//TODO:: DOMException ?
		}

		if(arguments.length == 1) {
			return _supportsCondition(a);
		}

		return _CSS_supports(a, b);
	};

	global = testElement = null;// no need this any more
})();
