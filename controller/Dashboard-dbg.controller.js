sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"./BaseController",
		'sap/ui/model/odata/v2/ODataModel',
		'sap/ui/core/util/MockServer',
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, BaseController, ODataModel, MockServer, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("alfa.com.co.zui5_gestioncotizaciones.controller.Dashboard", {
			onInit: function () {
				this.getODataManager().getDataPromise("", "/UsuarioSet", []).then(result => {
					var sUser = result.results[0].User;
					this.getModel("user2").setProperty("/userGw", sUser);
				});
				setTimeout(() => {
					console.log(this.getModel("user2").getProperty("/userGw"));
				}, 5000);

				//Create JSON data that contains the Inital value of the filter
				var oSmartFilterBar = this.getView().byId("smartFilterBar");
				var field = oSmartFilterBar.getControlByKey("Erdat");
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "YYYY-MM-dd"
				});
				var dFromDate = new Date();
				dFromDate.setMonth(dFromDate.getMonth() - 2);
				var datetoDay = dateFormat.format(dFromDate);

				// Create a new token
				var token = new sap.m.Token({
					key: "Erdat", // any unique value
					text: ">=" + datetoDay, //Concatenate >= sign to date
					tooltip: ">=" + datetoDay
				});

				// JSON to declare the values we want in actual filter
				// var valueComp = {
				// 	"exclude": false,
				// 	"keyField": "Erdat",
				// 	"operation": "GE",
				// 	"tokenText": ">=" + datetoDay, //Concatenate >= sign to date
				// 	"value1": datetoDay, // Actual date value
				// 	"value2": undefined
				// }

				// // add the above defined values to CustomData
				// var customData = new sap.ui.core.CustomData("data", {
				// 	key: "custdata", // any unique value
				// 	value: valueComp
				// }); // JSON declared above
				// token.addCustomData(customData); // Add custom data to token
				// field.addToken(token); // add token to the filter field.

			},
			onBeforeRebindTable: function (oEvt) {
				/*var sUser = this.getModel("user2").getProperty("/userGw"),
					dFromDate = new Date();

				dFromDate.setMonth(dFromDate.getMonth() - 2);

				if (oEvt.getParameters().bindingParams.filters.length > 0) {
					var aFilters = oEvt.getParameters().bindingParams.filters[0].aFilters,
						oErdat = aFilters.find(element => element.sPath === 'Erdat');

					if (!oErdat)
						oEvt.getParameters().bindingParams.filters.push(new sap.ui.model.Filter("Erdat", FilterOperator.GT, dFromDate));
				} else {
					oEvt.getParameters().bindingParams.filters.push(new sap.ui.model.Filter("Erdat", FilterOperator.GT, dFromDate));
				}

				sUser = sUser === "CONSGIDL" ? "KELLLOPE" : sUser;
				oEvt.getParameters().bindingParams.filters.push(new sap.ui.model.Filter("Ernam", FilterOperator.EQ, sUser));*/
				//oEvt.getParameter("bindingParams").parameters.operationMode = sap.ui.model.odata.OperationMode.Client;
			},

			onBeforeExport: function (oEvt) {
				var mExcelSettings = oEvt.getParameter("exportSettings");

				// Disable Worker as Mockserver is used in Demokit sample
				mExcelSettings.worker = false;
			},

			onColumns: function () {
				var oSmartTable = this._getSmartTable();
				if (oSmartTable) {
					oSmartTable.openPersonalisationDialog("Columns");
				}
			},

			_getSmartTable: function () {
				if (!this._oSmartTable) {
					this._oSmartTable = this.getView().byId("CotizacionesSmartTable");
				}
				return this._oSmartTable;
			},

			onDetail: function (oEvt) {
				var oCoti = oEvt.getSource().getBindingContext().getObject();
				this.getModel("detail").setProperty("/Vbeln", oCoti.Vbeln);
				this.getRouter().navTo("Detail");
			},

			onActivities: function (oEvt) {
				var sCotizacion = oEvt.getSource().getCustomData()[0].getValue("Vbeln"),
					oFilter = new Filter("Cotizacion", FilterOperator.EQ, sCotizacion);
				this.getView().setBusy(true);
				this.getODataManager().getDataPromise("", "/ActividadesSet", [oFilter]).then(result => {
					this.getModel("detail").setProperty("/Activities", result.results);
					this.getView().setBusy(false);
					this.getDialog("alfa.com.co.zui5_gestioncotizaciones.view.fragment.showActivities", false).open();
				});
			},

			onAddActivity: function (oEvt) {
				var sCotizacion = oEvt.getSource().getCustomData()[0].getValue("Vbeln"),
					oActivity = {
						Id: "0",
						Cotizacion: sCotizacion,
						Fecha: new Date(),
						Hora: new Date(),
						Ultima: "X",
						Modificado: this.getModel("user").getProperty("/name"),
						Ultimaact: new Date(),
						Fechaact: new Date(),
						Horaact: new Date(),
						Estado: "Activa",
					};
				this.getModel("activity").setProperty("/", oActivity);
				this.getCreateDialog("alfa.com.co.zui5_gestioncotizaciones.view.fragment.createActivity", false).open();
			},

			onSave: function (oEvt) {
				var oActivity = this.getModel("activity").getProperty("/"),
					format1 = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "PThh'H'mm'M'ss'S'"
					}),
					oCotiz = this.getModel().getProperty("/CotizSet('" + oActivity.Cotizacion + "')");

				if (oActivity.Fecha < oCotiz.Erdat) {
					this.getMessageBox().error("La fecha de la actividad es menor a la creación de la cotización");
					return;
				}

				this.getView().setBusy(true);

				if (oActivity.Id === "0") {
					oActivity.Hora = format1.format(oActivity.Hora);
					oActivity.Horaact = format1.format(oActivity.Horaact);
				}
				this.getODataManager().saveData("", oActivity, {
					success: function (oData) {
						this.getCreateDialog("", false).close();
						this.getModel().refresh(true);
						this.getMessageBox().show("Guardado correctamente");
						this.getView().setBusy(false);
					}.bind(this),
					error: function (oError) {
						this.getView().setBusy(false);
						this.getMessageBox().error("Ha ocurrido un error al cargar la información:" + oError.responseText);
					}.bind(this)
				}, {
					action: "create",
					sEntity: "/ActividadSet"
				}, this);
			},

			onCloseDialog: function (oEvt) {
				this.getDialog("", false).close();
			},

			onClose: function (oEvt) {
				this.getCreateDialog("", false).close();
			},

			onSearch: function (oEvt) {

			}

		});
	});