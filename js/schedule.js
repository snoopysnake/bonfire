const scheduleHeader = document.querySelector('.schedule-div > h3'); // temporary
scheduleHeader.addEventListener('click', addEvent, false); // temporary
var timeoutHandle;

function addEvent() {
	const schedule = document.querySelectorAll('.schedule');
	const scheduleList = document.querySelector('.schedule-list');
	for (i = 0; i < schedule.length; i++) {
		schedule[i].classList.remove('no-transition');
		schedule[i].classList.add('schedule-shift');
	}
	if (schedule.length == 4) {
		schedule[3].classList.add('schedule-remove');
		if (timeoutHandle)
			window.clearTimeout(timeoutHandle);
		timeoutHandle = window.setTimeout(function() {
			schedule[3].remove();
			const div = document.createElement('div');
			div.classList.add('schedule');
			div.classList.add('schedule-new');
			const p1 = document.createElement('p');
			p1.innerHTML = 'line 1';
			div.appendChild(p1)
			const p2 = document.createElement('p');
			p2.innerHTML = 'line 2';
			div.appendChild(p2)
			const p3 = document.createElement('p');
			p3.innerHTML = 'line 3';
			for (i = 0; i < schedule.length; i++) {
				schedule[i].classList.add('no-transition');
				schedule[i].classList.remove('schedule-shift');
			}
			div.appendChild(p3);
			scheduleList.prepend(div);
			window.setTimeout(function() {
				div.classList.remove('schedule-new');
				div.classList.add('schedule-add');
			}, 100);
		}, 1500);
	}
}