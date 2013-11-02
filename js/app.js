/* Globals: jQuery can app */

(function ($) {
	'use strict';

	$(document).ready(function () {


		new app.Breadcrumb('#breadcrumb', {
			view : 'views/breadcrumb.ejs'
		});

		new app.Router('#main-content', {});

		can.route.ready();

	});
}(window.jQuery) );

