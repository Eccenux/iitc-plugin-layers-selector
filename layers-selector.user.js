// ==UserScript==
// @id             iitc-plugin-layers-selector@eccenux
// @name           IITC plugin: Quick selector of layers
// @category       Misc
// @version        0.0.2
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [0.0.2] This plugin provides extra toolbar for quick showing/hiding portal layers.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @match          https://intel.ingress.com/*
// @grant          none
// @updateURL      https://github.com/Eccenux/iitc-plugin-layers-selector/raw/master/layers-selector.meta.js
// @downloadURL    https://github.com/Eccenux/iitc-plugin-layers-selector/raw/master/layers-selector.user.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


//PLUGIN START ////////////////////////////////////////////////////////

//use own namespace for plugin
window.plugin.layersSelector = function() {};

/**
 * Very simple logger.
 */
function LOG() {
	var args = Array.prototype.slice.call(arguments); // Make real array from arguments
	args.unshift("[layersSelector] ");
	console.log.apply(console, args);
}
function LOGwarn() {
	var args = Array.prototype.slice.call(arguments); // Make real array from arguments
	args.unshift("[layersSelector] ");
	console.warn.apply(console, args);
}

/**
 * Zoom map to given value.
 */

/**
 * Show portal layers in given range.
 *
 * @example show all
 * plugin.layersSelector.portalRange(0, 8)
 * @example hide all
 * plugin.layersSelector.portalRange(null)
 */
window.plugin.layersSelector.portalRange = function(min, max) {
	var add = function(layer) {
		window.layerChooser.showLayer(layer.layerId, true);
	}
	var rem = function(layer) {
		window.layerChooser.showLayer(layer.layerId, false);
	}
	
	var overlayLayers = window.layerChooser.getLayers().overlayLayers;

	if (min === null) {
		// uncheck all
		for (var i = 0; i <= 8; i++) {
			var layer = overlayLayers[i];
			rem(layer);
		}
	} else {
		// uncheck before min
		for (var i = 0; i < min; i++) {
			var layer = overlayLayers[i];
			rem(layer);
		}
		// check from min to max
		for (var i = min; i <= max; i++) {
			var layer = overlayLayers[i];
			add(layer);
		}
		// uncheck after max
		for (var i = max+1; i <= 8; i++) {
			var layer = overlayLayers[i];
			rem(layer);
		}
	}
};

/**
 * Setup always visible content.
 */
window.plugin.layersSelector.setupContent = function() {
	// leaflet (sidebar buttons)
	$('.leaflet-control-container .leaflet-top.leaflet-left .leaflet-control-zoom').after(''
		+'<div class="leaflet-control-layersSelector leaflet-bar leaflet-control">'
		+'	<a href="#" onclick="plugin.layersSelector.portalRange(8, 8); return false" title="show only 8 level portals">8</a>'
		+'	<a href="#" onclick="plugin.layersSelector.portalRange(7, 8); return false" title="show only 7-8 level portals">7</a>'
		+'	<a href="#" onclick="plugin.layersSelector.portalRange(6, 8); return false" title="show only 6-8 level portals">6</a>'
		+'	<a href="#" onclick="plugin.layersSelector.portalRange(5, 8); return false" title="show only 5-8 level portals">5</a>'
		+'	<a href="#" onclick="plugin.layersSelector.portalRange(0, 8); return false" title="show all portals">P+</a>'
		+'	<a href="#" onclick="plugin.layersSelector.portalRange(null); return false" title="hide all portals">P-</a>'
		+'</div>'
	);
};

var setup = function() {
	window.plugin.layersSelector.setupContent();
};

//PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


