/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/bambi.js":
/*!**********************!*\
  !*** ./src/bambi.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/************************************************\r\n * bambi.js\r\n * Global app settings\r\n * FranckEinstein90\r\n ***********************************************/\r\n\r\n\r\n//const appVersion = require('../appversion.json') ; \r\n\r\nconst _findPageEvents = ()=> {\r\n    let bambiEvents = AJS.$(\".bambiEvent\") ;\r\n    console.log( bambiEvents ) ; \r\n    debugger ; \r\n    return bambiEvents ;  \r\n}\r\n\r\nconst _findBambiContainers = function(){ \r\n    //return the bambi containers currently in the DOM\r\n    let bambiContainers = AJS.$(\".bambiContainer\");\r\n    console.log (bambiContainers) ;  \r\n    //verifies that the section that contains data exists and is formatted correctly\r\n/*    let checkEventSection = AJS.$(\"h1:contains('Events')\").length > 0;\r\n    if ( !checkEventSection ) return false ; \r\n    checkEventSection = AJS.$(\"h1:contains('Events')\").next(\"UL\").length > 0;\r\n    if (!checkEventSection) { return false }\r\n    let check3 = check2.text();\r\n    return (check3 === \"init\" || check3 === eventSection.endLabel) */\r\n}\r\n\r\n\r\nconst bambi = ( function() {\r\n\r\n    let bambiVersion,\r\n        dataSectionOK, jqueryOK, \r\n        runningEnv, detectRunningEnv ; \r\n\r\n    let events ; \r\n    let bambiContainers ; \r\n /*   bambiVersion = {\r\n        major: appVersion.version.major,\r\n        minor: appVersion.version.minor\r\n    }*/\r\n\r\n    const eventSection = {\r\n        beginLabel: \"[***BEGIN CALENDAR EVENTS***]\",\r\n        endLabel: \"[***END CALENDAR EVENTS***]\"\r\n    } ; \r\n\r\n    jqueryOK = function(){\r\n        if(typeof jQuery != 'undefined'){\r\n            console.log(jQuery.fn.jquery)\r\n            return true\r\n        }\r\n        return false\r\n    }\r\n\r\n    detectRunningEnv = function() {\r\n        /**********************************************************************\r\n         * if this is running in a confluence environemnt, bambi expects the \r\n         * variable \"confEnv\" to be defined externally\r\n         * ************************************************************************/\r\n        try{\r\n            if (confEnv) { //check if this is a confluence env\r\n                return bambi.runningEnvs.production //this is a production env\r\n            } \r\n         }\r\n        catch(e){\r\n            return bambi.runningEnvs.development // this is a local development envi\r\n        }\r\n    }\r\n\r\n    return {\r\n        init: () => {\r\n            bambiContainers = _findBambiContainers() ; \r\n            events = _findPageEvents(); \r\n        },\r\n        run: () => {\r\n\r\n        }, \r\n\r\n        appStages:{\r\n            init: 5,\r\n            running: 10\r\n        },\r\n\r\n        errors:{\r\n            badInfoSection: \"bad info section\", \r\n            badJQuery: \"bad JQuery\" \r\n        },\r\n\r\n        runningEnvs: {\r\n            production: {code: 1, description:\"confluence page\"},\r\n            development: {code: 2, description: \"dev local\"}\r\n        },\r\n\r\n        isProd: function(){\r\n            return runningEnv.code == 1\r\n        }, \r\n\r\n        isDev: function() {\r\n            return runningEnv.code === 2\r\n        },\r\n       \r\n        getVersionString: function() {\r\n            return `Parks Canada Confluence Calendar - v${bambiVersion.major}.${bambiVersion.minor}`\r\n        },\r\n\r\n        prevVersion: undefined, //the previous version of the app used to save event and app information\r\n        clientData: {\r\n            \"monthsEn\": [\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\"],\r\n            \"monthsFr\": [\"Janvier\", \"Fevrier\", \"Mars\", \"Avril\", \"Mai\", \"Juin\", \"Juillet\", \"Aout\", \"Septembre\", \"Octobre\", \"Novembre\", \"Decembre\"],\r\n            \"weekDaysAbbrEn\": [\"Sun\", \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\"],\r\n            \"weekDaysAbbrFr\": [\"Dim\", \"Lun\", \"Mar\", \"Mer\", \"Jeu\", \"Ven\", \"Sam\"],\r\n            \"weekDays\": [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"]\r\n        },\r\n\r\n        htmlFieldSeparator: function(ver) { //returns the field separator corresponding to the version\r\n            if (ver === undefined) {\r\n                return '\\\\:'\r\n            }\r\n            if (ver === \"1.3\") {\r\n                return '\\\\[x\\\\|\\\\|\\\\x\\\\]'\r\n            }\r\n        },\r\n        path: (moduleName) => `./${moduleName}`\r\n    }\r\n})();\r\n\r\nmodule.exports = {\r\n    bambi\r\n};\r\n\n\n//# sourceURL=webpack:///./src/bambi.js?");

/***/ }),

/***/ "./src/client/main.js":
/*!****************************!*\
  !*** ./src/client/main.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval(" \r\n/****************************************************\r\n * Application Entry point\r\n * Client side\r\n ****************************************************/\r\nconst bambi = __webpack_require__(/*! ../bambi */ \"./src/bambi.js\").bambi;\r\n\r\n/*AJS is the AUI version of jquery*/\r\nAJS.toInit(function($) {\r\n    \r\n   const appInit = bambi.init() ;  \r\n   if( initApp ) bambi.run() ; \r\n\r\n});\n\n//# sourceURL=webpack:///./src/client/main.js?");

/***/ })

/******/ });