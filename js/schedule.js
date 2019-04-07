const scheduleList = document.querySelector('.schedule-list');
var events = [];
var timeoutHandle;
updateSchedule();
var now = new Date();
const diff = 60000 - (now.getSeconds()*1000 + now.getMilliseconds());
console.log(`Updating again in ${diff} mils...`);
setTimeout(function() {
	updateSchedule();
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
			const startTime = new Date(currentEvents[itr]['startTime'].replace(' ','T'));
			const endTime = new Date(currentEvents[itr]['endTime'].replace(' ','T'));
			var formattedTime = formatTime(startTime);
			if (startTime != endTime) {
				formattedTime += ` - ${formatTime(endTime)}`;
			}
			p2.innerHTML = formattedTime; // adds time
			div.appendChild(p2)
			const p3 = document.createElement('p');
			p3.innerHTML = '@ ' + currentEvents[itr]['location']; // adds loc
			div.appendChild(p3);
			for(k = 3; k < schedule.length; k++) {
				schedule[k].classList.add('schedule-remove'); // fades out last one
			}
			// if (timeoutHandle) {
				// window.clearTimeout(timeoutHandle);
			// }
			timeoutHandle = window.setTimeout(function() {
				for(k = 3; k < schedule.length; k++) {
					schedule[k].remove(); // fades out last one
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
	var xhr = new XMLHttpRequest();
	xhr.onload = function(e) {
		const parsedDate = dayOfWeek(now.getDay());
  		// const parsedDate = `${now.getMonth() + 1}/${now.getDate()}/${1899 + now.getYear() + 1}`;
  		const response = JSON.parse(xhr.response);
  		if (response['Schedule']) {
  			for (i = 0; i < response['Schedule'].length; i++) {
  				if (response['Schedule'][i][0] == parsedDate) { // check if same day
  					var newEvents = response['Schedule'][i][1];
					// loop through total events, checking if occurring right now.
					// if they are, pops from event and adds to the webpage.
					newEvents = newEvents.filter(function(el) {
						for (j = 0; j < events.length; j++) {
							if (events[j]['title'] == el['title']) { // checks for duplicate (title)
								return false;
							}
						}
						return true; // adds to new array if no dupe
					});
					console.log(newEvents);
					console.log(events);
					console.log(`[${now}]\n${newEvents.length} new event(s) added!`);
					events = events.concat(newEvents);
					var currentEvents = [];
					for (j = 0; j < events.length; j++) {
						const startTime = new Date(events[j]['startTime'].replace(' ','T'));
						const endTime = new Date(events[j]['endTime'].replace(' ','T'));
						if (startTime <= now && endTime > now) {
							// check if current events has this
							if (events[j]['onDisplay'] != true) {
								currentEvents.push(events[j]);
								events[j]['onDisplay'] = true;
							}
						}
					}
					currentEvents.sort(function(a, b){
					    var keyA = new Date(a['startTime'].replace(' ','T')),
					        keyB = new Date(b['startTime'].replace(' ','T'));
					    // Compare the 2 dates
					    if(keyA < keyB) return 1;
					    if(keyA > keyB) return -1;
					    return 0;
					});
					addEvent(currentEvents, currentEvents.length-1); // adds to webpage
  					break;
  				}
  			}
  		}
	}
	xhr.open('GET', 'schedule.json');
	xhr.send();
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