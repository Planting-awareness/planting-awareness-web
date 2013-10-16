/* globals: jQuery can */
(function (namespace) {

	// constructor function for the PlantChooser controller
	var Breadcrumb = can.Control({
		defaults : {
			view : 'views/breadcrumb.ejs'
		}
	}, {
		init : function () {
			var view = this.options.view;
			this.element.append(can.view(view, { route : can.route }));
		}
	});

	namespace.Breadcrumb = Breadcrumb;
}(window));