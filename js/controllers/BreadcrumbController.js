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
						plantId = route.attr('plantId');

					if (plantId) {
						list.push(can.route.link('Plante ' + plantId, {plantId : plantId}));
					}
					if (day) {
						list.push(can.route.link('Dag ' + day, {plantId : plantId, day : day}));
					}
					return list;
				});
			this.element.append(can.view(view, {  breadcrumbs : breadcrumbs }));
		}
	});
}());