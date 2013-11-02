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

				plantsFromServer.forEach(function(plant){
					// we are only interested in plants 3 and 4
//					if(plant.id === 3 || plant.id === 4) {
						plants.push(plant);
//					}
				});

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