function colorify(squares) {

	var randomColor = 0;
	var colors = ["#FFFFFF","#FF1010","#FF9000","#FFFF00","#00C000","#0050FF"];
	
	for (var i in squares) {
		randomColor = (Math.floor(Math.random()*6));  //between 0 and 5
		document.getElementById('sq' + squares[i]).style.background=colors[randomColor];
	}
}
