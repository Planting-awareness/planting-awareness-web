/* global: can app */
(function () {
	'use strict';

	function replaceTokens (url, tokens) {
		return utils.replaceTokens(url, tokens);
	}

	// the headers contain the hostnames of monoplant.me - not our server. remove that part
	function stripHostName (url) {
		return utils.stripHostName(url);
	}

	function firstReading (data) {
		return utils.firstReading(data);
	}

	function lastReading (data) {
		return utils.lastReading(data);
	}

	function getLinkHeader (jqXHR) {
		return utils.getLinkHeader(jqXHR);
	}

	app.SensorReading = can.Model.extend({
		/**
		 * Meant to be used to just get the first data object
		 * @returns an array of data from the given date
		 */
		findOne : 'GET /plants/{id}/sensorvalues.json?from={from}&page=1&limit=1',

		/**
		 * Retrieve all sensor data from a given date
		 * The resolved list will be empty if no data could be found for that date
		 *
		 * @param params.id {String}
		 * @param params.date {String} an iso date
		 *
		 * @returns {Deferred} with [String]
		 */
		findAllOnDate : function (params) {
			var dfd = $.Deferred(),
				resultList = app.SensorReading.List(),
				url = '/plants/{id}/sensorvalues.json?from={date}&to={date}&limit=1500'; //1500 readings max per day


			function appendToList (rawReadings) {
				console.log('appending')
				rawReadings.forEach(function (reading) {
					resultList.push(new app.SensorReading(reading));
				});
			}

			$.ajax(replaceTokens(url, params))
				.then(appendToList).then(function(){
					dfd.resolve(resultList);
				});

			return dfd.promise();
		},

		/**
		 * Get the first and last sensor reading - given the params
		 * @param params.id {String|Number} the plant id
		 */
		findFirstAndLast : function (params) {
			if (!this.cache) { this.cache = {}; }

			var dfd = $.Deferred(),
				cache = this.cache,
				url = '/plants/{id}/sensorvalues.json?page=1&limit=1';


			if (cache[params.id]) {
				dfd.resolve(cache[params.id]);
				return dfd;
			}

			$.ajax(replaceTokens(url, params))
				.done(function (data, textStatus, jqXHR) {
					var responseHeader , h, lastUrl, first;

					function buildResultAndResolve (resultsFromLastPage) {
						var result = {first : first, last : lastReading(resultsFromLastPage) };
						cache[params.id] = result;
						dfd.resolve(result);
					}

					first = firstReading(data);

					responseHeader = getLinkHeader(jqXHR);

					// if none found, means all results are contained on the current page
					if (!responseHeader) {
						buildResultAndResolve(data);
					} else {
						h = new app.LinkHeaderParser(responseHeader);
						lastUrl = stripHostName(h.getUrlOfLastResultPage());

						// go the the last result on the server and fetch that page
						$.ajax(lastUrl).done(buildResultAndResolve);
					}
				});

			return dfd.promise();
		}
	}, {
		/* utility functions */
		created : function () {
			return new Date(this.attr('created_at'));
		}
	});
}());
