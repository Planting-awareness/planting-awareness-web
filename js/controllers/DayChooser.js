/* globals: jQuery can */
(function (namespace) {

	// constructor function for the PlantChooser controller
	var Picker = can.Control({
		/* here you can put static data, like default options */
	}, {
		init : function () {

			// render the plant chooser view
			this.element.append(can.view(view, { plants : plants }));
		}
	});

	namespace.DatePicker = Picker ;
}(window));