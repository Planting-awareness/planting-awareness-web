/**
 * @author carlerik@gmail.com
 * @date   26.10.13.
 */

describe('LinkHeaderParser', function () {

	var last = 'http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=448',
		first = 'http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=1',
		next = 'http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=3',
		prev = 'http://monoplant.me/plants/1/sensorvalues.json?from=2013-09-01&page=1',
		headers = "Link : " + [
			'<' + first + '>; rel="first"',
			'<' + prev + '>; rel="prev"',
			'<' + last + '>; rel="last"',
			'<' + next + '>; rel="next"'
		].join(', ');

	it('should get url of last result set page', function () {
		var h = new app.LinkHeaderParser(headers);
		expect(h.getUrlOfLastResultPage()).to.be(last);
	});

	it('should get url of next result set page', function () {
		var h = new app.LinkHeaderParser(headers);
		expect(h.getUrlOfNextResultPage()).to.be(next);
	});
});

