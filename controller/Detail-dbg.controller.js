sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"./BaseController",
		'sap/ui/model/json/JSONModel',
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, BaseController, JSONModel, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("alfa.com.co.zui5_gestioncotizaciones.controller.Detail", {

			/**
			 * @override
			 */
			onInit: function () {

				this.getRouter().getRoute("Detail").attachPatternMatched(this._onRoutedMatched, this);

			},

			_onRoutedMatched: function () {
				var sKey = this.getModel().createKey("/CotizacionSet", {
					Vbeln: this.getModel("detail").getProperty("/Vbeln")
				});

				this.getView().setBusy(true);
				var pCotizacion = this.getODataManager().getDataPromise("", sKey, []),
					oFilter = new Filter("Cotizacion", FilterOperator.EQ, this.getModel("detail").getProperty("/Vbeln")),
					pActividades = this.getODataManager().getDataPromise("", "/ActividadesSet", [oFilter]);

				Promise.all([pCotizacion, pActividades]).then(result => {
					this.getModel("detail").setProperty("/", result[0]);
					var aActivities = result[1].results.sort((a, b) => (a.Id > b.Id) ? 1 : ((b.Id > a.Id) ? -1 : 0));
					this.getModel("detail").setProperty("/Activities", aActivities);
					this.getView().setBusy(false);
				}).catch(reason => {
					this.getView().setBusy(false);
					console.log(reason);
				});;

			},

			onAddActivity: function () {
				var oActivity = {
					Id: "0",
					Cotizacion: this.getModel("detail").getProperty("/Vbeln"),
					Fecha: new Date(),
					Hora: new Date(),
					Ultima: "X",
					Modificado: this.getModel("user").getProperty("/name"),
					Ultimaact: new Date(),
					Fechaact: new Date(),
					Horaact: new Date()
				};
				this.getModel("activity").setProperty("/", oActivity);
				this.getCreateDialog("alfa.com.co.zui5_gestioncotizaciones.view.fragment.createActivity", true).open();
			},

			onEdit: function (oEvt) {
				var oActivity = this.getModel("detail").getProperty(oEvt.getSource().getBindingContextPath());
				if (oActivity.Estado !== "Cerrada") {
					this.getModel("activity").setProperty("/", oActivity);
					this.getCreateDialog("alfa.com.co.zui5_gestioncotizaciones.view.fragment.editActivity", true).open();
				} else {
					this.getMessageBox().error("La actividad ya esta cerrada y no es posible editarla");
				}
			},

			onEditDate: function (oEvt) {
				var oDetail = this.getModel("detail").getProperty("/");
				this.getModel("date").setProperty("/", {
					Vbeln: oDetail.Vbeln,
					Fechaestimada: oDetail.Fechaestimada,
					Probabilidad: oDetail.Probabilidad2
				});
				this.getCreateDialog("alfa.com.co.zui5_gestioncotizaciones.view.fragment.editDate", true).open();
			},

			onSaveDate: function (oEvt) {
				var oDate = this.getModel("date").getProperty("/"),
					oUtcDate = new Date();

				oUtcDate.setUTCMonth(oDate.Fechaestimada.getUTCMonth());
				oUtcDate.setUTCDate(oDate.Fechaestimada.getUTCDate());
				oDate.Fechaestimada = oUtcDate;
				// oDate.Probabilidad = oDate.Probabilidad.toString();
				this.getView().setBusy(true);
				//Buscar Registro, sino actualizar
				this.getODataManager().getDataPromise("", "/CotizacionUpdSet('" + this.getModel("detail").getProperty("/Vbeln") + "')", []).then(
					result => {
						this.saveDate("update", oDate);
					}).catch(reason => {
					this.saveDate("create", oDate);
				});

			},

			saveDate: function (sAction, oDate) {
				oDate.Probabilidad = oDate.Probabilidad.toString();
				this.getODataManager().saveData("", oDate, {
					success: function (oData) {
						this.getCreateDialog("alfa.com.co.zui5_gestioncotizaciones.view.fragment.editDate", false).close();
						this.getMessageBox().show("Guardado correctamente");
						var sKey = this.getModel().createKey("/CotizacionSet", {
							Vbeln: this.getModel("detail").getProperty("/Vbeln")
						});
						var aActivities = this.getModel("detail").getProperty("/Activities");
						this.getODataManager().getDataPromise("", sKey, []).then(result => {
							this.getModel("detail").setProperty("/", result);
							this.getModel("detail").setProperty("/Activities", aActivities);
							this.getView().setBusy(false);
							this.getModel().refresh(true);
							//this.getModel().setProperty("/CotizSet('" + result.Vbeln + "')/Bnddt", oDate.Fechaestimada);
						});
					}.bind(this),
					error: function (oError) {
						this.getView().setBusy(false);
						this.getMessageBox().error("Ha ocurrido un error al cargar la información:" + oError.responseText);
					}.bind(this)
				}, {
					action: sAction,
					sEntity: "/CotizacionUpdSet",
					sNameId: "Vbeln"
				}, this);

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

				if (!oActivity.Tipoactividad) {
					this.getMessageBox().error("El tipo de actividad no puede estar vacio");
					return;
				}
				this.getView().setBusy(true);
				if (oActivity.Id === "0") {
					oActivity.Hora = format1.format(oActivity.Hora);
					oActivity.Horaact = format1.format(oActivity.Horaact);
				} else {
					delete oActivity.__metadata;
				}
				this.getODataManager().saveData("", oActivity, {
					success: function (oData) {
						this.getCreateDialog("", false).close();
						this.getMessageBox().show("Guardado correctamente");
						var oFilter = new Filter("Cotizacion", FilterOperator.EQ, this.getModel("detail").getProperty("/Vbeln"));
						this.getODataManager().getDataPromise("", "/ActividadesSet", [oFilter]).then(result => {
							this.getModel("detail").setProperty("/Activities", result.results);
							this.getView().setBusy(false);
						});
					}.bind(this),
					error: function (oError) {
						this.getView().setBusy(false);
						this.getMessageBox().error("Ha ocurrido un error al cargar la información:" + oError.responseText);
					}.bind(this)
				}, {
					action: oActivity.Id === "0" ? "create" : "update",
					sEntity: "/ActividadSet",
					sNameId: "Id"
				}, this);
			},

			onClose: function (oEvt) {
				this.getCreateDialog("", false).close();
			}
		});
	});