/*
by Bradley K. Harris, 2018

The possible turns fall into 12 groups: one for each side, and one for each inner slice.
The checkMove() function follows this line of reasoning:

Is the candidate move in the same group as the previous move?
 Yes --> It's not good. We don't want to move a side twice in a row.
 No --> Maybe. Is the last move in a group which moves independently of the candidate move?
	No --> It's good.
	Yes --> If it's a 2x2, it's not good. Otherwise, maybe. Is the candidate move in the same group as the last2move?
		Yes --> It's not good.
		No --> Maybe. What about the last3move? Same group?
			Yes --> It's not good.
			No --> It's good.

This prevents duplicates like F-F2 and F-B-F2 (and on bigger cubes, F-f-F2).

2x2 only uses FRU moves, so that checking process is much simpler.
*/

const turns = ["F", "F'", "F2", "B", "B'", "B2", "L", "L'", "L2", "R", "R'", "R2", "U", "U'", "U2", "D", "D'", "D2", "f", "f'", "f2", "b", "b'", "b2", "l", "l'", "l2", "r", "r'", "r2", "u", "u'", "u2", "d", "d'", "d2"];
const turnsFRU = ["F", "F'", "F2", "R", "R'", "R2", "U", "U'", "U2"];
let scrcount = 0;
let movecount = 0;
let lastmove = 0;
let last2move = 0;
let last3move = 0;
let scramble = [];
let moveOK = false;
let nextmove = 0;
let nextmovenumber = 0;
let scrambleType = 0;

function randomNumber() {
	return (Math.floor(Math.random()*18));  //between 0 and 17
}

function randomNumberBig() {
	return (Math.floor(Math.random()*36));  //between 0 and 35
}

function randomNumberFRU() {
	return (Math.floor(Math.random()*9));  //between 0 and 8
}

function checkMove() {

	if (scrambleType == 2) { // Check moves for 2x2

		if (nextmove >= 1 && nextmove <= 3) {  // For 1-3 nextmove
			if (lastmove >= 1 && lastmove <= 3) {} // Is last move in the same group?
			else moveOK = true;
		}

		else if (nextmove >= 4 && nextmove <= 6) {  // For 4-6 nextmove
			if (lastmove >= 4 && lastmove <= 6) {}
			else moveOK = true;
		}

		else if (nextmove >= 7 && nextmove <= 9) {  // For 7-9 nextmove
			if (lastmove >= 7 && lastmove <= 9) {}
			else moveOK = true;
		}
	}

	else { // Check moves for cubes larger than 2x2

		/*
		Indices (+1)    independent groups:
		01-03 F F' F2   4-6, 19-24
		04-06 B B' B2   1-3, 19-24
		07-09 L L' L2   10-12, 25-30
		10-12 R R' R2   7-9, 25-30
		13-15 U U' U2   16-18, 31-36
		16-18 D D' D2   13-15, 31-36
		19-21 f f' f2   1-6, 22-24
		22-24 b b' b2   1-6, 19-21
		25-27 l l' l2   7-12, 28-30
		28-30 r r' r2   7-12, 25-27
		31-33 u u' u2   13-18, 34-36
		34-36 d d' d2   13-18, 31-33
		*/

		if (nextmove >= 1 && nextmove <= 3) {  // For 1-3 nextmove
			if (lastmove >= 1 && lastmove <= 3) {}   // Is last move in the same group?
			else {
				if ( (lastmove >= 4 && lastmove <= 6) || (lastmove >=19 && lastmove <= 24) ) { // Is the last move in an independent group?
					if (last2move >= 1 && last2move <= 3) {} // Is nextmove in the same group as the move before last?
					else {
						if (last3move >= 1 && last3move <= 3) {} // Is nextmove in the same group as 3 moves ago?
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 4 && nextmove <= 6) {  // For 4-6 nextmove
			if (lastmove >= 4 && lastmove <= 6) {}
			else {
				if ( (lastmove >= 1 && lastmove <= 3) || (lastmove >=19 && lastmove <= 24) ) {
					if (last2move >= 4 && last2move <= 6) {}
					else {
						if (last3move >= 4 && last3move <= 6) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 7 && nextmove <= 9) {  // For 7-9 nextmove
			if (lastmove >= 7 && lastmove <= 9) {}
			else {
				if ( (lastmove >= 10 && lastmove <= 12) || (lastmove >=25 && lastmove <= 30) ) {
					if (last2move >= 7 && last2move <= 9) {}
					else {
						if (last3move >= 7 && last3move <= 9) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 10 && nextmove <= 12) {  // For 10-12 nextmove
			if (lastmove >= 10 && lastmove <= 12) {}
			else {
				if ( (lastmove >= 7 && lastmove <= 9) || (lastmove >=25 && lastmove <= 30) ) {
					if (last2move >= 10 && last2move <= 12) {}
					else {
						if (last3move >= 10 && last3move <= 12) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 13 && nextmove <= 15) {  // For 13-15 nextmove
			if (lastmove >= 13 && lastmove <= 15) {}
			else {
				if ( (lastmove >= 16 && lastmove <= 18) || (lastmove >=31 && lastmove <= 36) ) {
					if (last2move >= 13 && last2move <= 15) {}
					else {
						if (last3move >= 13 && last3move <= 15) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 16 && nextmove <= 18) {  // For 16-18 nextmove
			if (lastmove >= 16 && lastmove <= 18) {}
			else {
				if ( (lastmove >= 13 && lastmove <= 15) || (lastmove >=31 && lastmove <= 36) ) {
					if (last2move >= 16 && last2move <= 18) {}
					else {
						if (last3move >= 16 && last3move <= 18) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 19 && nextmove <= 21) {  // For 19-21 nextmove
			if (lastmove >= 19 && lastmove <= 21) {}
			else {
				if ( (lastmove >= 1 && lastmove <= 6) || (lastmove >=22 && lastmove <= 24) ) {
					if (last2move >= 19 && last2move <= 21) {}
					else {
						if (last3move >= 19 && last3move <= 21) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 22 && nextmove <= 24) {  // For 22-24 nextmove
			if (lastmove >= 22 && lastmove <= 24) {}
			else {
				if ( (lastmove >= 1 && lastmove <= 6) || (lastmove >=19 && lastmove <= 21) ) {
					if (last2move >= 22 && last2move <= 24) {}
					else {
						if (last3move >= 22 && last3move <= 24) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 25 && nextmove <= 27) {  // For 25-27 nextmove
			if (lastmove >= 25 && lastmove <= 27) {}
			else {
				if ( (lastmove >= 7 && lastmove <= 12) || (lastmove >=28 && lastmove <= 30) ) {
					if (last2move >= 25 && last2move <= 27) {}
					else {
						if (last3move >= 25 && last3move <= 27) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 28 && nextmove <= 30) {  // For 28-30 nextmove
			if (lastmove >= 28 && lastmove <= 30) {}
			else {
				if ( (lastmove >= 7 && lastmove <= 12) || (lastmove >=25 && lastmove <= 27) ) {
					if (last2move >= 28 && last2move <= 30) {}
					else {
						if (last3move >= 28 && last3move <= 30) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 31 && nextmove <= 33) {  // For 31-33 nextmove
			if (lastmove >= 31 && lastmove <= 33) {}
			else {
				if ( (lastmove >= 13 && lastmove <= 18) || (lastmove >=34 && lastmove <= 36) ) {
					if (last2move >= 31 && last2move <= 33) {}
					else {
						if (last3move >= 31 && last3move <= 33) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

		else if (nextmove >= 34 && nextmove <= 36) {  // For 34-36 nextmove
			if (lastmove >= 34 && lastmove <= 36) {}
			else {
				if ( (lastmove >= 13 && lastmove <= 18) || (lastmove >=31 && lastmove <= 33) ) {
					if (last2move >= 34 && last2move <= 36) {}
					else {
						if (last3move >= 34 && last3move <= 36) {}
						else moveOK = true;
					}
				}
				else moveOK = true;
			}
		}

	} // end else encompassing all non-2 cubes

} // end checkMove function

function scrambleit(multi) {
	const movegoal = document.getElementById('movegoal').value;
	
	if (movegoal > 1999) {
		window.alert('Please enter a scramble length of less than 2000.');
	}
	else {
		if (multi == 0) {
			scrgoal = document.getElementById('scrgoal').value;
			if (scrgoal > 100) {
				window.alert('Please specify less than 101 scrambles.');
			}
			} else {
			scrgoal = 1;
		}

		document.getElementById('scr').innerHTML = '';
		
		scrambleType = document.getElementById('scrtype').value;
		scrcount = 0;
		
		while (scrcount < scrgoal && scrgoal < 101) {

			// reset scramble array and move tracking
			movecount = 0;
			lastmove = 0;
			last2move = 0;
			last3move = 0;
			scramble = [];

			while (movecount < movegoal) {
				
				if (scrambleType == 3) {
					nextmovenumber = randomNumber();
				}
				else if (scrambleType == 2) {
					nextmovenumber = randomNumberFRU();			
				}
				else if (scrambleType > 3) {
					nextmovenumber = randomNumberBig();
				}
				
				nextmove = nextmovenumber + 1;
		
				if (lastmove == 0) {
					moveOK = true;
				}
				else {
					checkMove();
				}
				
				if (moveOK) { // creates an array of OK'd moves
					if (scrambleType == 2) {
						scramble[movecount] = turnsFRU[nextmovenumber];
					}
					else {
						scramble[movecount] = turns[nextmovenumber];
					}
					movecount += 1;
					last3move = last2move;
					last2move = lastmove;
					lastmove = nextmove;
					moveOK = false;
				} 
		
			} // end inner While loop

			var sLen = scramble.length;
			scramble.toString();
			var viewscramble = "";

			for (i = 0; i < sLen; i++) {
				viewscramble += scramble[i] + " ";
				}

			scrcount += 1;
            var escapedScramble = "";
            for (let i = 0; i < viewscramble.length; i++) {
                if (viewscramble[i] == "'") 
					escapedScramble += '\\\'';
                else 
					escapedScramble += viewscramble[i];
            }
			if (multi == 0) { 
				document.getElementById('scr').innerHTML += "<button onclick=\"passScramble(\'" + escapedScramble + "\')\">Check</button> ";
			}
			document.getElementById('scr').innerHTML += viewscramble;
			if (multi == 0) { 
				document.getElementById('scr').innerHTML += "<br><br>";
			}
		} // end outer while loop
	} //end else
} // end scrambleit

function passScramble(s) {
    document.getElementById('newscramble').value = s;
    document.getElementById('scrCheck').click();
}

function checkScramble(){

	const newScram = document.getElementById('newscramble').value;
	scramble = [];
	var scramIndex = -1;
	var scramMove = "";

	for (var i in newScram){
		if (newScram[i] == "'" || newScram[i] == "2") {
			scramMove += newScram[i];
		}
		else {
			scramIndex++;
			scramMove = newScram[i];
		}
		scramble[scramIndex] = scramMove;
	} 
}

function updateLength(page) {

	const size = document.getElementById('scrtype').value;

	if (size == 3) {
		document.getElementById('movegoal').value = 20;
	}
	else if (size == 4) {
		document.getElementById('movegoal').value = 40;
	}
	else if (size == 5) {
		document.getElementById('movegoal').value = 60;
	}
	else if (size == 2) {
		document.getElementById('movegoal').value = 10;
	}

	if (page == 'scrambler') {
		document.getElementById('newscramble').value = '';
		makeDiagram();
		cubeReset();
		scrambleit(0);
	}
	
	else if (page == 'timer') {
		makeDiagram();
		scrambleit(1);
		diagramScramble();
		document.getElementById('scrtype').blur();
	}
}