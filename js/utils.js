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
	}
};
