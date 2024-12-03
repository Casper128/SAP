console.log("HELLO WORLD");

sap.ui.define([], function () {
	return {
		calculateDateDifference: function (sErdat, sBnddt) {
			const oStaticValues = {
				P: {
					class: "status-pending",
					text: "Pendiente 🟡"
				},
				C: {
					class: "status-completed",
					text: "Completado 🟢"
				},
				R: {
					class: "status-rejected",
					text: "Rechazado 🔴"
				}
			};

			console.log("Fechas: ", sErdat, sBnddt);
		}
	};
});
