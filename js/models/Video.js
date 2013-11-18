/* global: can app */

(function () {
	'use strict';

	app.Video = can.Model.extend({

		/**
		 * Retrieve all videos for a given plant
		 *
		 * @param params.id {String} the plant id
		 *
		 * @returns {Deferred}
		 */
		findAll     : '/plants/{plantId}/videos.json',
		findOne     : '/plants/{plantId}/videos/{videoId}.json',
		/**
		 * Find a video for a given date
		 * @param options.plantId {String|Number}
		 * @param options.date {String} iso8601 date
		 */
		findForDate : function (options) {
			return this.findAll({plantId : options.plantId})
				.then(function (videos) {
					var videoCurrentDate = null,
						video,
						len = videos.length,
						i = 0;


					while (!videoCurrentDate && i < len) {
						video = videos[i];
						if (utils.isoDate(video.timelapseDate()) === options.date) {
							videoCurrentDate = video;
						}
						i++;
					}
					return videoCurrentDate;
				});
		}
	}, {
		/* utility functions */
		timelapseDate : function () {
			var date;
			if (this.date) {
				date = new Date(this.date);
			} else {
				date = new Date(this.created_at);
				date = new Date(date.getTime() - 1000 * 3600 * 24);
			}
			return date;
		},

		thumbnail : function () {
			return this.attr('thumbnailurl').replace('original', 'thumb');
		}
	});
}());