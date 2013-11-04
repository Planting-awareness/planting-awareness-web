/* globals: jQuery can app */
(function () {

	function getCurrentDate (dateOfFirstReading, currentDay) {
		return new Date(dateOfFirstReading.getTime() + 1000 * 3600 * 24 * (currentDay - 1));
	}

	function renderVideo (element, url) {

	}

	function createGraph($chartElem, sensorReadings) {

		var mydata = [];
		var startHour, endHour;

		// need to offset the time, since it shows in UTC
		var timeZoneOffset;
		for (var i = 0; i < sensorReadings.length; i++) {
			var reading = sensorReadings[i];

//			if (reading.created_at.match(/2013-09-22/)) {
				var date = new Date(reading.created_at);
				if(startHour === undefined) {
					startHour = date;
					timeZoneOffset = - 1000*60*date.getTimezoneOffset();
				}
				mydata.push([date.getTime() + timeZoneOffset, reading.light]);
				endHour = date;
//			}
		}

		var hours = Math.ceil((endHour.getTime() - startHour.getTime())/(1000*3600)),
			pointsPerHour = 2,
			pointsNeeded = pointsPerHour * hours,
			distanceBetweenPoints = Math.floor(mydata.length/pointsNeeded);

		function average(xySeries) {
			var x = 0, y =0, len = xySeries.length, i = len;
			while(i--) {
				x+= xySeries[i][0];
				y+= xySeries[i][1];
			}
			return [x/len,Math.round(y/len)];
		}

		var filteredData = [];

		for(var i = 0, len = mydata.length; i<len; ) {
			filteredData.push(average(mydata.slice(i,i+distanceBetweenPoints)));
			i+=distanceBetweenPoints;
		}



//		if(false)
		var titleText = 'Lysmålinger av planten';
		var yAxisTitleText = 'lux';
		var yAxisMinimum = 0;
		$('#chart').highcharts({
			chart    : {
				type : 'spline'
			},
			title    : {
				text : titleText
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
					text : yAxisTitleText
				},
				min   : yAxisMinimum
			},
			tooltip  : {
//				formatter : function () {
//					return '<b>' + this.series.name + '</b><br/>' +
//							Highcharts.dateFormat('%e. %b', this.x) + ': ' + this.y + ' m';
//				}
			},

			series : [
				{
					name : "Lys i antall lux",
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
				infoMsg = can.compute('Henter video ...'),
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
							elem.find('.info-graph').addClass('hide');
							createGraph(elem.find('#chart'), readings);
						});

					app.Video.findForDate({plantId : plantId, date : dateAsString})
						.then(function (video) {
							if (!video) {
								infoMsg('Ingen video funnet');
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
			this.element.html(can.view(view, {infoMsg : infoMsg, infoMsgGraph :  infoMsgGraph }));
		}
	});
}());