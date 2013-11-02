/* global: can app */
(function () {
	'use strict';
//	var url = '/plants/{id}/sensorvalues.json?from={from}&to={to}&page={page}';
//	var url = '/plants/1/sensorvalues.json?&to=2013-10-26&from=2013-10-24&page=10';

	function isoDate (d) {
		return d.toISOString().substring(0, 10);
	}

	function replaceTokens (url, tokens) {
		var s = url;
		for (var token in tokens) {
			if (tokens.hasOwnProperty(token)) {
				s = s.replace(new RegExp('{' + token + '}', 'g'), tokens[token]);
			}
		}
		return s;
	}

	// the headers contain the hostnames of monoplant.me - not our server. remove that part
	function stripHostName (url) {
		if (!url || !url.match(/^http:/)) { return url; }

		return url.replace(/http:\/\/monoplant.me/, "");
	}

	function firstReading (data) {
		return new app.SensorReading(data[0]);
	}

	function lastReading (data) {
		return new app.SensorReading(data[data.length - 1]);
	}

	function getLinkHeader (jqXHR) {
		var responseHeader = jqXHR.getResponseHeader("Link");
		if (!responseHeader) {
			throw new Error("Server did not return Link header.");
		}
		return responseHeader;
	}

	app.SensorReading = can.Model.extend({
		/**
		 * Meant to be used to just get the first data object
		 * @returns an array of data from the given date
		 */
		findOne : 'GET /plants/{id}/sensorvalues.json?from={from}&page=1',

		/**
		 * Retrieve all sensor data from a given date
		 * Will resolve the deferred almost immediately, but will continue to fill the resolved observable list with data
		 * The resolved list will be empty if no data could be found for that date
		 *
		 * @param params.id {String}
		 * @param params.date {String} an iso date
		 *
		 * @returns {Deferred}
		 */
		findAllOnDate : function (params) {
			var dfd = $.Deferred(),
				resultList = app.SensorReading.List(),
				url = '/plants/{id}/sensorvalues.json?from={date}&to={date}&page={page}',
				oneDayInMillis = 1000 * 3600 * 24,
				nextDayMillis = new Date(params.from).getTime() + oneDayInMillis;

			function appendToList (rawReadings) {
				rawReadings.forEach(function (reading) {
					resultList.push(new app.SensorReading(reading));
				});
			}

			$.ajax(replaceTokens(url, $.extend({}, params, { page : 1})))
				.then(function (data, textStatus, jqXHR) {
					var responseHeader, parser, dfd, lastUrl;

					dfd = $.Deferred();

					if (data.length === 0) { dfd.reject(); }
					else {
						appendToList(data);

						responseHeader = getLinkHeader(jqXHR);
						parser = new app.LinkHeaderParser(responseHeader);
						lastUrl = parser.getUrlOfLastResultPage();

						var match = lastUrl.match(/page=(\d+)/), numberOfPages;
						if (!match) { throw new Error('Could not parse url: ' + lastUrl); }

						numberOfPages = match[1];
						dfd.resolve(numberOfPages);
					}
					return dfd;
				})
				.then(function (numberOfPages) {
					for (var i = 2; i <= numberOfPages; i++) {
						$.ajax(replaceTokens(url, $.extend({}, params, { page : i}))).done(appendToList);
					}
				});

			// Resolve immediately, but since the list is an observable, we can keep on adding to it!
			dfd.resolve(resultList);

			return dfd.promise();
		},

		/** Get the first and last sensor reading - given the params */
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
