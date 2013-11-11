/* globals: jQuery can app */
(function () {

	function getCurrentDate (dateOfFirstReading, currentDay) {
		return new Date(dateOfFirstReading.getTime() + 1000 * 3600 * 24 * (currentDay - 1));
	}

	function createGraphData (sensorReadings, type) {
		return utils.smoothGraphData(sensorReadings, type);
	}

	/**
	 *
	 * @param $chartElem
	 * @param sensorReadings
	 * @param type {String} either 'light' or 'soilmoisture'
	 */
	function createGraph ($chartElem, sensorReadings, type) {

		var chartData;
		var filteredData;
		if (type === 'light') {
			chartData = {
				titleText : 'Lysmålinger av planten',
				yAxisTitleText : 'lux',
				yAxisMinimum : 0,
				yAxisMaximum : 9000,
				seriesName : 'Lysmålingen er gjort i antall Lux'
			};
			filteredData = createGraphData(sensorReadings, 'light');
		} else {
			chartData = {
				titleText : 'Jordfuktighetsmåling av planten',
				yAxisTitleText : 'amo',
				yAxisMinimum : 0,
				yAxisMaximum : 1023,
				seriesName : 'Fuktmålinger gjøres å lede strøm'
			};
			filteredData = createGraphData(sensorReadings, 'soilMoisture');
		}

		$chartElem.highcharts({
			chart    : {
				type : 'spline'
			},
			title    : {
				text : chartData.titleText
			},
			subtitle : {
//				text : 'Irregular time data in Highcharts JS'
			},
			xAxis    : {
				type                 : 'datetime',
				dateTimeLabelFormats : { // don't display the dummy year
//					month : '%e. %b',
//					year  : '%b'
				}
			},
			yAxis    : {
				title : {
					text : chartData.yAxisTitleText
				},
				min   : chartData.yAxisMinimum,
				max   : chartData.yAxisMaximum
			},
			tooltip  : {
//				formatter : function () {
//					return '<b>' + this.series.name + '</b><br/>' +
//							Highcharts.dateFormat('%e. %b', this.x) + ': ' + this.y + ' m';
//				}
			},

			series : [
				{
					name : chartData.seriesName,
					// Define the data points. All series have a dummy year
					// of 1970/71 in order to be compared on the same x axis. Note
					// that in JavaScript, months start at 0 for January, 1 for February etc.
					data : filteredData
				}
			]
		});
	}

	app.ReadingsView = can.Control({
		/* here you can put static data, like default options */
	}, {
		init : function () {
			var view = this.options.view,
				plantId = this.options.plantId,
				elem = this.element,
				day = this.options.day,
				sensorType = this.options.sensor,
				infoMsgVideo = can.compute('Henter video ...'),
				infoMsgGraph = can.compute('Henter grafdata ... ');

			// get first day of readings
			app.SensorReading.findFirstAndLast({ id : plantId})
				.then(function (result) {
					var dateOfFirstReading = result.first.created(),
						currentDate = getCurrentDate(dateOfFirstReading, day),
						dateAsString = currentDate.toISOString().substr(0, 10);

					app.SensorReading.findAllOnDate({id : plantId, date : dateAsString})
						.then(function (readings) {
							// do something with readings
							var $chartElem = elem.find('#chart');

							if (readings.length === 0) {
								$chartElem.hide();
								infoMsgGraph('Fant ikke noe data for denne dagen!');
								return;
							}
							elem.find('.info-graph').addClass('hide');

							// for Eva: test changes like this:
							// var dataForOneDay = [];
							// for(var i= 0, len = SENSORDATA.length; i< len; i++ ) {
							// if(SENSORDATA[i].created_at.match(/2013-09-21/)) {
							// dataForOneDay.push(new app.SensorReading(SENSORDATA[i]));
							// }
							// }
							// createGraph(elem.find('#chart'), dataForOneDay);

//							var dataForOneDay = [];
//							for (var i = 0, len = oct25.length; i < len; i++) {
//								dataForOneDay.push(new app.SensorReading(oct25[i]));
//							}
//							createGraph(elem.find('#chart'), dataForOneDay);
							createGraph($chartElem, readings, sensorType);

						});

					app.Video.findForDate({plantId : plantId, date : dateAsString})
						.then(function (video) {
							if (!video) {
								infoMsgVideo('Ingen video funnet');
							} else {
								elem.find('.info-video').addClass('hide');
								var $videoElem = $('video');
								var videoUrl = video.attr('mp4') || video.attr('videourl');
								$videoElem.attr('src', videoUrl);
								$videoElem.removeClass("hide");
							}
						});
				});

			// render the plant chooser view
			this.element.html(can.view(view, {plantId : plantId, day : day, infoMsg : infoMsgVideo, infoMsgGraph : infoMsgGraph }));
		}
	});
}());