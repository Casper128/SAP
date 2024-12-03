sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"./model/DataManagerDAO"
], function (UIComponent, Device, models, DataManagerDAO) {
	"use strict";

	return UIComponent.extend("alfa.com.co.zui5_gestioncotizaciones.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// get user from login service
			this.setModel(models.getUserLog(), "user");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.setModel(models.createDetailModel(), "detail");

			this.setModel(models.createActivityModel(), "activity");

			this.setModel(models.createDateModel(), "date");

			this.setModel(models.createUser2Model(), "user2");

			this.setModel(models.createListModel(), "list");

			// set object DAO
			this.oDataManagerDAO = new DataManagerDAO(this);
		}
	});
});