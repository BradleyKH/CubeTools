function toggleNavbar() {
  var nav = document.getElementById('navbar');
  var mains = document.getElementsByTagName("main");

  if (nav.style.display == '') {
    nav.style.display = 'block';
    mains[0].style.display = 'none';
  } else {
    nav.style.display = '';
    mains[0].style.display = 'block';       
  }
}

function hideSubs() {
  document.getElementById('tutorials').style.display='none';
  document.getElementById('flashcards').style.display='none';
}

function showMenu(e) {
  hideSubs();
  document.getElementById(e).style.display='inline-block';
}

function hideMenu(e) {
  document.getElementById(e).style.display='none';
}

var code = '';
code += '<span class="menuButton" onclick="toggleNavbar();">&#9776;</span>';
code += '<a href="index.html" class="mobiletitle smallonly">CUBE TOOLS</a>';
code += '<div class="navbar" id="navbar">';
code += '<table class="smallcube largeonly">';
code += '<tr>';
code += '<td id="sq1" onmouseover="colorify(\'1\');"></td>';
code += '<td id="sq2" onmouseover="colorify(\'2\');"></td>';
code += '<td id="sq3" onmouseover="colorify(\'3\');"></td>';
code += '</tr>';
code += '<tr>';
code += '<td id="sq4" onmouseover="colorify(\'4\');"></td>';
code += '<td id="sq5" onmouseover="colorify(\'5\');"></td>';
code += '<td id="sq6" onmouseover="colorify(\'6\');"></td>';
code += '</tr>';
code += '<tr>';
code += '<td id="sq7" onmouseover="colorify(\'7\');"></td>';
code += '<td id="sq8" onmouseover="colorify(\'8\');"></td>';
code += '<td id="sq9" onmouseover="colorify(\'9\');"></td>';
code += '</tr>';
code += '</table>';
code += '<a href="index.html" class="title largeonly">CUBE TOOLS</a>';
code += '<span class="spacer" onmouseover="hideSubs();"></span>';
code += '    <ul class="nav">';
code += '     <li onmouseover=\"showMenu(\'tutorials\')\">';
code += '       <nobr><a href="tutorials.html">Tutorials <img src="images/drop.png" class="drop"></a></nobr>';
code += '       <div class="submenu" id="tutorials" onmouseout="hideMenu(\'tutorials\')">';
code += '         <ul class="subnav">';
code += '           <a href="notation.html"><li>&emsp; Notation</li></a>';
code += '           <a href="triggers.html"><li>&emsp; Common Triggers</li></a>';
code += '           <li><b>3x3</b></li>';
code += '           <a href="basic1.html"><li>&emsp; Beginner</li></a>';
code += '           <a href="cfop1.html"><li>&emsp; CFOP</li></a>';
code += '           <a href="roux1.html"><li>&emsp; Roux</li></a>';
code += '           <li><b>2x2</b></li>';
code += '           <a href="2basic1.html"><li>&emsp; Beginner</li></a>';
code += '           <a href="ortega1.html"><li>&emsp; Ortega/Varasano</li></a>';
code += '         </ul>';
code += '       </div>';
code += '      </li>';
code += '     <li onmouseover=\"showMenu(\'flashcards\')\">';
code += '       <nobr><a href="flashcards.html">Flashcards <img src="images/drop.png" class="drop"></a></nobr>';
code += '       <div class="submenu" id="flashcards" onmouseout="hideMenu(\'flashcards\')">';
code += '         <ul class="subnav">';
code += '           <li><b>3x3 CFOP</b></li>';
code += '           <a href="flashcards.html#0"><li>&emsp; F2L</li></a>';
code += '           <a href="flashcards.html#1"><li>&emsp; 2-Look OLL</li></a>';
code += '           <a href="flashcards.html#2"><li>&emsp; OLL</li></a>';
code += '           <a href="flashcards.html#3"><li>&emsp; 2-Look PLL</li></a>';
code += '           <a href="flashcards.html#4"><li>&emsp; PLL</li></a>';
code += '           <li><b>3x3 Roux</b></li>';
code += '           <a href="flashcards.html#5"><li>&emsp; 2-Look CMLL</li></a>';
code += '           <a href="flashcards.html#6"><li>&emsp; CMLL</li></a>';
code += '           <li><b>2x2</b></li>';
code += '           <li>&emsp; Coming Soon</li>';
code += '         </ul>';
code += '       </div>';
code += '     </li>';
code += '     <li><a href="timer.html" onmouseover="hideSubs();">Timer</a></li>';
code += '     <li><a href="scrambler.html" onmouseover="hideSubs();">Scrambler</a></li>';
code += '     <li><a href="resources.html" onmouseover="hideSubs();">Resources</a></li>';
code += '     <li><a href="about.html" onmouseover="hideSubs();">About</a></li>';
// code += '     <li><a href="login.html" onmouseover="hideSubs();">Login</a></li>';
code += '    </ul>';
code += '  </div>';

function loadNavbar() {
  document.getElementById('navbarCode').innerHTML = code;
  colorify('123456789');
}

document.addEventListener("click", hideSubs, false);