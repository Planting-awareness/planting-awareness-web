/* global: can app */
(function () {
	'use strict';
	var url = '/plants/{id}/sensorvalues.json';
//	var url = '/plants/{id}/sensorvalues.json?from={from}&to={to}&page={page}';
//	var url = '/plants/1/sensorvalues.json?&to=2013-10-26&from=2013-10-24&page=10';

	function isoDate (d) {
		return d.toISOString().substring(0, 10);
	}

	function replaceTokens (url, tokens) {
		var s = url;
		for (var token in tokens) {
			if (tokens.hasOwnProperty(token)) {
				console.log(token, tokens)
				s = s.replace(new RegExp('{' + token + '}'), tokens[token]);
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

	app.SensorReading = can.Model({
		findAll          : 'GET ' + url,
		findFirstAndLast : function (params) {
			if(!this.cache) { this.cache = {}; }

			var dfd = $.Deferred(), cache = this.cache;


			if(cache[params.id]) {
				dfd.resolve(cache[params.id]);
				return dfd;
			}

			$.ajax(replaceTokens(url, params), {
				success : function (data, textStatus, jqXHR) {
					var responseHeader , h, lastUrl, first;

					function buildResultAndResolve (data) {
						var result = {first : first, last : lastReading(data) };
						cache[params.id] = result;
						dfd.resolve(result);
					}

					first = firstReading(data);
					responseHeader = jqXHR.getResponseHeader("Link");
					if (!responseHeader) {
						dfd.reject();
						throw new Error("Server did not return Link header.");
					}

					h = new app.LinkHeaderParser(responseHeader);
					lastUrl = stripHostName(h.getUrlOfLastResultPage());

					// if none found, means all results are contained on the current page
					if (!lastUrl) {
						buildResultAndResolve(data);
					} else {
						// go the the last result on the server and fetch that page
						$.ajax(lastUrl).done(buildResultAndResolve);
					}
				}
			});

			return dfd;
		}
	}, {
		/* utility functions */
		created : function () {
			return new Date(this.attr('created_at'));
		}
	});
}());
