var PLANTS = [
	{
		"created_at" : "2013-08-21T16:55:21+02:00",
		"id"         : 1,
		"location"   : "Intermedia",
		"name"       : "Vindusplanten",
		"plant_type" : "Hest",
		"updated_at" : "2013-08-21T16:55:21+02:00"
	},
	{
		"created_at" : "2013-08-21T16:55:21+02:00",
		"id"         : 2,
		"location"   : "Intermedia",
		"name"       : "Plante 2",
		"plant_type" : "Basilikum",
		"updated_at" : "2013-07-21T16:55:21+02:00"
	}
];


can.fixture('GET /plants.json', function () {
	return PLANTS;
});

can.fixture('GET /plants/{id}.json', function (request, response, headers) {
	return PLANTS[request.data.id-1];
});

can.fixture.delay = 0;


