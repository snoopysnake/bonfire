const announcementList = document.querySelector('.announcement-list');
// var lastMessages = [];
// var lastMessage;
// announcementsLog();
// const diff2 = 1000 - now.getMilliseconds();
// console.log(`Updating announcements again in ${diff2} mils...`);
// setTimeout(function() {
// 	updateAnnouncements();
// 	setInterval(updateAnnouncements, 1000);
// },diff2);

function addMessage(messages, itr) {
	const announcement = document.querySelectorAll('.announcement');
	if (itr < messages.length) {
			for (i = 0; i < announcement.length; i++) {
				announcement[i].classList.remove('no-transition'); // allows shifting down
				announcement[i].classList.add('announcement-shift');
			}
			const div = document.createElement('div'); // create new div
			div.classList.add('announcement');
			div.classList.add('announcement-new');
			const p = document.createElement('p');
			p.innerHTML = `<a class="time">&bull; [${moment.tz(messages[itr]['timestamp'], 'America/New_York').
				format('HH:mm:ss')}]</a><a> ${messages[itr]['message']}</a>`;
			div.appendChild(p)
			for(k = 7; k < announcement.length; k++) {
				announcement[k].classList.add('announcement-remove'); // fades out last one
			}
			// if (timeoutHandle) {
				// window.clearTimeout(timeoutHandle);
			// }
			timeoutHandle = window.setTimeout(function() {
				for(k = 7; k < announcement.length; k++) {
					announcement[k].remove(); // fades out last one
				}
				for (i = 0; i < announcement.length; i++) {
					announcement[i].classList.add('no-transition'); // prevents shift back up
					announcement[i].classList.remove('announcement-shift');
				}
				announcementList.prepend(div); // adds new (transparent) div
				window.setTimeout(function() {
					div.classList.remove('announcement-new');
					div.classList.add('announcement-add'); // fade in
					setTimeout(function(){addMessage(messages, itr+1)}, 200);
				}, 100);
			}, 200); // wait
	}
}

function announcementsLog() {
	var xhr = new XMLHttpRequest();
	xhr.onload = function(e) {
		if (xhr.response) {
			lastMessages = JSON.parse(xhr.response);
			lastMessages.sort(sortTime);
			if (lastMessages.length > 8) {
				lastMessages = lastMessages.slice(lastMessages.length-8, lastMessages.length); // get last 5
			}
			addMessage(lastMessages, 0);
			if (lastMessages.length > 0) {
				lastMessage = lastMessages[lastMessages.length-1];
			}
			else {
				console.log('Something went wrong - no announcements fetched');
			}
			lastMessages = [];
		}
	}
	xhr.open('GET', 'announcements.json');
	xhr.send();
}


function updateAnnouncements() {
	// check for more announcements
	console.log('UPDATING ANNOUNCEMENTS...');
	var xhr = new XMLHttpRequest();
	xhr.onload = function(e) {
		var newMessages = JSON.parse(xhr.response);
		for (var i = 0; i < newMessages.length; i++) {
			const timeStamp = moment.tz(newMessages[i]['timestamp'], 'America/New_York');
			const lastTimeStamp = moment.tz(lastMessage['timestamp'], 'America/New_York');
			if (timeStamp > lastTimeStamp) {
				lastMessages.push(newMessages[i]); // adds new messages to log
			}
		}
		addMessage(lastMessages, 0);
		console.log(lastMessages);
		if (lastMessages.length > 0) {
			lastMessage = lastMessages[lastMessages.length-1];
		}
		lastMessages = [];
	}
	xhr.open('GET', 'announcements.json');
	xhr.send();
}