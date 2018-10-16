/*
I wrote the majority of this code, but I used another person's 
stopwatch code as a basis for the timer. You can view the original here:
http://cubetools.net/stopwatchcode.js
-Bradley Harris, 2018
*/

var timerRunning = false;
var results = [	[], [] ];
var successfulResults = [];
var attempt = 0;
var successfulAttempt = 0;
var inspect;
var inspection = 0;
var inspectionRunning = false;
var convertedDNF = false;

var	clsStopwatch = function() {
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
				return (new Date()).getTime(); 
			}; 
 
		// Public methods
		// Start or resume
		this.start = function() {
				startAt	= startAt ? startAt : now();
			};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0); 
			};
	};

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = Math.round( time % 1000 );

//	newTime = pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 2);

	if (m != 0) {
		newTime = m + ':' + pad(s, 2) + '.' + pad(ms, 2);
		}
	else {
		newTime = s + '.' + pad(ms, 2);
		}
	return newTime;
}

function crunchTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
//	m = Math.floor( time / (60 * 1000) );
//	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = Math.round( time % 1000 );

//	newTime = pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 2);

//	if (m != 0) {
//		newTime = m + ':' + pad(s, 2) + '.' + pad(ms, 2);
//		}
//	else {
		newTime = s + '.' + pad(ms, 2);
//		}
	return newTime;
}

function show() {
	$time = document.getElementById('time');
	update();
}

function update() {
	$time.innerHTML = formatTime(x.time());
}

function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop() {
	x.stop();
	update();
	clearInterval(clocktimer);
}

function reset() {
	stop();
	x.reset();
	update();
}

// All code after this point is mine originally. -Bradley

function inspectionCountdown() {
	if (inspectionRunning) {	
		inspect = setTimeout(function(){ inspectionCountdown() }, 1000);
		if (inspection > 0) {
			$time.innerHTML=inspection;
			if (inspection == 5 || inspection == 3 || inspection == 1) {
				document.getElementById('timerButton').style.background='#FFFF00';
			}
			else {
				document.getElementById('timerButton').style.background='#FFFFFF';
			}
			inspection -= 1;
		}
		else {
			updateInspection();
			$time.innerHTML="DNF";
      hideBigTimer();
			results[0][attempt] = 9999;
			attempt += 1;
			timerRunning = false;
			updateResults();
			scrambleit(1);
			diagramScramble();
		}
	}
	else {
		clearTimeout(inspect);
	}
}

function touchBegin() {
	if (timerRunning) {
		stop();
		document.getElementById('time').style.color='#000000';
	}
	else {
        showBigTimer();
		if (inspection > 0 && !inspectionRunning) {
		$time.innerHTML=inspection;
		$time.style.color='#808080';
		}
		
		else if (inspection > 0 && inspectionRunning) {
		$time.style.color='#008000'
		}

		else {
			reset();
			document.getElementById('time').style.color='#008000';
		}
	}
}

function touchRelease() {
	if (!timerRunning) {
		if (inspection > 0 && !inspectionRunning) {
			$time.style.color='#FF0000';
			inspectionRunning = true;
			inspectionCountdown();
		}
		else {
			reset();
			start();
			document.getElementById('timerButton').style.background='#FFFFFF';
			updateInspection();
			document.getElementById('time').style.color='#808080';
			timerRunning = true;
		}
	}	
	else {
		timerRunning = false;
		results[0][attempt] = Number(crunchTime(x.time()));
		results[1][attempt] = document.getElementById('scr').innerHTML;
		hideBigTimer();
		
		if ($time.innerHTML != "DNF") {
			successfulResults[successfulAttempt] = Number(crunchTime(x.time()));
			successfulAttempt += 1;
		}
		
		attempt += 1;
		convertedDNF = false;
		updateResults();
		scrambleit(1);
		diagramScramble();
	}
}

function updateResults() {
	var displayResultList = document.getElementById('sessionResults');
	var resultList = "<table class=\"results\"><tr>" +
			"<th></th><th>Scrambles</th>" +
			"<th style=\"text-align:right;\">Times</th>" +
			"<tr><td>";
	var lastfive = [];
	var lastfivesum = 0;
	var innerthreesum = 0;
	var roundnumber = 0;
	var nextTime = "";
	
	for (i = 0; i < results[0].length; i++) {
	roundnumber=Math.floor(i/5);

		if (results[0][i] == 9999) nextTime = "DNF";
		else nextTime = results[0][i];
		
		resultList += i+1 + ". </td><td>" + results[1][i] + "</td><td style=\"text-align:right\">"
			+ nextTime + "</td></tr><tr><td>";
				
		if ( (i + 1) % 5 == 0 ) {  // when attempts are multiples of 5

			// find last 5
			for (a = 1; a < 6; a++) lastfive[a-1] = results[0][(5*roundnumber)+5-a];

			// find sum of last 5
			for (a = 0; a < 5; a++)	lastfivesum += lastfive[a];
			
			lastfive.sort(function(a, b){return a-b});
			lastfive.pop();
			lastfive.shift();

			// find average of inner 3
			for (s = 0; s < 3; s++)	innerthreesum += lastfive[s];
			
			resultList += "</td><td><b>Average (inner 3 of 5):</b></td><td style=\"text-align:right\"><b>";
			
			if (lastfivesum > 19998) resultList += 'DNF';
			else resultList += round(innerthreesum/3, 2);
			
			resultList += "</b><br><br></td></tr><tr><td>";
		}
		lastfivesum = 0;
		innerthreesum = 0;
	}

	resultList += "</td></tr></table>"
	displayResultList.innerHTML=resultList;
	bestTimeCalc();
	worstTimeCalc();
	avgCalc();
}

function bestTimeCalc() {
	var displayBestTime = document.getElementById('besttime');
	var newBest = Math.min.apply(null, results[0]);
	if (newBest == 9999) newBest = "DNF";
	displayBestTime.innerHTML=newBest;
}

function worstTimeCalc() {
	var displayWorstTime = document.getElementById('worsttime');
	var newWorst;
	if (newWorst != "DNF") newWorst = Math.max.apply(null, results[0]);
	if (newWorst == 9999) newWorst = "DNF";
	displayWorstTime.innerHTML=newWorst;
}

function round(value, decimals){
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function avgCalc() {
	document.getElementById('numberattempts').innerHTML=successfulAttempt;
	var sumAttempts = 0;

	for (i = 0; i < successfulResults.length; i++) sumAttempts += successfulResults[i];
    
	document.getElementById('avg').innerHTML=round(sumAttempts/successfulResults.length, 2);
}

function clearResult() {
	if (attempt > 0) {
		if (results[0][attempt-1] != 9999) {
			successfulResults.pop();
			successfulAttempt -=1;
		}
		
	results[0].pop();
	results[1].pop();
	attempt -= 1;
	convertedDNF = false;
	updateResults();
	}
}

function resetResults() {
	reset();
	$time.style.color='#000000';
	timerRunning = false;
	updateInspection();
	results = [ [], [] ];
	successfulResults = [];
	attempt = 0;
	successfulAttempt = 0;
	convertedDNF = false;
	document.getElementById('sessionResults').innerHTML="";
	document.getElementById('numberattempts').innerHTML="0";
	document.getElementById('besttime').innerHTML="-";
	document.getElementById('worsttime').innerHTML="-";
	document.getElementById('avg').innerHTML="-";
}

function updateInspection() {
	inspectionRunning = false;
	inspection = document.getElementById('inspect').value;
	document.getElementById('inspect').blur();
}

function lastDNF() {
	if (results[0][attempt-1] != 9999 && attempt > 0) {
		$time.innerHTML = "DNF";
		results[0][attempt-1] = 9999;
		if (convertedDNF == false) {
			successfulResults.pop();
			successfulAttempt -= 1;
			convertedDNF = true;
		}
		updateResults();
	}
}

function toggleTip() {
	var tipBox = document.getElementById('inspectTip');

	if (tipBox.style.visibility == 'visible') tipBox.style.visibility = 'hidden';
	else tipBox.style.visibility = 'visible';
}

function updateTimerDisplay() {
    
    if (document.getElementById('scrambleChk').checked) {
        document.getElementById('scr').style.display = 'inline';
        document.getElementById('scrambleDetails').style.display = 'inline';
        document.getElementById('initscr').style.display = 'inline';
        document.getElementById('diagramChk').style.display = 'inline';
        document.getElementById('diagramChkLabel').style.display = 'inline';
    }
    else {
        document.getElementById('scr').style.display = 'none';
        document.getElementById('scrambleDetails').style.display = 'none';
        document.getElementById('initscr').style.display = 'none';
        document.getElementById('diagramChk').style.display = 'none';
        document.getElementById('diagramChkLabel').style.display = 'none';
    }
    if (document.getElementById('diagramChk').checked) {
        document.getElementById('cubediagram').style.display = 'inline';
    }
    else {
        document.getElementById('cubediagram').style.display = 'none';
    }
    if (document.getElementById('resultsChk').checked) {
        document.getElementById('results').style.display = 'inline';
    }
    else {
        document.getElementById('results').style.display = 'none';
    }
}

function showBigTimer() {
  document.getElementById('timerButton').className = 'bigTimer';
	document.getElementById('timerButton').style.background = '#FFFFFF';
  document.getElementById('bulk1').style.display = 'none';
  document.getElementById('bulk2').style.display = 'none';
  document.getElementById('bulk3').style.display = 'none';
  document.getElementById('bulk4').style.display = 'none';
}

function hideBigTimer() {
  document.getElementById('timerButton').className = 'timerButton';
	document.getElementById('timerButton').style.background = '#20E020';
  document.getElementById('bulk1').style.display = 'inline';
  document.getElementById('bulk2').style.display = 'inline';
  document.getElementById('bulk3').style.display = 'inline';
  document.getElementById('bulk4').style.display = 'inline';
}

function checkKey(e) {
	//window.alert(event.keyCode);
	
	evt = e.keyCode || e.charCode;
	
	if (evt == 32) { // Space Bar
		touchBegin();
	}
	
	else if (evt == 110) { // n
		resetResults();
		makeDiagram();
		scrambleit(1);
		diagramScramble();
	}
	
	else if (evt == 115) { // s
		makeDiagram();
		scrambleit(1);
		diagramScramble();
	}
	
	else if (evt == 100) { // d
		lastDNF();
	}
	
	else if (evt == 99) { // c
		clearResult();
	}
	
}

function keyRelease(e) {
	
	evt = e.keyCode || e.charCode;
	
	if (evt == 32) { // Space Bar
		touchRelease();
	}
}
