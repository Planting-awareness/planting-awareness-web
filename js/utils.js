var utils = {
	stripHostName : function (url) {
		if (!url || !url.match(/^http:/)) { return url; }

		return url.replace(/http:\/\/monoplant.me/, "");
	},

	firstReading : function (data) {
		return new app.SensorReading(data[0]);
	},

	lastReading : function (data) {
		return new app.SensorReading(data[data.length - 1]);
	},

	getLinkHeader : function (jqXHR) {
		var responseHeader = jqXHR.getResponseHeader("Link");
		return responseHeader;
	},

	isoDate : function (d) {
		return d.toISOString().substring(0, 10);
	},

	replaceTokens : function (url, tokens) {
		var s = url;
		for (var token in tokens) {
			if (tokens.hasOwnProperty(token)) {
				s = s.replace(new RegExp('{' + token + '}', 'g'), tokens[token]);
			}
		}
		return s;
	},

	/**
	 * Smooth an array of graph
	 *
	 * @param sensorReadings {Array}
	 * @param type {String} either 'light' or 'soilmoisture'
	 *
	 * @returns [{Number},{Number}] an array where each object is composed
	 *          of milliseconds since the Epoch + offset and an averaged reading
	 */
	smoothGraphData : function (sensorReadings, sensorType) {
		var mydata = [];
		var startHour, endHour;

		function average (xySeries) {
			var x = 0, y = 0, len = xySeries.length, i = len;
			while (i--) {
				x += xySeries[i][0];
				y += xySeries[i][1];
			}

			return [xySeries[0][0] , Math.round(y / len)];
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
			mydata.push([date.getTime() + timeZoneOffset, reading[sensorType] ]);
			endHour = date;
		}

		var filteredData = [];

		var i = 0,
			currentMs,
			len = mydata.length,
			periodInMs = 30 * 60 * 1000,
			startOfInterval = 0,
			endOfIntervalMs = 0;

		while (startOfInterval < len) {
			endOfIntervalMs = parseInt(mydata[startOfInterval]) + periodInMs;
			currentMs = mydata[i][0];

			while (currentMs < endOfIntervalMs && i < mydata.length) {

				currentMs = mydata[i][0];
				i++;
			}

			filteredData.push(average(mydata.slice(startOfInterval, i)));
			startOfInterval = i;
		}

		return filteredData;
	}
};
