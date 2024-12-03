sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("alfa.com.co.zui5_gestioncotizaciones.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getDialog: function (sName, bDestroy) {
			if (this._oDialog && bDestroy) {
				this._oDialog.destroy();
				this._oDialog = null;
			}
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(sName, this);
				this.getView().addDependent(this._oDialog);
			}

			return this._oDialog;
		},

		getCreateDialog: function (sName, bDestroy) {
			if (this._oCreateDialog && bDestroy) {
				this._oCreateDialog.destroy();
				this._oCreateDialog = null;
			}
			if (!this._oCreateDialog) {
				this._oCreateDialog = sap.ui.xmlfragment(sName, this);
				this.getView().addDependent(this._oCreateDialog);
			}

			return this._oCreateDialog;
		},

		onClose: function () {
			this._oDialog.close();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getODataManager: function () {
			return this.getOwnerComponent().oDataManagerDAO;
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getMessageBox: function () {
			return MessageBox;
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});

});