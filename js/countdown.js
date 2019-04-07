var cdDate = new Date('2019-04-14 08:00').getTime();
var timer = document.getElementById('countdown');
var timesUp = document.querySelector('header > div');
countdown();
var countdownHandle = setInterval(countdown, 1000);

function countdown() {
	var cdNow = new Date().getTime();
	var distance = cdDate - cdNow;
	console.log(distance);

	// Time calculations for days, hours, minutes and seconds
	var cdHours = Math.floor(distance / (1000 * 60 * 60));
	var cdMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var cdSeconds = Math.floor((distance % (1000 * 60)) / 1000);

	timer.innerHTML = `${dd(cdHours) ? '0' + cdHours : cdHours}:${dd(cdMinutes) ? '0' + cdMinutes : cdMinutes}:${dd(cdSeconds) ? '0' + cdSeconds : cdSeconds}`;

	// If the count down is finished, write some text 
	if (!countdownHandle)
	{
		clearInterval(countdownHandle);
	}
	if (distance < 0) {
		timesUp.innerHTML = 'Time\'s up!';
	}
}

function dd(num) {
	return num / 10 < 1;
}