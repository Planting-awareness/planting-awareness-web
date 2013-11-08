/* globals: jQuery can app */
(function () {

	function getCurrentDate (dateOfFirstReading, currentDay) {
		return new Date(dateOfFirstReading.getTime() + 1000 * 3600 * 24 * (currentDay - 1));
	}

	function renderVideo (element, url) {

	}

	function createGraphData (sensorReadings) {
		var mydata = [];
		var startHour, endHour;

		function average (xySeries) {
			var x = 0, y = 0, len = xySeries.length, i = len;
			while (i--) {
				x += xySeries[i][0];
				y += xySeries[i][1];
			}
			return [x / len, Math.round(y / len)];
		}

		// need to offset the time, since it shows in UTC
		var timeZoneOffset;
		for (var i = 0; i < sensorReadings.length; i++) {
			var reading = sensorReadings[i];

			var date = new Date(reading.created_at);
			if (startHour === undefined) {
				startHour = date;
				timeZoneOffset = -1000 * 60 * date.getTimezoneOffset();
			}
			mydata.push([date.getTime() + timeZoneOffset, reading.light]);
			endHour = date;
		}

		var hours = Math.ceil((endHour.getTime() - startHour.getTime()) / (1000 * 3600)),
			pointsPerHour = 2,
			pointsNeeded = pointsPerHour * hours,
			distanceBetweenPoints = Math.floor(mydata.length / pointsNeeded);


		var filteredData = [];
		 
		var i =0, 
			currentMs,
			len = mydata.length,
			periodInMs = 30*60*1000,
			startOfInterval = 0,
			startOfIntervalMs = 0,
			endOfIntervalMs = 0 ;
		
		 while (startOfInterval < len) {
			endOfIntervalMs = parseInt(mydata[startOfInterval]) + periodInMs;			
			currentMs = mydata[i][0];
			
			while (currentMs < endOfIntervalMs && i < mydata.length ) {
				
				currentMs = mydata[i][0];
				i++;
			}
						
			filteredData.push(average(mydata.slice(startOfInterval, i)));
			startOfInterval = i;
		}
		
		return filteredData;
	}

	function createGraph ($chartElem, sensorReadings) {

		var filteredData = createGraphData(sensorReadings);
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

							// for Eva: test changes like this:
							var dataForOneDay = [];
							// for(var i= 0, len = SENSORDATA.length; i< len; i++ ) {
								// if(SENSORDATA[i].created_at.match(/2013-09-21/)) {
									// dataForOneDay.push(new app.SensorReading(SENSORDATA[i]));
								// }
							// }
							// createGraph(elem.find('#chart'), dataForOneDay);

							var dataForOneDay = [];
							for(var i= 0, len = oct25.length; i< len; i++ ) {
									dataForOneDay.push(new app.SensorReading(oct25[i]));
							}
							createGraph(elem.find('#chart'), dataForOneDay);
							// createGraph(elem.find('#chart'), readings);

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
			this.element.html(can.view(view, {plantId : plantId, day: day, infoMsg : infoMsg, infoMsgGraph : infoMsgGraph }));
		}
	});
}());