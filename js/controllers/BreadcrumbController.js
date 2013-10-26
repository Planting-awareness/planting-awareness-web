/* globals: jQuery can app */
(function () {

	// constructor function for the PlantChooser controller
	app.Breadcrumb = can.Control({}, {
		init : function () {
			var view = this.options.view,
				route = can.route,
				breadcrumbs = can.compute(function () {
					var list = [];
					if (route.attr('plantId')) {
						list.push(['Plante ', route.attr('plantId')]);
					}
					if (route.attr('day')) {
						list.push(['Dag' , route.attr('day')]);
					}
					return list;
				});
			this.element.append(can.view(view, {  breadcrumbs : breadcrumbs }));
		}
	});
}());