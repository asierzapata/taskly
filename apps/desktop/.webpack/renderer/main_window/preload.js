/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/window_api.ts":
/*!********************************!*\
  !*** ./src/main/window_api.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n// Add there other modules\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.API = void 0;\nexports.API = {};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbWFpbi93aW5kb3dfYXBpLnRzIiwibWFwcGluZ3MiOiI7QUFBQSwwQkFBMEI7OztBQUViLFdBQUcsR0FBRyxFQUNsQiIsInNvdXJjZXMiOlsid2VicGFjazovL0B0YXNrbHkvZGVza3RvcC8uL3NyYy9tYWluL3dpbmRvd19hcGkudHM/MGRhZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBZGQgdGhlcmUgb3RoZXIgbW9kdWxlc1xuXG5leHBvcnQgY29uc3QgQVBJID0ge1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/window_api.ts\n");

/***/ }),

/***/ "./src/preload.ts":
/*!************************!*\
  !*** ./src/preload.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n// See the Electron documentation for details on how to use preload scripts:\n// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst electron_1 = __webpack_require__(/*! electron */ \"electron\");\nconst window_api_1 = __webpack_require__(/*! @main/window_api */ \"./src/main/window_api.ts\");\nelectron_1.contextBridge.exposeInMainWorld('api', window_api_1.API);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcHJlbG9hZC50cyIsIm1hcHBpbmdzIjoiO0FBQUEsNEVBQTRFO0FBQzVFLGdGQUFnRjs7QUFFaEYsbUVBQXdDO0FBRXhDLDZGQUFzQztBQUV0Qyx3QkFBYSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxnQkFBRyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHRhc2tseS9kZXNrdG9wLy4vc3JjL3ByZWxvYWQudHM/MDU2YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTZWUgdGhlIEVsZWN0cm9uIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb24gaG93IHRvIHVzZSBwcmVsb2FkIHNjcmlwdHM6XG4vLyBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9wcm9jZXNzLW1vZGVsI3ByZWxvYWQtc2NyaXB0c1xuXG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlIH0gZnJvbSAnZWxlY3Ryb24nXG5cbmltcG9ydCB7IEFQSSB9IGZyb20gJ0BtYWluL3dpbmRvd19hcGknXG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2FwaScsIEFQSSlcblxuZGVjbGFyZSBnbG9iYWwge1xuXHRpbnRlcmZhY2UgV2luZG93IHtcblx0XHRhcGk6IHR5cGVvZiBBUElcblx0fVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/preload.ts\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/preload.ts");
/******/ 	
/******/ })()
;