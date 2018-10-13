var headerCode = "";
headerCode += '<table><tr><td>';
headerCode += '<table class="smallcube largeonly">';
headerCode += '<tr>';
headerCode += '<td id="sq1" onmouseover="colorify(\'1\');"></td>';
headerCode += '<td id="sq2" onmouseover="colorify(\'2\');"></td>';
headerCode += '<td id="sq3" onmouseover="colorify(\'3\');"></td>';
headerCode += '</tr>';
headerCode += '<tr>';
headerCode += '<td id="sq4" onmouseover="colorify(\'4\');"></td>';
headerCode += '<td id="sq5" onmouseover="colorify(\'5\');"></td>';
headerCode += '<td id="sq6" onmouseover="colorify(\'6\');"></td>';
headerCode += '</tr>';
headerCode += '<tr>';
headerCode += '<td id="sq7" onmouseover="colorify(\'7\');"></td>';
headerCode += '<td id="sq8" onmouseover="colorify(\'8\');"></td>';
headerCode += '<td id="sq9" onmouseover="colorify(\'9\');"></td>';
headerCode += '</tr>';
headerCode += '</table>';
headerCode += '</td>';
headerCode += '<td>';
headerCode += '<span class="menuButton" onclick="toggleNavbar();">&#9776;</span>';
headerCode += '<span class="title"><a href="index.html" class="title">Cube Tools</a></span>';
headerCode += '</td></tr></table>';

function loadHeader() {
  document.getElementById('headerCode').innerHTML = headerCode;
}