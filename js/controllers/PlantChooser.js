/* globals: jQuery can app */
(function () {

	// constructor function for the PlantChooser controller
	app.PlantChooser = can.Control({
		/* here you can put static data, like default options */
	}, {
		init : function () {

			/* the passed in arguments to a newly created element
			are available as this.element and this.options */

			var plants = new can.List([]),
				imageUrls = new can.Map(),
				view = this.options.view;

			// initiate server call and add plants to the list as they are available
			app.Plant.findAll({}).done(function (plantsFromServer) {

				/* Push the plants on the observable list
				//
				// On the use of 'apply': using apply we can construct the list of arguments to a function
				//                        Google "mdn apply" to know more about how this works */
				can.List.prototype.push.apply(plants, plantsFromServer);

				plants.each(function (plant) {
					var id = plant.attr('id');
					app.SensorReading.findFirstAndLast({ id : id})
						.done(function (res) {
							imageUrls.attr(id, res.last.attr('img_url'));
						});
				});
			});


			// render the plant chooser view
			this.element.html(can.view(view, { plants : plants, imgs : imageUrls }));
		}
	});
}());