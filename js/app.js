/* Globals: jQuery can app */

(function ($) {
	'use strict';

	$(document).ready(function () {


		new app.Breadcrumb('#breadcrumb', {
			view : 'views/breadcrumb.ejs'
		});

		new app.Router('#container', {});

		can.route.ready();

	});
}(window.jQuery) );

