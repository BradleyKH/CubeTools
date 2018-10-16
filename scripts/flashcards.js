// by Bradley K. Harris, 2018

var currentSet;
var currentName;
var currentFolder;
var currentAlgSet;
var currentCaseSet;
var stackAlgs = [];
var stackCases = [];
var imgList = [];
var card = 0;
var mode = 1;
var cardTotal;

function changemode(themode){
	mode = themode;
	updateCard();
}

function changeSet() {

	var setNumber = Number(document.getElementById('currentSet').value);
	currentSet = setList[setNumber];
	currentName = currentSet[0];
	currentFolder = currentSet[1];
	currentAlgSet = currentSet[2];
	currentCaseSet = currentSet[3];
	card = 0;
	
	document.getElementById('detailsDisplay').innerHTML=currentSet[4];
	document.getElementById('checklist').innerHTML='';
	
	for (i = 0; i < currentAlgSet.length; i++) {
		document.getElementById('checklist').innerHTML+='<input type=\"checkbox\" id=\"c' + i + '\" checked><label for=\"c' + i + '\">' + currentAlgSet[i][0] + '</label><br>';
	}

	updateAlgList();
	document.getElementById('currentSet').blur();
}

function updateAlgList() {

	stackAlgs = [];
	stackCases = [];
	imgList = [];
	imgFileNumber = 0;
	imgIndex = 0;
	card = 0; // or use a conditional to drop it to a checked card
	
	var stackIndex = 0;

	for (i = 0; i < currentAlgSet.length; i++) {
		if (document.getElementById('c'+i).checked == true) {
			for (a = 1; a < currentAlgSet[i].length; a++) {
				stackAlgs[stackIndex] = currentAlgSet[i][a];
				stackCases[stackIndex] = currentCaseSet[i][a-1];
				stackIndex += 1;
				imgList[imgIndex] = imgFileNumber+1;
				imgFileNumber += 1;
				imgIndex += 1;
			}
		}
		else {
			imgFileNumber += currentAlgSet[i].length-1;
		}
	}

	cardTotal = stackAlgs.length;
	document.getElementById('stackLength').innerHTML=cardTotal;
	
	if (document.getElementById('shuffle').checked == false) {
		document.getElementById('randomize').innerHTML='in orde<u>r</u>';
	} else {
		document.getElementById('randomize').innerHTML='at <u>r</u>andom';
	}
	updateCard();
}

function updateCard(){
	var algID = document.getElementById('alg');
	var caseID = document.getElementById('case');
	var caseImgID = document.getElementById('caseimg');
	var showButton = document.getElementById('show');
	
	if (mode == 1){ // Show Case
		algID.style.visibility='hidden';
		caseID.visibility='visible';
		caseImgID.style.visibility='visible';
		showButton.innerHTML='Show Answer';
		}
	else if (mode == 2){ // Show Algorithm
		algID.style.visibility='visible';
		caseID.style.visibility='hidden';
		caseImgID.style.visibility='hidden';
		showButton.innerHTML='Show Answer';
		}
	else { // Show Both
		algID.style.visibility='visible';
		caseID.style.visibility='visible';
		caseImgID.style.visibility='visible';
		showButton.innerHTML='Next';
		}

	algID.innerHTML=stackAlgs[card];
	caseID.innerHTML=stackCases[card];
	caseImgID.src='flashcards/' + currentFolder + "/" + imgList[card] + ".png";
}

function show(){
	var algID = document.getElementById('alg');
	var caseID = document.getElementById('case');
	var caseImgID = document.getElementById('caseimg');
	var showButton = document.getElementById('show');

	if (algID.style.visibility == 'hidden'){
		algID.style.visibility='visible';
		showButton.innerHTML='Next';
		}
	else if (caseID.style.visibility == 'hidden'){
		caseID.style.visibility='visible';
		caseImgID.style.visibility='visible';
		showButton.innerHTML='Next';
		}
	else{
		next();
		}
}

function goto(skipTo){   // maybe use this if we link to each group from the checklist
	
	if (document.getElementById('c'+skipTo).checked == true) {
		card = 1
		while (skipTo > 0) {
			card += currentAlgSet[skipTo-1].length-1;
			skipTo -= 1;
		}
		updateCard();
	}
}

function next(){
	if (document.getElementById('shuffle').checked == false) {
		if (card < cardTotal - 1) {
			card += 1;
			}
		else {
			card = 0;
			}
	}
	else {
		card = Math.floor(Math.random()*cardTotal);
	}
	updateCard();
}

function prev(){
	if (card > 0) {
		card -= 1;
		}
	else {
		card = cardTotal - 1;
		}
	updateCard();
}

function updateView(option) {
    document.getElementById('cardDisplay').style.display = 'none';
    document.getElementById('settingsDisplay').style.display = 'none';
    document.getElementById('detailsDisplay').style.display = 'none';
    document.getElementById(option + 'Display').style.display = 'inline';
}

function selectAllNone() {
	var isNotSelected = false;

	for (i = 0; i < currentAlgSet.length; i++) {
		if (document.getElementById('c' + i).checked == false) {
			isNotSelected = true;
		}
	}
	
	if (isNotSelected == true) { // Select All
		for (i = 0; i < currentAlgSet.length; i++) {
			document.getElementById('c' + i).checked = true;
		}
	}
	else { // Deselect All
		for (i = 0; i < currentAlgSet.length; i++) {
			document.getElementById('c' + i).checked = false;
		}
	}
}

function toggleMode() {
	if (mode == 3) {
		mode = 1;
		document.getElementById('mode1').checked = true;
	}
	else {
		mode += 1;
		document.getElementById('mode' + mode).checked = true;
	}

	updateCard();
}

function toggleRandom() {
	if (document.getElementById('shuffle').checked == false) {
		document.getElementById('shuffle').checked = true;
	} else {
		document.getElementById('shuffle').checked = false;
	}
	updateAlgList();
}

function keyCheck(e) {
	
	evt = e.keyCode || e.charCode;
	
	//window.alert(evt.keyCode);
	
	if (evt == 37) { // Left Arrow
		prev();
	}
	else if (evt == 39) { // Right Arrow
		show();
	}
	else if (evt == 82) { // r
		toggleRandom();
	}
	else if (evt == 65) { // a
		toggleMode();
	}
}

function changeSelect() {

	var hash = String(window.location.hash).slice(1);
	
	if (window.location.hash) {
		document.getElementById('currentSet').selectedIndex = hash;
	}
}

document.addEventListener("keydown", keyCheck, false);
window.addEventListener("load", changeSelect, false);