sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		getUserLog: function () {
			var oModel = new JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			oModel.attachRequestCompleted(function onCompleted(oEvent) {
				if (oEvent.getParameter("success")) {
					this.setData({
						"json": this.getJSON(),
						"status": "Success"
					}, true);
					console.log("user-services", this.getJSON());
				} else {
					var msg = oEvent.getParameter("errorObject").textStatus;
					if (msg) this.setData("status", msg);
					else this.setData("status", "Unknown error retrieving user info");
				}
			});
			return oModel;
		},

		createDetailModel: function () {
			var oModel = new JSONModel({});
			return oModel;
		},

		createActivityModel: function () {
			var oModel = new JSONModel({});
			return oModel;
		},

		createDateModel: function () {
			var oModel = new JSONModel({});
			return oModel;
		},

		createUser2Model: function () {
			var oModel = new JSONModel({});
			return oModel;
		},

		createListModel: function () {
			var oModel = new JSONModel({
				TipoActividad: [{
					text: "Llamada"
				}, {
					text: "Visita"
				}, {
					text: "Whatsapp"
				}],
				Estado: [{
					text: "Activa"
				}, {
					text: "En Proceso"
				}, {
					text: "Cerrada"
				}, ]
			});
			return oModel;
		}

	};
});