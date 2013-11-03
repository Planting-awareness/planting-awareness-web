/* globals: jQuery can app */
(function () {

	function getCurrentDate (dateOfFirstReading, currentDay) {
		return new Date(dateOfFirstReading.getTime() + 1000 * 3600 * 24 * (currentDay - 1));
	}

	function renderVideo (element, url) {

	}

	app.ReadingsView = can.Control({
		/* here you can put static data, like default options */
	}, {
		init : function () {
			var view = this.options.view,
				plantId = this.options.plantId,
				elem = this.element,
				day = this.options.day,
				infoMsg = can.compute('Henter video ...');

			// get first day of readings
			app.SensorReading.findFirstAndLast({ id : plantId})
				.then(function (result) {
					var dateOfFirstReading = result.first.created(),
						currentDate = getCurrentDate(dateOfFirstReading, day),
						dateAsString = currentDate.toISOString().substr(0, 10);

					app.SensorReading.findAllOnDate({id : plantId, date : dateAsString})
						.then(function (readings) {
							// do something with readings
						});

					app.Video.findForDate({plantId : plantId, date : dateAsString})
						.then(function (video) {
							if (!video) {
								infoMsg('Ingen video funnet');
							} else {
								elem.find('.text-info').addClass('hide');
								var $videoElem = $('video');
								$videoElem.attr('src', video.attr('mp4'));
								$videoElem.removeClass("hide");
							}
						});
				});

			// render the plant chooser view
			this.element.html(can.view(view, {infoMsg : infoMsg }));
		}
	});
}());