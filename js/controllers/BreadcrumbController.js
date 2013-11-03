/* globals: jQuery can app */
(function () {

	// constructor function for the PlantChooser controller
	app.Breadcrumb = can.Control({}, {
		init : function () {
			var view = this.options.view,
				route = can.route,
				breadcrumbs = can.compute(function () {
					var list = [],
						day = route.attr('day'),
						plantId = route.attr('plantId'),
						level = 1;


					if (plantId) { level++; }
					if (day) { level++; }

					if(level === 1) {
						list.push("Plantevalg");
					}
					else if(level === 2) {
						list.push(can.route.link('Plantevalg', {}));
						list.push('Plante ' + plantId);
					}
					else if(level === 3) {
						list.push(can.route.link('Plantevalg', {}));
						list.push(can.route.link('Plante ' + plantId, {plantId : plantId}));
						list.push('Dag ' + day);
					}
					return list;
				});
			this.element.append(can.view(view, {  breadcrumbs : breadcrumbs }));
		}
	});
}());