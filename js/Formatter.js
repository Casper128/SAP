/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	// "sap/ui/core/routing/History",
	// "sap/m/MessageBox"

	// "com/alfa/js/Formatter",
	"sap/ui/thirdparty/datajs",
	"sap/ca/ui/model/format/DateFormat",
	"sap/ca/ui/model/format/NumberFormat",
	"sap/ca/ui/model/format/AmountFormat",
	"sap/ca/ui/model/format/QuantityFormat"
], function(Controller, datajs, DateFormat, NumberFormat, AmountFormat, QuantityFormat) {
	"use strict";

	return Controller.extend("com.alfa.js.Formatter", {

		convertDateToLocaleMedium: function(v) {
			var d = sap.ca.ui.model.format.DateFormat.getDateInstance({
				style: 'medium'
			});
			var D = d.parse(v);
			return d.format(D);
		},
		convertFloatToLocaleNoDecimalHandling: function(v) {
			var l = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			var n = sap.ca.ui.model.format.NumberFormat.getInstance({
				decimals: "0"
			}, l);
			return n.format(v);
		},
		formatItemNumber: function(i) {
			var a = sap.ui.core.format.NumberFormat.getIntegerInstance({
				minIntegerDigits: 6,
				maxIntegerDigits: 6
			});
			return a.format(10 * i)
		},
		formatOrderDate: function(d) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ORDERED", [d])
		},
		formatRequestDate: function(d) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("REQUESTED", [d])
		},
		formatSOTo: function(c) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SHIP_TO", [c])
		},
		formatCurrencyPerUnit: function(c, u) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CURRENCY_PER_UOM_EX", [c, u])
		},
		formatAddress: function() {
			if (arguments.length === 0) {
				return ""
			}
			if (arguments.length === 1) {
				return arguments[arguments.length - 1]
			}
			var i = 0;
			var a = arguments[i];
			for (i = 1; i < arguments.length; i++) {
				if (arguments[i]) {
					a = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ADDRESS_ELEMENT", [a, arguments[i]])
				}
			}
			return a
		},
		formatProductNoId: function(i) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PRODUCT_NO_EX", [i])
		},
		formatPrice: function(p, c) {
			return sap.ca.ui.model.format.AmountFormat.getInstance(c).format(p)
		},
		formatProductIDDesc: function(p, a) {
			if (p === undefined || a === undefined) {
				return ""
			}
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PRODUCT_ID_DESCRIPTION", [p, a])
		},
		stripLeadingZeros: function(v) {
			if (typeof v === "string") {
				return parseInt(v, 10)
			}
			return v
		},
		getTextPar: function(k, p) {
			if (!p) {
				p = ""
			}
			return jQuery.sap.formatMessage(k, [p])
		},
		formatItemNumberProductName: function(i, p) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ITEMNO_PRODUCTNAME", [com.alfa.js.Formatter
				.stripLeadingZeros(i), p
			])
		},
		formatSignQuantity: function(s) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SIGNQUANTITY", [s])
		},
		formatQuantityStatusA: function() {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("QUANTITY_STATUS_A")
		},
		formatDeliveryStatusA: function() {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DELIVERY_STATUS_A")
		},
		formatDeliveryStatusC: function() {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DELIVERY_STATUS_C")
		},
		formatQuantityUnitofMeasure: function(q, u) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("QUANTITY_UOM", [sap.ca.ui.model.format.QuantityFormat
				.FormatQuantityStandard(
					q, u, 0), u
			])
		},
		formatSuccessMessage: function(s) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SUCCESS", [s])
		}
	});
});