sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","./model/models","./model/DataManagerDAO"],function(e,t,i,o){"use strict";return e.extend("alfa.com.co.zui5_gestioncotizaciones.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.getUserLog(),"user");this.setModel(i.createDeviceModel(),"device");this.setModel(i.createDetailModel(),"detail");this.setModel(i.createActivityModel(),"activity");this.setModel(i.createDateModel(),"date");this.setModel(i.createUser2Model(),"user2");this.setModel(i.createListModel(),"list");this.oDataManagerDAO=new o(this)}})});