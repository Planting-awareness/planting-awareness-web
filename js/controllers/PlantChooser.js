/* globals: jQuery can */
(function (namespace) {

	// constructor function for the PlantChooser controller
	var Chooser = can.Control({
		/* here you can put static data, like default options */
	}, {
		init : function () {

			/* the passed in arguments to a newly created element
			are available as this.element and this.options */

			var plants = this.options.plants,
				view = this.options.view;


			// render the plant chooser view
			this.element.append(can.view(view, { plants : plants }));
		},

		"{can.route} plant_id" : function (route, event, newVal, oldVal) {
			console.log(arguments);
		}
	});

	namespace.PlantChooser = Chooser;
}(window));