sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {
		/**
		 * Crea un modelo JSON genérico si no recibe parametros crea un modelo vacío.
		 * @param {Object|undefined} data - Los datos iniciales para el modelo.
		 * @returns {sap.ui.model.json.JSONModel} Modelo JSON creado.
		 */
		createModel: function(data = {}) {
			const oModel = new JSONModel(data);
			return oModel;
		},

		/**
		 * Crea un modelo de dispositivo basado en sap.ui.Device.
		 * @param {string|undefined} bindingMode - El modo de binding para el modelo (por defecto es TwoWay).
		 * @returns {sap.ui.model.json.JSONModel} Modelo de dispositivo.
		 */
		createDeviceModel: function(bindingMode = "OneWay") {
			const oModel = this.createModel(Device);
			oModel.setDefaultBindingMode(bindingMode);
			return oModel;
		},

		/**
		 * Obtiene información del usuario actual mediante una llamada a la API.
		 * @returns {sap.ui.model.json.JSONModel} Modelo con datos del usuario.
		 */
		getUserLog: function() {
			const oModel = this.createModel();
			oModel.loadData("/services/userapi/currentUser");
			oModel.attachRequestCompleted((oEvent) => {
				if (oEvent.getParameter("success")) {
					oModel.setData({
						"json": oModel.getJSON(),
						"status": "Success"
					}, true);
					console.log("user-services", oModel.getJSON());
				} else {
					const msg = oEvent.getParameter("errorObject").textStatus;
					if (msg) oModel.setData({
						"status": msg
					});
					else oModel.setData({
						"status": "Unknown error retrieving user info"
					});
				}
			});
			return oModel;
		},

	};
});