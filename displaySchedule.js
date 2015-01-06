(function() {
	'use strict';

	// http://rawgit.com/almende/vis/master/examples/timeline/index.html
	// http://rawgit.com/almende/vis/master/examples/timeline/01_basic.html
	// http://rawgit.com/almende/vis/master/examples/timeline/05_groups.html
	// http://rawgit.com/almende/vis/master/examples/timeline/10_limit_move_and_zoom.html

	ajax({
		uri: 'fosdem2015.json',
		cb: function(err, o) {
			if (err) { return alert(err); }

			// find categories set
			var categories = {};
			o.forEach(function(ev) {
				categories[ ev.category ] = true;
			});
			categories = Object.keys(categories);

			// apply it
			var groups = new vis.DataSet();
			var numCategories = categories.length;
			categories.forEach(function(cat) {
				groups.add({
					id:      cat,
					content: cat
				});
			});

			var catIndex = function(cat) {
				return categories.indexOf(cat);
			};

			// create color scale
			var palette = categories.map(function(category, idx) {
				return chroma.hsv(
					idx * 360 / numCategories,
				.5, 0.75).hex();
			});
			var styleEl = document.createElement('style');
			styleEl.innerHTML = palette.map(function(clr, idx) {
				return [
					'.cat_', idx, ' { background-color: ', clr, ' }'
				].join('');
			}).join('\n');
			document.head.appendChild(styleEl);
			//console.log( palette );

			// map events to timeline items
			var items = o.map(function(ev, idx) {
				var el = document.createElement('div');
				el.innerHTML = [
					ev.summary,
					'<br/><span class="details">', ev.attendee, ' @ ', ev.location, '</span>'
				].join('');
				el.className = 'cat_' + catIndex(ev.category);
				el.title = [
					ev.summary,
					ev.duration + ' min by ' + ev.attendee,
					ev.start.hms.substring(0, 5) + ' @ ' + ev.location
				].join('\n');
				return {
					id:      '' + idx,
					content: el,
					group:   ev.category,
					start:   new Date(ev.start.date),
					end:     new Date(ev.end.date),
					//type: 'box' // box point
				}
			});

			var ctnEl = document.createElement('div');
			document.body.appendChild(ctnEl);
			var timeline = new vis.Timeline(ctnEl);

			var min15 = 1000 * 60 * 15;
			var hour1 = 1000 * 60 * 60;
			var day1  = 1000 * 60 * 60 * 24;
			timeline.setOptions({
				//height: '800px',
				groupOrder: 'start',
				min:     new Date(2015, 0, 31,  9),
				max:     new Date(2015, 1,  1, 19),
				zoom:    hour1,
				zoomMin: min15,
				zoomMax: day1
			});

			if (location.hash) {
				timeline.setGroups(groups);	
			}

			timeline.setItems(items);
			timeline.setWindow(
				new Date(2015, 0, 31,  9),
				new Date(2015, 0, 31, 13)
			);
		}
	});

})();
