let images = []

function preload() {
	for (let i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image();
		images[i].src = preload.arguments[i];
	}
}

function loadImages() {
	preload(
		"tutorials/notation/b.png",
		"tutorials/notation/b2.png",
		"tutorials/notation/bp.png",
		"tutorials/notation/bw.png",
		"tutorials/notation/bw2.png",
		"tutorials/notation/bwp.png",
		"tutorials/notation/d.png",
		"tutorials/notation/d2.png",
		"tutorials/notation/dp.png",
		"tutorials/notation/dw.png",
		"tutorials/notation/dw2.png",
		"tutorials/notation/dwp.png",
		"tutorials/notation/e.png",
		"tutorials/notation/e2.png",
		"tutorials/notation/ep.png",
		"tutorials/notation/f.png",
		"tutorials/notation/f2.png",
		"tutorials/notation/fp.png",
		"tutorials/notation/fw.png",
		"tutorials/notation/fw2.png",
		"tutorials/notation/fwp.png",
		"tutorials/notation/l.png",
		"tutorials/notation/l2.png",
		"tutorials/notation/lp.png",
		"tutorials/notation/lw.png",
		"tutorials/notation/lw2.png",
		"tutorials/notation/lwp.png",
		"tutorials/notation/m.png",
		"tutorials/notation/m2.png",
		"tutorials/notation/mp.png",
		"tutorials/notation/r.png",
		"tutorials/notation/r2.png",
		"tutorials/notation/rp.png",
		"tutorials/notation/rw.png",
		"tutorials/notation/rwp.png",
		"tutorials/notation/s.png",
		"tutorials/notation/s2.png",
		"tutorials/notation/sp.png",
		"tutorials/notation/u.png",
		"tutorials/notation/u2.png",
		"tutorials/notation/up.png",
		"tutorials/notation/uw.png",
		"tutorials/notation/uw2.png",
		"tutorials/notation/uwp.png",
		"tutorials/notation/x.png",
		"tutorials/notation/x2.png",
		"tutorials/notation/xp.png",
		"tutorials/notation/y.png",
		"tutorials/notation/y2.png",
		"tutorials/notation/yp.png",
		"tutorials/notation/z.png",
		"tutorials/notation/z2.png",
		"tutorials/notation/zp.png",
	);
}

function turn(side) {
	if (side == 'start') {
		document.getElementById('diagram').src = "tutorials/notation/" + side + ".png";
		document.getElementById('move').innerHTML = '';
	} else {
		document.getElementById('diagram').src = "tutorials/notation/" + side + ".png";
		document.getElementById('move').innerHTML = side.toUpperCase();
	}
}

function turnp(side) {
	document.getElementById('diagram').src = "tutorials/notation/" + side + "p.png";
	document.getElementById('move').innerHTML = side.toUpperCase() + "&prime;";
}

function turn2(side) {
	document.getElementById('diagram').src = "tutorials/notation/" + side + "2.png";
	document.getElementById('move').innerHTML = side.toUpperCase() + "2";
}

function turnw(side) {
	if (side == 'start') {
		document.getElementById('diagram2').src = "tutorials/notation/" + side + ".png";
		document.getElementById('move2').innerHTML = '';
	} else {
		document.getElementById('diagram2').src = "tutorials/notation/" + side + "w.png";
		document.getElementById('move2').innerHTML = side;
	}
}

function turnwp(side) {
	document.getElementById('diagram2').src = "tutorials/notation/" + side + "wp.png";
	document.getElementById('move2').innerHTML = side + "&prime;";
}

function turnw2(side) {
	document.getElementById('diagram2').src = "tutorials/notation/" + side + "w2.png";
	document.getElementById('move2').innerHTML = side + "2";
}

function turnslice(slice) {
	if (slice == 'start') {
		document.getElementById('diagram3').src = "tutorials/notation/" + slice + ".png";
		document.getElementById('move3').innerHTML = '';
	} else {
		document.getElementById('diagram3').src = "tutorials/notation/" + slice + ".png";
		document.getElementById('move3').innerHTML = slice.toUpperCase();
	}
}

function turnslicep(slice) {
	document.getElementById('diagram3').src = "tutorials/notation/" + slice + "p.png";
	document.getElementById('move3').innerHTML = slice.toUpperCase()  + "&prime;";
}

function turnslice2(slice) {
	document.getElementById('diagram3').src = "tutorials/notation/" + slice + "2.png";
	document.getElementById('move3').innerHTML = slice.toUpperCase()  + "2";
}

function turncube(axis) {
	if (axis == 'start') {
		document.getElementById('diagram4').src = "tutorials/notation/" + axis + ".png";
		document.getElementById('move4').innerHTML = '';
	} else {
		document.getElementById('diagram4').src = "tutorials/notation/" + axis + ".png";
		document.getElementById('move4').innerHTML = axis;
	}
}

function turncubep(axis) {
	document.getElementById('diagram4').src = "tutorials/notation/" + axis + "p.png";
	document.getElementById('move4').innerHTML = axis + "&prime;";
}

window.addEventListener("load", loadImages, false);