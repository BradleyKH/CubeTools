/*
by Bradley Harris, 2018

Each of the 6 faces on the cube is controlled by an array.
When a side is turned, a set of temporary arrays is created with the updated sticker locations, 
then these values are copied to the main face arrays.
*/

var colorScheme = ["#008000", "#DD0000", "#0000DD", "#FF8000", "#FFFFFF", "#FFFF00"];
var faceA = [];
var faceB = [];
var faceC = [];
var faceD = [];
var faceE = [];
var faceF = [];
var newA = [];
var newB = [];
var newC = [];
var newD = [];
var newE = [];
var newF = [];
var size = 3;

function cubeReset() {

	size = document.getElementById('scrtype').value;
	var maxsize = 0;
	
	switch (parseInt(size)) {
		case 3:
			maxsize = 10;
			break;
		case 4:
			maxsize = 17;
			break;
		case 5:
			maxsize = 26;
			break;
	}
		
	if (size == 2) {
		for (i = 1; i < 10; i++) {
			if ( (i % 2 != 0 ) &&  ( i != 5 ) ) {
				faceA[i]=0;
				faceB[i]=1;
				faceC[i]=2;
				faceD[i]=3;
				faceE[i]=4;
				faceF[i]=5;
			}
		}
	} else {
		for (i = 1; i < maxsize; i++) {
			faceA[i]=0;
			faceB[i]=1;
			faceC[i]=2;
			faceD[i]=3;
			faceE[i]=4;
			faceF[i]=5;
		}
	}
	
cubeUpdate(size);
}

function cubeUpdate(size) {

	var maxsize = 10;
	
	switch (parseInt(size)) {
		case 3:
			maxsize = 10;
			break;
		case 4:
			maxsize = 17;
			break;
		case 5:
			maxsize = 26;
			break;
	}
	
	if (size == 2) {
		for (i = 1; i < 10; i++) {
			if ( (i % 2 != 0 ) && ( i != 5) ) {
				document.getElementById('a'+i).style.background=colorScheme[faceA[i]];
				document.getElementById('b'+i).style.background=colorScheme[faceB[i]];
				document.getElementById('c'+i).style.background=colorScheme[faceC[i]];
				document.getElementById('d'+i).style.background=colorScheme[faceD[i]];
				document.getElementById('e'+i).style.background=colorScheme[faceE[i]];
				document.getElementById('f'+i).style.background=colorScheme[faceF[i]];
			}
		}
	} else {
		for (i = 1; i < maxsize; i++) {
			document.getElementById('a'+i).style.background=colorScheme[faceA[i]];
			document.getElementById('b'+i).style.background=colorScheme[faceB[i]];
			document.getElementById('c'+i).style.background=colorScheme[faceC[i]];
			document.getElementById('d'+i).style.background=colorScheme[faceD[i]];
			document.getElementById('e'+i).style.background=colorScheme[faceE[i]];
			document.getElementById('f'+i).style.background=colorScheme[faceF[i]];
		}
	}
}

function updateTurn() {

	faceA = newA;
	faceB = newB;
	faceC = newC;
	faceD = newD;
	faceE = newE;
	faceF = newF;

}

function turnPrep() {

	newA = faceA.slice(0);
	newB = faceB.slice(0);
	newC = faceC.slice(0);
	newD = faceD.slice(0);
	newE = faceE.slice(0);
	newF = faceF.slice(0);

}

function turnF(size) {

	turnPrep();

	newA[3] = faceA[1];
	newA[9] = faceA[3];
	newA[1] = faceA[7];
	newA[7] = faceA[9];
	newF[3] = faceB[1];
	newF[1] = faceB[7];
	newE[9] = faceD[3];
	newE[7] = faceD[9];
	newB[1] = faceE[7];
	newB[7] = faceE[9];
	newD[3] = faceF[1];
	newD[9] = faceF[3];

	if (size > 2) {
		newA[6] = faceA[2];
		newA[2] = faceA[4];
		newA[8] = faceA[6];
		newA[4] = faceA[8];
		newF[2] = faceB[4];
		newE[8] = faceD[6];
		newB[4] = faceE[8];
		newD[6] = faceF[2];
	}
	
	if (size > 3) {
		newA[16] = faceA[10];
		newA[10] = faceA[11]; 
		newA[13] = faceA[12]; 
		newA[15] = faceA[13]; 
		newA[12] = faceA[14]; 
		newA[14] = faceA[15]; 
		newA[5] = faceA[16]; 
		newA[11] = faceA[5]; 
		newF[10] = faceB[11];
		newE[5] = faceD[16];
		newB[11] = faceE[5];
		newD[16] = faceF[10];	
	}
	
	if (size > 4) {
		newA[20] = faceA[18];
		newA[22] = faceA[19];
		newA[25] = faceA[20];
		newA[19] = faceA[21];
		newA[24] = faceA[22];
		newA[18] = faceA[23];
		newA[21] = faceA[24];
		newA[23] = faceA[25];
		newF[18] = faceB[23];
		newE[25] = faceD[20];
		newB[23] = faceE[25];
		newD[20] = faceF[18];
	}
	
	updateTurn();

}

function turnB(size) {

	turnPrep();

	newC[3] = faceC[1];
	newC[9] = faceC[3];
	newC[1] = faceC[7];
	newC[7] = faceC[9];
	newE[1] = faceB[3];
	newE[3] = faceB[9];
	newF[7] = faceD[1];
	newF[9] = faceD[7];
	newD[7] = faceE[1];
	newD[1] = faceE[3];
	newB[9] = faceF[7];
	newB[3] = faceF[9];

	if (size > 2) {
		newC[6] = faceC[2];
		newC[2] = faceC[4];
		newC[8] = faceC[6];
		newC[4] = faceC[8];
		newE[2] = faceB[6];
		newF[8] = faceD[4];
		newD[4] = faceE[2];
		newB[6] = faceF[8];
	}
	
	if (size > 3) {
		newC[16] = faceC[10];
		newC[10] = faceC[11]; 
		newC[13] = faceC[12]; 
		newC[15] = faceC[13]; 
		newC[12] = faceC[14]; 
		newC[14] = faceC[15]; 
		newC[5] = faceC[16]; 
		newC[11] = faceC[5]; 
		newE[10] = faceB[16];
		newF[5] = faceD[11];
		newD[11] = faceE[10];
		newB[16] = faceF[5];
	}
	
	if (size > 4) {
		newC[20] = faceC[18];
		newC[22] = faceC[19];
		newC[25] = faceC[20];
		newC[19] = faceC[21];
		newC[24] = faceC[22];
		newC[18] = faceC[23];
		newC[21] = faceC[24];
		newC[23] = faceC[25];
		newE[18] = faceB[20];
		newF[25] = faceD[23];
		newD[23] = faceE[18];
		newB[20] = faceF[25];
	}
	
	updateTurn();

}

function turnL(size) {

	turnPrep();

	newD[3] = faceD[1];
	newD[9] = faceD[3];
	newD[1] = faceD[7];
	newD[7] = faceD[9];
	newF[1] = faceA[1];
	newF[7] = faceA[7];
	newE[7] = faceC[3];
	newE[1] = faceC[9];
	newA[1] = faceE[1];
	newA[7] = faceE[7];
	newC[9] = faceF[1];
	newC[3] = faceF[7];

	if (size > 2) {
		newD[6] = faceD[2];
		newD[2] = faceD[4];
		newD[8] = faceD[6];
		newD[4] = faceD[8];
		newF[4] = faceA[4];
		newE[4] = faceC[6];
		newA[4] = faceE[4];
		newC[6] = faceF[4];
	}
	
	if (size > 3) {
		newD[16] = faceD[10];
		newD[10] = faceD[11]; 
		newD[13] = faceD[12]; 
		newD[15] = faceD[13]; 
		newD[12] = faceD[14]; 
		newD[14] = faceD[15]; 
		newD[5] = faceD[16]; 
		newD[11] = faceD[5]; 
		newF[11] = faceA[11];
		newE[11] = faceC[16];
		newA[11] = faceE[11];
		newC[16] = faceF[11];
	}
	
	if (size > 4) {
		newD[20] = faceD[18];
		newD[22] = faceD[19];
		newD[25] = faceD[20];
		newD[19] = faceD[21];
		newD[24] = faceD[22];
		newD[18] = faceD[23];
		newD[21] = faceD[24];
		newD[23] = faceD[25];
		newF[23] = faceA[23];
		newA[23] = faceE[23];
		newE[23] = faceC[20];
		newC[20] = faceF[23];
	}
	
	updateTurn();

}

function turnR(size) {

	turnPrep();

	newB[3] = faceB[1];
	newB[9] = faceB[3];
	newB[1] = faceB[7];
	newB[7] = faceB[9];
	newF[3] = faceC[7];
	newF[9] = faceC[1];
	newE[3] = faceA[3];
	newE[9] = faceA[9];
	newC[7] = faceE[3];
	newC[1] = faceE[9];
	newA[3] = faceF[3];
	newA[9] = faceF[9];

	if (size > 2) {
		newB[6] = faceB[2];
		newB[2] = faceB[4];
		newB[8] = faceB[6];
		newB[4] = faceB[8];	
		newF[6] = faceC[4];	
		newE[6] = faceA[6];	
		newC[4] = faceE[6];	
		newA[6] = faceF[6];
	}
	
	if (size > 3) {
		newB[16] = faceB[10];
		newB[10] = faceB[11]; 
		newB[13] = faceB[12]; 
		newB[15] = faceB[13]; 
		newB[12] = faceB[14]; 
		newB[14] = faceB[15]; 
		newB[5] = faceB[16]; 
		newB[11] = faceB[5]; 
		newE[16] = faceA[16];
		newF[16] = faceC[11];
		newC[11] = faceE[16];
		newA[16] = faceF[16];
	}
	
	if (size > 4) {
		newB[20] = faceB[18];
		newB[22] = faceB[19];
		newB[25] = faceB[20];
		newB[19] = faceB[21];
		newB[24] = faceB[22];
		newB[18] = faceB[23];
		newB[21] = faceB[24];
		newB[23] = faceB[25];
		newE[20] = faceA[20];
		newF[20] = faceC[23];
		newC[23] = faceE[20];
		newA[20] = faceF[20];
	}
	
	updateTurn();

}

function turnU(size) {

	turnPrep();

	newE[3] = faceE[1];
	newE[9] = faceE[3];
	newE[1] = faceE[7];
	newE[7] = faceE[9];
	newB[1] = faceC[1];
	newB[3] = faceC[3];
	newD[1] = faceA[1];
	newD[3] = faceA[3];
	newA[1] = faceB[1];
	newA[3] = faceB[3];
	newC[1] = faceD[1];
	newC[3] = faceD[3];

	if (size > 2) {
		newE[6] = faceE[2];
		newE[2] = faceE[4];
		newE[8] = faceE[6];
		newE[4] = faceE[8];
		newB[2] = faceC[2];
		newD[2] = faceA[2];
		newA[2] = faceB[2];
		newC[2] = faceD[2];
	}
	
	if (size > 3) {
		newE[16] = faceE[10];
		newE[10] = faceE[11]; 
		newE[13] = faceE[12]; 
		newE[15] = faceE[13]; 
		newE[12] = faceE[14]; 
		newE[14] = faceE[15]; 
		newE[5] = faceE[16]; 
		newE[11] = faceE[5]; 
		newD[10] = faceA[10];
		newC[10] = faceD[10];
		newB[10] = faceC[10]; 
		newA[10] = faceB[10]; 
	}
	
	if (size > 4) {
		newE[20] = faceE[18];
		newE[22] = faceE[19];
		newE[25] = faceE[20];
		newE[19] = faceE[21];
		newE[24] = faceE[22];
		newE[18] = faceE[23];
		newE[21] = faceE[24];
		newE[23] = faceE[25];
		newD[18] = faceA[18];
		newC[18] = faceD[18];
		newB[18] = faceC[18];
		newA[18] = faceB[18];
	}
	
	updateTurn();

}

function turnD(size) {

	turnPrep();

	newF[3] = faceF[1];
	newF[9] = faceF[3];
	newF[1] = faceF[7];
	newF[7] = faceF[9];
	newD[7] = faceC[7];
	newD[9] = faceC[9];
	newB[7] = faceA[7];
	newB[9] = faceA[9];
	newC[7] = faceB[7];
	newC[9] = faceB[9];
	newA[7] = faceD[7];
	newA[9] = faceD[9];

	if (size > 2) {
		newF[6] = faceF[2];
		newF[2] = faceF[4];
		newF[8] = faceF[6];
		newF[4] = faceF[8];
		newD[8] = faceC[8];
		newB[8] = faceA[8];
		newC[8] = faceB[8];
		newA[8] = faceD[8];	
	}
	
	if (size > 3) {
		newF[16] = faceF[10];
		newF[10] = faceF[11]; 
		newF[13] = faceF[12]; 
		newF[15] = faceF[13]; 
		newF[12] = faceF[14]; 
		newF[14] = faceF[15]; 
		newF[5] = faceF[16]; 
		newF[11] = faceF[5]; 
		newB[5] = faceA[5];
		newC[5] = faceB[5]; 
		newD[5] = faceC[5]; 
		newA[5] = faceD[5]; 
	}
	
	if (size > 4) {
		newF[20] = faceF[18];
		newF[22] = faceF[19];
		newF[25] = faceF[20];
		newF[19] = faceF[21];
		newF[24] = faceF[22];
		newF[18] = faceF[23];
		newF[21] = faceF[24];
		newF[23] = faceF[25];
		newB[25] = faceA[25];
		newC[25] = faceB[25];
		newD[25] = faceC[25];
		newA[25] = faceD[25];
	}
	
	updateTurn();

}

function turnf(size) {
	if (size > 3) {
		turnF(size);
	}
	
	turnPrep();
		
	if (size == 4) {
		newF[6] = faceB[2];
		newF[13] = faceB[12];
		newF[12] = faceB[14];
		newF[11] = faceB[5];
		newE[16] = faceD[10];
		newE[15] = faceD[13];
		newE[14] = faceD[15];
		newE[4] = faceD[8];
		newB[2] = faceE[4];
		newB[12] = faceE[14];
		newB[14] = faceE[15];
		newB[5] = faceE[16];
		newD[10] = faceF[11];
		newD[13] = faceF[12];
		newD[15] = faceF[13];
		newD[8] = faceF[6];
	}
	
	else if (size == 5) {
		newF[20] = faceB[18];
		newF[13] = faceB[12];
		newF[19] = faceB[21];
		newF[12] = faceB[14];
		newF[11] = faceB[5];
		newE[16] = faceD[10];
		newE[15] = faceD[13];
		newE[24] = faceD[22];
		newE[14] = faceD[15];
		newE[23] = faceD[25];
		newB[18] = faceE[23];
		newB[12] = faceE[14];
		newB[21] = faceE[24];
		newB[14] = faceE[15];
		newB[5] = faceE[16];
		newD[10] = faceF[11];
		newD[13] = faceF[12];
		newD[22] = faceF[19];
		newD[15] = faceF[13];
		newD[25] = faceF[20];
	}
	
	updateTurn();
}

function turnb(size) {
	if (size > 3) {
		turnB(size);
	}
	
	turnPrep();
		
	if (size == 4) {
		newE[11] = faceB[10];
		newE[12] = faceB[13];
		newE[13] = faceB[15];
		newE[6] = faceB[8];
		newD[5] = faceE[11];
		newD[14] = faceE[12];
		newD[12] = faceE[13];
		newD[2] = faceE[6];
		newF[4] = faceD[2];
		newF[14] = faceD[12];
		newF[15] = faceD[14];
		newF[16] = faceD[5];
		newB[8] = faceF[4];
		newB[15] = faceF[14];
		newB[13] = faceF[15];
		newB[10] = faceF[16];
	}
	
	else if (size == 5) {
		newE[11] = faceB[10];
		newE[12] = faceB[13];
		newE[19] = faceB[22];
		newE[13] = faceB[15];
		newE[20] = faceB[25];
		newF[23] = faceD[18];
		newF[14] = faceD[12];
		newF[24] = faceD[21];
		newF[15] = faceD[14];
		newF[16] = faceD[5];
		newD[5] = faceE[11];
		newD[14] = faceE[12];
		newD[21] = faceE[19];
		newD[12] = faceE[13];
		newD[18] = faceE[20];
		newB[25] = faceF[23];
		newB[15] = faceF[14];
		newB[22] = faceF[24];
		newB[13] = faceF[15];
		newB[10] = faceF[16];
	}
	
	updateTurn();
}

function turnl(size) {
	if (size > 3) {
		turnL(size);
	}
		
	turnPrep();
	
	if (size == 4) {
		newF[2] = faceA[2];
		newF[12] = faceA[12];
		newF[14] = faceA[14];
		newF[5] = faceA[5];
		newA[2] = faceE[2];
		newA[12] = faceE[12];
		newA[14] = faceE[14];
		newA[5] = faceE[5];
		newE[5] = faceC[10];
		newE[14] = faceC[13];
		newE[12] = faceC[15];
		newE[2] = faceC[8];
		newC[8] = faceF[2];
		newC[15] = faceF[12];
		newC[13] = faceF[14];
		newC[10] = faceF[5];
	}
	
	else if (size == 5) {
		newF[18] = faceA[18];
		newF[12] = faceA[12];
		newF[21] = faceA[21];
		newF[14] = faceA[14];
		newF[5] = faceA[5];
		newE[5] = faceC[10];
		newE[14] = faceC[13];
		newE[21] = faceC[22];
		newE[12] = faceC[15];
		newE[18] = faceC[25];
		newA[18] = faceE[18];
		newA[12] = faceE[12];
		newA[21] = faceE[21];
		newA[14] = faceE[14];
		newA[5] = faceE[5];
		newC[25] = faceF[18];
		newC[15] = faceF[12];
		newC[22] = faceF[21];
		newC[13] = faceF[14];
		newC[10] = faceF[5];
	}
	
	updateTurn();
}

function turnr(size) {
	if (size > 3) {
		turnR(size);
	}
	
	turnPrep();

	if (size == 4) {
		newE[10] = faceA[10];
		newE[13] = faceA[13];
		newE[15] = faceA[15];
		newE[8] = faceA[8];
		newA[10] = faceF[10];
		newA[13] = faceF[13];
		newA[15] = faceF[15];
		newA[8] = faceF[8];
		newC[5] = faceE[10];
		newC[14] = faceE[13];
		newC[12] = faceE[15];
		newC[2] = faceE[8];
		newF[8] = faceC[2];
		newF[15] = faceC[12];
		newF[13] = faceC[14];
		newF[10] = faceC[5];
	}
	
	else if (size == 5) {
		newE[10] = faceA[10];
		newE[13] = faceA[13];
		newE[22] = faceA[22];
		newE[15] = faceA[15];
		newE[25] = faceA[25];
		newF[25] = faceC[18];
		newF[15] = faceC[12];
		newF[22] = faceC[21];
		newF[13] = faceC[14];
		newF[10] = faceC[5];
		newC[5] = faceE[10];
		newC[14] = faceE[13];
		newC[21] = faceE[22];
		newC[12] = faceE[15];
		newC[18] = faceE[25];
		newA[10] = faceF[10];
		newA[13] = faceF[13];
		newA[22] = faceF[22];
		newA[15] = faceF[15];
		newA[25] = faceF[25];
	}
	
	updateTurn();
}

function turnu(size) {
	if (size > 3) {
		turnU(size);
	}
	
	turnPrep();

	if (size == 4) {
		newD[11] = faceA[11];
		newD[12] = faceA[12];
		newD[13] = faceA[13];
		newD[6] = faceA[6];
		newC[11] = faceD[11];
		newC[12] = faceD[12];
		newC[13] = faceD[13];
		newC[6] = faceD[6];
		newB[11] = faceC[11];
		newB[12] = faceC[12];
		newB[13] = faceC[13];
		newB[6] = faceC[6];
		newA[11] = faceB[11];
		newA[12] = faceB[12];
		newA[13] = faceB[13];
		newA[6] = faceB[6];
	}
	
	else if (size == 5) {
		newD[11] = faceA[11];
		newD[12] = faceA[12];
		newD[19] = faceA[19];
		newD[13] = faceA[13];
		newD[20] = faceA[20];
		newC[11] = faceD[11];
		newC[12] = faceD[12];
		newC[19] = faceD[19];
		newC[13] = faceD[13];
		newC[20] = faceD[20];
		newB[11] = faceC[11];
		newB[12] = faceC[12];
		newB[19] = faceC[19];
		newB[13] = faceC[13];
		newB[20] = faceC[20];
		newA[11] = faceB[11];
		newA[12] = faceB[12];
		newA[19] = faceB[19];
		newA[13] = faceB[13];
		newA[20] = faceB[20];
	}
	
	updateTurn();
}

function turnd(size) {
	if (size > 3) {
		turnD(size);
	}
	
	turnPrep();

	if (size == 4) {
		newB[4] = faceA[4];
		newB[14] = faceA[14];
		newB[15] = faceA[15];
		newB[16] = faceA[16];
		newC[4] = faceB[4];
		newC[14] = faceB[14];
		newC[15] = faceB[15];
		newC[16] = faceB[16];
		newD[4] = faceC[4];
		newD[14] = faceC[14];
		newD[15] = faceC[15];
		newD[16] = faceC[16];
		newA[4] = faceD[4];
		newA[14] = faceD[14];
		newA[15] = faceD[15];
		newA[16] = faceD[16];
	}
	
	else if (size == 5) {
		newB[23] = faceA[23];
		newB[14] = faceA[14];
		newB[24] = faceA[24];
		newB[15] = faceA[15];
		newB[16] = faceA[16];
		newC[23] = faceB[23];
		newC[14] = faceB[14];
		newC[24] = faceB[24];
		newC[15] = faceB[15];
		newC[16] = faceB[16];
		newD[23] = faceC[23];
		newD[14] = faceC[14];
		newD[24] = faceC[24];
		newD[15] = faceC[15];
		newD[16] = faceC[16];
		newA[23] = faceD[23];
		newA[14] = faceD[14];
		newA[24] = faceD[24];
		newA[15] = faceD[15];
		newA[16] = faceD[16];
	}
	
	updateTurn();
}

function turn(size, side) {

	switch(side) {
		case "F'":
			turnF(size);
		case "F2":
			turnF(size);
		case "F":
			turnF(size);
			break;
		case "B'":
			turnB(size);
		case "B2":
			turnB(size);
		case "B":
			turnB(size);
			break;
		case "L'":
			turnL(size);
		case "L2":
			turnL(size);
		case "L":
			turnL(size);
			break;
		case "R'":
			turnR(size);
		case "R2":
			turnR(size);
		case "R":
			turnR(size);
			break;
		case "U'":
			turnU(size);
		case "U2":
			turnU(size);
		case "U":
			turnU(size);
			break;
		case "D'":
			turnD(size);
		case "D2":
			turnD(size);
		case "D":
			turnD(size);
			break;
		case "f'":
			turnf(size);
		case "f2":
			turnf(size);
		case "f":
			turnf(size);
			break;
		case "b'":
			turnb(size);
		case "b2":
			turnb(size);
		case "b":
			turnb(size);
			break;
		case "l'":
			turnl(size);
		case "l2":
			turnl(size);
		case "l":
			turnl(size);
			break;
		case "r'":
			turnr(size);
		case "r2":
			turnr(size);
		case "r":
			turnr(size);
			break;
		case "u'":
			turnu(size);
		case "u2":
			turnu(size);
		case "u":
			turnu(size);
			break;
		case "d'":
			turnd(size);
		case "d2":
			turnd(size);
		case "d":
			turnd(size);
			break;
	}
}

function diagramScramble() {

size = document.getElementById('scrtype').value;

	cubeReset();

	for (i = 0; i < scramble.length; i++) {
		turn(size, scramble[i]);
		}

	cubeUpdate(size);

}

function makeDiagram() {
size = document.getElementById('scrtype').value;

	if (size == 4) {
		document.getElementById('cubediagram').innerHTML='<table class=\"diagram\"><tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"e1\"></td><td id=\"e2\"></td><td id=\"e10\"></td><td id=\"e3\"></td></tr>' +
		'<tr><td id=\"e11\"></td><td id=\"e12\"></td><td id=\"e13\"></td><td id=\"e6\"></td></tr>' +
		'<tr><td id=\"e4\"></td><td id=\"e14\"></td><td id=\"e15\"></td><td id=\"e16\"></td></tr>' +
		'<tr><td id=\"e7\"></td><td id=\"e5\"></td><td id=\"e8\"></td><td id=\"e9\"></td></tr></table></td>' +
		'<td></td><td></td></tr><tr><td>' +
		'<table class=\"face\"><tr><td id=\"d1\"></td><td id=\"d2\"></td><td id=\"d10\"></td><td id=\"d3\"></td></tr>' +
		'<tr><td id=\"d11\"></td><td id=\"d12\"></td><td id=\"d13\"></td><td id=\"d6\"></td></tr>' +
		'<tr><td id=\"d4\"></td><td id=\"d14\"></td><td id=\"d15\"></td><td id=\"d16\"></td></tr>' +
		'<tr><td id=\"d7\"></td><td id=\"d5\"></td><td id=\"d8\"></td><td id=\"d9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"a1\"></td><td id=\"a2\"></td><td id=\"a10\"></td><td id=\"a3\"></td></tr>' +
		'<tr><td id=\"a11\"></td><td id=\"a12\"></td><td id=\"a13\"></td><td id=\"a6\"></td></tr>' +
		'<tr><td id=\"a4\"></td><td id=\"a14\"></td><td id=\"a15\"></td><td id=\"a16\"></td></tr>' +
		'<tr><td id=\"a7\"></td><td id=\"a5\"></td><td id=\"a8\"></td><td id=\"a9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"b1\"></td><td id=\"b2\"></td><td id=\"b10\"></td><td id=\"b3\"></td></tr>' +
		'<tr><td id=\"b11\"></td><td id=\"b12\"></td><td id=\"b13\"></td><td id=\"b6\"></td></tr>' +
		'<tr><td id=\"b4\"></td><td id=\"b14\"></td><td id=\"b15\"></td><td id=\"b16\"></td></tr>' +
		'<tr><td id=\"b7\"></td><td id=\"b5\"></td><td id=\"b8\"></td><td id=\"b9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"c1\"></td><td id=\"c2\"></td><td id=\"c10\"></td><td id=\"c3\"></td></tr>' +
		'<tr><td id=\"c11\"></td><td id=\"c12\"></td><td id=\"c13\"></td><td id=\"c6\"></td></tr>' +
		'<tr><td id=\"c4\"></td><td id=\"c14\"></td><td id=\"c15\"></td><td id=\"c16\"></td></tr>' +
		'<tr><td id=\"c7\"></td><td id=\"c5\"></td><td id=\"c8\"></td><td id=\"c9\"></td></tr></table></td></tr>' +
		'<tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"f1\"></td><td id=\"f2\"></td><td id=\"f10\"></td><td id=\"f3\"></td></tr>' +
		'<tr><td id=\"f11\"></td><td id=\"f12\"></td><td id=\"f13\"></td><td id=\"f6\"></td></tr>' +
		'<tr><td id=\"f4\"></td><td id=\"f14\"></td><td id=\"f15\"></td><td id=\"f16\"></td></tr>' +
		'<tr><td id=\"f7\"></td><td id=\"f5\"></td><td id=\"f8\"></td><td id=\"f9\"></td></tr></table></td>' +
		'<td></td><td></td></tr>' +
		'<tr><th colspan=\"4\">(top white, front green)</th></tr></table>';
	}
	
	else if (size == 5) {
		document.getElementById('cubediagram').innerHTML='<table class=\"diagram\"><tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"e1\"></td><td id=\"e18\"></td><td id=\"e2\"></td><td id=\"e10\"></td><td id=\"e3\"></td></tr>' +
		'<tr><td id=\"e11\"></td><td id=\"e12\"></td><td id=\"e19\"></td><td id=\"e13\"></td><td id=\"e20\"></td></tr>' +
		'<tr><td id=\"e4\"></td><td id=\"e21\"></td><td id=\"e17\"></td><td id=\"e22\"></td><td id=\"e6\"></td></tr>' +
		'<tr><td id=\"e23\"></td><td id=\"e14\"></td><td id=\"e24\"></td><td id=\"e15\"></td><td id=\"e16\"></td></tr>' +
		'<tr><td id=\"e7\"></td><td id=\"e5\"></td><td id=\"e8\"></td><td id=\"e25\"></td><td id=\"e9\"></td></tr></table></td>' +
		'<td></td><td></td></tr><tr><td>' +
		'<table class=\"face\"><tr><td id=\"d1\"></td><td id=\"d18\"></td><td id=\"d2\"></td><td id=\"d10\"></td><td id=\"d3\"></td></tr>' +
		'<tr><td id=\"d11\"></td><td id=\"d12\"></td><td id=\"d19\"></td><td id=\"d13\"></td><td id=\"d20\"></td></tr>' +
		'<tr><td id=\"d4\"></td><td id=\"d21\"></td><td id=\"d17\"></td><td id=\"d22\"></td><td id=\"d6\"></td></tr>' +
		'<tr><td id=\"d23\"></td><td id=\"d14\"></td><td id=\"d24\"></td><td id=\"d15\"></td><td id=\"d16\"></td></tr>' +
		'<tr><td id=\"d7\"></td><td id=\"d5\"></td><td id=\"d8\"></td><td id=\"d25\"></td><td id=\"d9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"a1\"></td><td id=\"a18\"></td><td id=\"a2\"></td><td id=\"a10\"></td><td id=\"a3\"></td></tr>' +
		'<tr><td id=\"a11\"></td><td id=\"a12\"></td><td id=\"a19\"></td><td id=\"a13\"></td><td id=\"a20\"></td></tr>' +
		'<tr><td id=\"a4\"></td><td id=\"a21\"></td><td id=\"a17\"></td><td id=\"a22\"></td><td id=\"a6\"></td></tr>' +
		'<tr><td id=\"a23\"></td><td id=\"a14\"></td><td id=\"a24\"></td><td id=\"a15\"></td><td id=\"a16\"></td></tr>' +
		'<tr><td id=\"a7\"></td><td id=\"a5\"></td><td id=\"a8\"></td><td id=\"a25\"></td><td id=\"a9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"b1\"></td><td id=\"b18\"></td><td id=\"b2\"></td><td id=\"b10\"></td><td id=\"b3\"></td></tr>' +
		'<tr><td id=\"b11\"></td><td id=\"b12\"></td><td id=\"b19\"></td><td id=\"b13\"></td><td id=\"b20\"></td></tr>' +
		'<tr><td id=\"b4\"></td><td id=\"b21\"></td><td id=\"b17\"></td><td id=\"b22\"></td><td id=\"b6\"></td></tr>' +
		'<tr><td id=\"b23\"></td><td id=\"b14\"></td><td id=\"b24\"></td><td id=\"b15\"></td><td id=\"b16\"></td></tr>' +
		'<tr><td id=\"b7\"></td><td id=\"b5\"></td><td id=\"b8\"></td><td id=\"b25\"></td><td id=\"b9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"c1\"></td><td id=\"c18\"></td><td id=\"c2\"></td><td id=\"c10\"></td><td id=\"c3\"></td></tr>' +
		'<tr><td id=\"c11\"></td><td id=\"c12\"></td><td id=\"c19\"></td><td id=\"c13\"></td><td id=\"c20\"></td></tr>' +
		'<tr><td id=\"c4\"></td><td id=\"c21\"></td><td id=\"c17\"></td><td id=\"c22\"></td><td id=\"c6\"></td></tr>' +
		'<tr><td id=\"c23\"></td><td id=\"c14\"></td><td id=\"c24\"></td><td id=\"c15\"></td><td id=\"c16\"></td></tr>' +
		'<tr><td id=\"c7\"></td><td id=\"c5\"></td><td id=\"c8\"></td><td id=\"c25\"></td><td id=\"c9\"></td></tr></table>' +
		'</td></tr><tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"f1\"></td><td id=\"f18\"></td><td id=\"f2\"></td><td id=\"f10\"></td><td id=\"f3\"></td></tr>' +
		'<tr><td id=\"f11\"></td><td id=\"f12\"></td><td id=\"f19\"></td><td id=\"f13\"></td><td id=\"f20\"></td></tr>' +
		'<tr><td id=\"f4\"></td><td id=\"f21\"></td><td id=\"f17\"></td><td id=\"f22\"></td><td id=\"f6\"></td></tr>' +
		'<tr><td id=\"f23\"></td><td id=\"f14\"></td><td id=\"f24\"></td><td id=\"f15\"></td><td id=\"f16\"></td></tr>' +
		'<tr><td id=\"f7\"></td><td id=\"f5\"></td><td id=\"f8\"></td><td id=\"f25\"></td><td id=\"f9\"></td></tr></table>' +
		'</td><td></td><td></td></tr><tr><th colspan=\"4\">(top white, front green)</th></tr></table>';
	}
	
	else if (size == 2) {
		document.getElementById('cubediagram').innerHTML='<table class=\"diagram\"><tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"e1\"></td><td id=\"e3\"></td></tr>' +
		'<tr><td id=\"e7\"></td><td id=\"e9\"></td></tr></table></td>' +
		'<td></td><td></td></tr><tr><td>' +
		'<table class=\"face\"><tr><td id=\"d1\"></td><td id=\"d3\"></td></tr>' +
		'<tr><td id=\"d7\"></td><td id=\"d9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"a1\"></td><td id=\"a3\"></td></tr>' +
		'<tr><td id=\"a7\"></td><td id=\"a9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"b1\"></td><td id=\"b3\"></td></tr>' +
		'<tr><td id=\"b7\"></td><td id=\"b9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"c1\"></td><td id=\"c3\"></td></tr>' +
		'<tr><td id=\"c7\"></td><td id=\"c9\"></td></tr></table></td></tr>' +
		'<tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"f1\"></td><td id=\"f3\"></td></tr>' +
		'<tr><td id=\"f7\"></td><td id=\"f9\"></td></tr></table></td>' +
		'<td></td><td></td></tr>' +
		'<tr><th colspan=\"4\">(top white, front green)</th></tr></table>';
	}
	
	else {
		document.getElementById('cubediagram').innerHTML='<table class=\"diagram\"><tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"e1\"></td><td id=\"e2\"></td><td id=\"e3\"></td></tr>' +
		'<tr><td id=\"e4\"></td><td id=\"e5\"></td><td id=\"e6\"></td></tr>' +
		'<tr><td id=\"e7\"></td><td id=\"e8\"></td><td id=\"e9\"></td></tr></table></td>' +
		'<td></td><td></td></tr><tr><td>' +
		'<table class=\"face\"><tr><td id=\"d1\"></td><td id=\"d2\"></td><td id=\"d3\"></td></tr>' +
		'<tr><td id=\"d4\"></td><td id=\"d5\"></td><td id=\"d6\"></td></tr>' +
		'<tr><td id=\"d7\"></td><td id=\"d8\"></td><td id=\"d9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"a1\"></td><td id=\"a2\"></td><td id=\"a3\"></td></tr>' +
		'<tr><td id=\"a4\"></td><td id=\"a5\"></td><td id=\"a6\"></td></tr>' +
		'<tr><td id=\"a7\"></td><td id=\"a8\"></td><td id=\"a9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"b1\"></td><td id=\"b2\"></td><td id=\"b3\"></td></tr>' +
		'<tr><td id=\"b4\"></td><td id=\"b5\"></td><td id=\"b6\"></td></tr>' +
		'<tr><td id=\"b7\"></td><td id=\"b8\"></td><td id=\"b9\"></td></tr></table></td><td>' +
		'<table class=\"face\"><tr><td id=\"c1\"></td><td id=\"c2\"></td><td id=\"c3\"></td></tr>' +
		'<tr><td id=\"c4\"></td><td id=\"c5\"></td><td id=\"c6\"></td></tr>' +
		'<tr><td id=\"c7\"></td><td id=\"c8\"></td><td id=\"c9\"></td></tr></table></td></tr>' +
		'<tr><td></td><td>' +
		'<table class=\"face\"><tr><td id=\"f1\"></td><td id=\"f2\"></td><td id=\"f3\"></td></tr>' +
		'<tr><td id=\"f4\"></td><td id=\"f5\"></td><td id=\"f6\"></td></tr>' +
		'<tr><td id=\"f7\"></td><td id=\"f8\"></td><td id=\"f9\"></td></tr></table></td>' +
		'<td></td><td></td></tr>' +
		'<tr><th colspan=\"4\">(top white, front green)</th></tr></table>';
	}
}