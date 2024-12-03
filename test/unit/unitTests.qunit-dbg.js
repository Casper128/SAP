/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"alfa/com/co/zui5_gestioncotizaciones/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});