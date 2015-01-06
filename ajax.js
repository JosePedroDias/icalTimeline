function ajax(o) {
	'use strict';

	var xhr = new XMLHttpRequest();
	if (o.creds) { xhr.withCredentials = true; }
	xhr.open(o.verb || 'GET', o.uri, true);
	var cbInner = function() {
		if (xhr.readyState === 4 && xhr.status > 199 && xhr.status < 300) {
			return o.cb(null, JSON.parse(xhr.response));
		}
		o.cb('error requesting ' + o.uri);
	};
	xhr.onload  = cbInner;
	xhr.onerror = cbInner;
	xhr.send(o.payload || null);
}
