/**
 * Parses the Link header sent from the monoplant server to find the last and next page urls
 * @author carlerik@gmail.com
 * @date   26.10.13.
 */

app.LinkHeaderParser = (function () {
	function LinkHeaderParser (linkHeader) {
		this.link = linkHeader || "";
	}

	function findLink (searchElement) {
		var index,
			links = this.link.split(", ");

		for (var i = 0, len = links.length, link; i < len; i++) {
			link = links[i];
			index = link.indexOf('; rel="' + searchElement + '"');

			if (index > -1) {
				return link.substring(1, index - 1);
			}
		}
		return false;
	}

	LinkHeaderParser.prototype.getUrlOfNextResultPage = function () {
		return findLink.call(this, 'next');
	};
	LinkHeaderParser.prototype.getUrlOfLastResultPage = function () {
		return findLink.call(this, 'last');
	};

	return LinkHeaderParser;
}());
