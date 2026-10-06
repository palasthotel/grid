/**
 * jQuery 4 (Drupal 11) removed utility functions that the bundled jQuery plugins
 * still call: blueimp-file-upload, its iframe transport and mutate. They are
 * restored here, only where jQuery no longer has them.
 */
(function ($) {
	if (!$) {
		return;
	}
	if (typeof $.isArray !== "function") {
		$.isArray = Array.isArray;
	}
	if (typeof $.isFunction !== "function") {
		$.isFunction = function (value) {
			return typeof value === "function";
		};
	}
	if (typeof $.trim !== "function") {
		$.trim = function (text) {
			return text == null ? "" : String(text).trim();
		};
	}
	if (typeof $.parseJSON !== "function") {
		$.parseJSON = JSON.parse;
	}
	if (typeof $.type !== "function") {
		$.type = function (value) {
			if (value == null) {
				return String(value);
			}
			var type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
			return typeof value === "object" || typeof value === "function" ? type : typeof value;
		};
	}
})(window.jQuery);
