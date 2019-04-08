const announcementList = document.querySelector('.announcement-list');
var lastMessages = [];
var lastMessage;
announcementsLog();
console.log(`Updating announcements again in ${diff} mils...`);
// response from server (temp)
var newMessages = [
	{'timeStamp' : moment().subtract(5, 'days').format(), 'message' : 'This is an old announcement.'},
	{'timeStamp' : moment().subtract(3, 'minutes').format(), 'message' : 'This is an old announcement.'},
	{'timeStamp' : moment().subtract(2, 'minutes').format(), 'message' : 'This is an old announcement.'},
	{'timeStamp' : moment().subtract(1, 'minutes').format(), 'message' : 'This is a new announcement.'},
	{'timeStamp' : moment().subtract(7, 'months').format(), 'message' : 'This is an old announcement.'},
	{'timeStamp' : moment().subtract(50, 'seconds').format(), 'message' : 'This is a new announcement.'}
];
newMessages.sort(sortTime);
setTimeout(function() {
	updateAnnouncements();
	setInterval(updateAnnouncements, 6000);
},diff);

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
			p.innerHTML = `<a class="time">&bull; [${moment.tz(messages[itr]['timeStamp'], 'America/New_York').
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
	lastMessages = [
		{'timeStamp' : moment().subtract(10, 'days').format(), 'message' : 'This is an announcement made 10 days ago.'},
		{'timeStamp' : moment().subtract(9, 'days').format(), 'message' : 'This is an announcement made 9 days ago.'},
		{'timeStamp' : moment().subtract(8, 'days').format(), 'message' : 'This is an announcement made 8 days ago.'},
		{'timeStamp' : moment().subtract(7, 'days').format(), 'message' : 'This is an announcement made 7 days ago.'},
		{'timeStamp' : moment().subtract(6, 'days').format(), 'message' : 'This is an announcement made 6 days ago.'},
		{'timeStamp' : moment().subtract(5, 'days').format(), 'message' : 'This is an announcement 5 days ago.'},
		{'timeStamp' : moment().subtract(3, 'minutes').format(), 'message' : 'This is an announcement made 3 minutes ago.'},
		{'timeStamp' : moment().subtract(2, 'minutes').format(), 'message' : 'This is an announcement made 2 minutes ago.'},
	];

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


function updateAnnouncements() {
	// check for more announcements
	for (var i = 0; i < newMessages.length; i++) {
		const timeStamp = moment.tz(newMessages[i]['timeStamp'], 'America/New_York');
		const lastTimeStamp = moment.tz(lastMessage['timeStamp'], 'America/New_York');
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