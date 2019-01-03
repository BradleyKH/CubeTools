function colorify(squares) {

	let randomColor = 0;
	const colors = ["#FFFFFF","#FF1010","#FF9000","#FFFF00","#00C000","#0050FF"];
	
	for (let i in squares) {
		randomColor = (Math.floor(Math.random()*6));  // between 0 and 5
		document.getElementById('sq' + squares[i]).style.background = colors[randomColor];
	}
}
