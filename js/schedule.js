const scheduleList = document.querySelector('.schedule-list');
var events;
var timeoutHandle;
updateSchedule();
var now = new Date();
const diff = 60000 - (now.getSeconds()*1000 + now.getMilliseconds());
console.log(`Updating again in ${diff} mils...`);
setTimeout(function() {
	setInterval(updateSchedule, 60000);
},diff);

function addEvent(currentEvents, itr) {
	const schedule = document.querySelectorAll('.schedule');
	if (itr >= 0) {
			for (i = 0; i < schedule.length; i++) {
				schedule[i].classList.remove('no-transition'); // allows shifting down
				schedule[i].classList.add('schedule-shift');
			}
			const div = document.createElement('div'); // create new div
			div.classList.add('schedule');
			div.classList.add('schedule-new');
			const p1 = document.createElement('p');
			p1.innerHTML = currentEvents[itr]['title']; // adds title
			div.appendChild(p1)
			const p2 = document.createElement('p');
			const startTime = new Date(currentEvents[itr]['startTime']);
			const endTime = new Date(currentEvents[itr]['endTime']);
			var formattedTime = formatTime(startTime);
			if (startTime != endTime) {
				formattedTime += ` - ${formatTime(endTime)}`;
			}
			p2.innerHTML = formattedTime; // adds time
			div.appendChild(p2)
			const p3 = document.createElement('p');
			p3.innerHTML = '@ ' + currentEvents[itr]['location']; // adds loc
			div.appendChild(p3);
			if (schedule.length >= 4) {
				schedule[3].classList.add('schedule-remove'); // fades out last one
			}
			// if (timeoutHandle) {
				// window.clearTimeout(timeoutHandle);
			// }
			timeoutHandle = window.setTimeout(function() {
				if (schedule.length == 4) {
					console.log(schedule[3]);
					schedule[3].remove(); // removes last one
					console.log(schedule[3]);
				}
				for (i = 0; i < schedule.length; i++) {
					schedule[i].classList.add('no-transition'); // prevents shift back up
					schedule[i].classList.remove('schedule-shift');
				}
				scheduleList.prepend(div); // adds new (transparent) div
				window.setTimeout(function() {
					div.classList.remove('schedule-new');
					div.classList.add('schedule-add'); // fade in
					setTimeout(function(){addEvent(currentEvents, itr-1)}, 1200);
				}, 100);
			}, 1500); // wait
	}
}

function updateSchedule() {
	console.log('UPDATING SCHEDULE...');
	now = new Date();
	if (!events) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function(e) {
			const parsedDate = dayOfWeek(now.getDay());
	  		// const parsedDate = `${now.getMonth() + 1}/${now.getDate()}/${1899 + now.getYear() + 1}`;
	  		const response = JSON.parse(xhr.response);
	  		if (response['Schedule']) {
	  			for (i = 0; i < response['Schedule'].length; i++) {
	  				if (response['Schedule'][i][0] == parsedDate) {
	  					events = response['Schedule'][i][1];
	  					updateSchedule();
	  					break;
	  				}
	  			}
	  		}
		}
		xhr.open('GET', 'schedule.json');
		xhr.send();
	}
	else {
		// loop through total events, checking if occurring right now.
		// if they are, pops from event and adds to the webpage.
		var currentEvents = [];
		for (j = 0; j < events.length; j++) {
			const startTime = new Date(events[j]['startTime']);
			const endTime = new Date(events[j]['endTime']);
			if (startTime <= now && endTime > now) {
				currentEvents.push(events[j]);
			}
		}
		currentEvents.sort(function(a, b){
		    var keyA = new Date(a['startTime']),
		        keyB = new Date(b['startTime']);
		    // Compare the 2 dates
		    if(keyA < keyB) return 1;
		    if(keyA > keyB) return -1;
		    return 0;
		});
		console.log(currentEvents);
		addEvent(currentEvents, currentEvents.length-1); // adds to webpage
		events = events.filter( function( el ) { 
			// removes current events after they have been added.
			return currentEvents.indexOf( el ) < 0;
		} );
	}
}

function dayOfWeek(num) {
	switch(num) {
		case 0 : return 'Sunday';
		case 1 : return 'Monday';
		case 2 : return 'Tuesday';
		case 3 : return 'Wednesday';
		case 4 : return 'Thursday';
		case 5 : return 'Friday';
		case 6 : return 'Saturday';
	}
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}