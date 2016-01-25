var fs = require('fs');

var ical = require('ical'); // https://github.com/peterbraden/ical.js



var months = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
var dows = 'sun mon tue wed thu fri sat'.split(' ');

//var cal = 'lightning_talks.ics';
var cal = 'ical';


var toDate = function(o) { return new Date(o); };
var toTS = function(o) { return (new Date(o)).valueOf(); };
var toHMS = function(o) {
	try {
		return ( /T(\d?\d:\d\d:\d\d)/ ).exec( new Date(o).toISOString() )[1];
	} catch (ex) {
		//console.log(o);
		return '?';
	}
};
var toMonth = function(o) { return months[ (new Date(o)).getMonth() ]; };
var toDOW = function(o) { return dows[ (new Date(o)).getDay() ]; };
var toDOM = function(o) { return (new Date(o)).getDate(); };
var duration = function(s, e) {
	return (toTS(e) - toTS(s)) / 60 / 1000;
};

var getAttendeeName = function(o) {
	if (!o || !o.params) { return ''; }
	for (var i = o.params.length - 1, m; i >= 0; --i) {
		m = (/CN="([^"]+)"/).exec(o.params[i]);
		if (m) {
			return m[1];
		}
	}
	return '';
};

var onParsedFile = function(data) {
	for (var k in data) {
		if (data.hasOwnProperty(k)) {
			var ev = data[k];

			if (!ev.summary) { continue; }

			console.log([
				'\nCategory: ',
				ev.categories,

				'\n Summary: ',
				ev.summary,

				'\nAttendee: ',
				getAttendeeName(ev.attendee),

				'\nLocation: ',
				ev.location,

				'\n    Date: ',
				toDOW(ev.start), ' ',
				toDOM(ev.start),, ' ',
				toMonth(ev.start),

				'\n   Start: ',
				toHMS(ev.start),

				'\n     End: ',
				toHMS(ev.end),

				'\nDuration: ',
				duration(ev.start, ev.end), ' min',

				//Object.keys(ev).join('|'),
			].join(''));
		}
	}
};

var onParsedFile2 = function(data) {
	var events = [];
	for (var k in data) {
		if (data.hasOwnProperty(k)) {
			var ev = data[k];

			if (!ev.summary) { continue; }

			events.push({
				category: ev.categories[0],
				summary:  ev.summary,
				attendee: getAttendeeName(ev.attendee),
				location: ev.location,
				start: {
					date:  ev.start,
					dow:   toDOW(ev.start),
					dom:   toDOM(ev.start),
					month: toMonth(ev.start),
					hms:   toHMS(ev.start)
				},
				end: {
					date:  ev.end,
					hms:   toHMS(ev.end)
				},
				duration: duration(ev.start, ev.end)
			});
		}
	}
	return events;
};

/*ical.fromURL(cal, {}, function(err, data) {
	if (err) { return console.log(err); }
	onParsedFile(data);
});*/

//onParsedFile( ical.parseFile(cal) );

fs.writeFileSync('fosdem2016.json', JSON.stringify( onParsedFile2( ical.parseFile(cal) ) ) );
//fs.writeFileSync('fosdem2015.json', JSON.stringify( onParsedFile2( ical.parseFile(cal) ), null, '\t' ) );
