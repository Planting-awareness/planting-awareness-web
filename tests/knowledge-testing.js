describe('Plant#findAll', function () {

	// Fixture's take some time to set up the first time
	// Run it once before the tests to 'warm up'
	before(function(done) {
		console.log('hei');
		Plant.findAll({}).done(function(){
			console.log('suksess')
			done();

		}).fail(function() {
				console.log('feilet', arguments)

			});
//			done(); });
	});

	it('should take a callback', function(done) {
		Plant.findAll({}, function() {
			done();
		});
	});

	it('should return a promise', function () {
		var result = Plant.findAll();
		expect(result.done).to.be.a(Function);
		expect(result.fail).to.be.a(Function);
	});

	it('should return an array from done', function (done) {
		$.when(Plant.findAll()).done(function (res) {
			expect(res.length).to.not.be(undefined);
			done();
		});
	});

	it('should return an array of Plants', function (done) {
		$.when(Plant.findAll()).done(function (res) {
			expect(res[0]).to.be.a(Plant);
			done();
		});
	});

});

describe('Plant#findOne', function() {
	it('should return the requested plant', function (done) {
		$.when(Plant.findOne({id : 1})).done(function (res) {
			expect(res).to.be.a(Plant);
			done();
		});
	});
});

describe('SensorReading#findAll', function() {
	it.skip('should return an array of readings', function (done) {
		SensorReading.findAll().done(function (res) {
			expect(res.length).to.not.be(undefined);
			done();
		});
	});
});

