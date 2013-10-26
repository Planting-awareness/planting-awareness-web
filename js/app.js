/* Globals: jQuery can app */

(function ($) {
	'use strict';

	$(document).ready(function () {

		// Delay routing until we initialized everything
		can.route.ready(false);

		new app.Breadcrumb('#breadcrumb', {
			view : 'views/breadcrumb.ejs'
		});

		new app.Router('#container', {});

		can.route.ready(true);

	});
}(window.jQuery) );

