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

var code = "";
code += '  <div class="navbar" id="navbar">';
code += '    <ul class="nav">';
code += '     <li><a href="index.html" onmouseover=\"hideSubs()\">Home</a></li>';
code += '     <li onmouseover=\"showMenu(\'tutorials\')\">';
code += '       <a href="tutorials.html">Tutorials <img src="images/drop.png" class="drop"></a>';
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
code += '       <a href="flashcards.html">Flashcards <img src="images/drop.png" class="drop"></a>';
code += '       <div class="submenu" id="flashcards" onmouseout="hideMenu(\'flashcards\')">';
code += '         <ul class="subnav">';
code += '           <li><b>3x3 CFOP</b></li>';
code += '           <a href="flashcards.html"><li>&emsp; F2L</li></a>';
code += '           <a href="flashcards.html"><li>&emsp; 2-Look OLL</li></a>';
code += '           <a href="flashcards.html"><li>&emsp; OLL</li></a>';
code += '           <a href="flashcards.html"><li>&emsp; 2-Look PLL</li></a>';
code += '           <a href="flashcards.html"><li>&emsp; PLL</li></a>';
code += '           <li><b>3x3 Roux</b></li>';
code += '           <a href="flashcards.html"><li>&emsp; 2-Look CMLL</li></a>';
code += '           <a href="flashcards.html"><li>&emsp; CMLL</li></a>';
code += '           <li><b>2x2</b></li>';
code += '           <li>&emsp; Coming Soon</li>';
code += '         </ul>';
code += '       </div>';
code += '     </li>';
code += '     <li><a href="timer.html" onmouseover="hideSubs();">Timer</a></li>';
code += '     <li><a href="scrambler.html" onmouseover="hideSubs();">Scrambler</a></li>';
code += '     <li><a href="resources.html" onmouseover="hideSubs();">Resources</a></li>';
code += '     <li><a href="about.html" onmouseover="hideSubs();">About</a></li>';
code += '     <span class="spacer" onmouseover="hideSubs();"></span>';
// code += '     <li><a href="login.html" onmouseover="hideSubs();">Login</a></li>';
code += '    </ul>';
code += '  </div>';

function loadNavbar() {
  document.getElementById('navbarCode').innerHTML = code;
}