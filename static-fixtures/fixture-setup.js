can.fixture.delay = 50;

can.fixture('GET /plants.json', function () {
	return PLANTS;
});

can.fixture('GET /plants/{id}.json', function (request, response, headers) {
	return PLANTS[request.data.id - 1];
});

can.fixture('GET /plants/{id}/sensorvalues.json?from={from}&to={to}&page={page}', function (request, response, headers) {
	response(200,
		"success",
		SENSORDATA,
		/* typical header data from the second result page */
		"Link: " + [
			'<http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=1>; rel="first"',
			'<http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=1>; rel="prev"',
			'<http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=448>; rel="last"',
			'<http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=3>; rel="next"'
		].join(', ')
	);
});


