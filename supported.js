"use strict"; 
function isSupported(e) {
     return !!(isBrowser() && isArraySupported() && isFunctionSupported() && isObjectSupported() && isJSONSupported() && isWorkerSupported() && isUint8ClampedArraySupported() && isWebGLSupportedCached(e && e.failIfMajorPerformanceCaveat)) }
     function isBrowser() { return "undefined" != typeof window && "undefined" != typeof document } 
     function isArraySupported() { return Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray } 
     function isFunctionSupported() { return Function.prototype && Function.prototype.bind } 
     function isObjectSupported() { return Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions } 
     function isJSONSupported() { return "JSON" in window && "parse" in JSON && "stringify" in JSON } 
     function isWorkerSupported() { return "Worker" in window } 
     function isUint8ClampedArraySupported() { return "Uint8ClampedArray" in window } 
     function isWebGLSupportedCached(e) { return void 0 === isWebGLSupportedCache[e] && (isWebGLSupportedCache[e] = isWebGLSupported(e)), isWebGLSupportedCache[e] } 
     function isWebGLSupported(e) {
          var t = document.createElement("canvas"), r = Object.create(isSupported.webGLContextAttributes); 
          return r.failIfMajorPerformanceCaveat = e, t.probablySupportsContext ? t.probablySupportsContext("webgl", r) || t.probablySupportsContext("experimental-webgl", r) : t.supportsContext ? t.supportsContext("webgl", r) || t.supportsContext("experimental-webgl", r) : t.getContext("webgl", r) || t.getContext("experimental-webgl", r) } "undefined" != typeof module && module.exports ? module.exports = isSupported : window && (window.mapboxgl = window.mapboxgl || {}, window.mapboxgl.supported = isSupported); 
     var isWebGLSupportedCache = {}; 
     isSupported.webGLContextAttributes = { antialias: !1, alpha: !0, stencil: !0, depth: !0 };