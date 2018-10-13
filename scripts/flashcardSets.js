// by Bradley Harris, 2018

var algsF2L = [
	["Corner and edge on top separated (12)","y (L'U'L)<br>Alt: y' (R'U'R)","(RUR')","U' (RU'R') d (R'U'R)<br>Alt: y U (L'U'L) U' (L'U'L)","U' (RUR') U (RUR')<br>Alt: U2 (RU'R') U' (RUR')","U' (RUR') U2 (RU'R')","d (R'U'R) U2 (R'UR)","U' (RU2R') U2 (RU'R')","d (R'U2R) U2 (R'UR)","U (RU2R') U (RU'R')","y U' (L'U2L) U' (L'UL)","U2 (RUR') U (RU'R')","y U2 (L'U'L) U' (L'UL)"],
	["Corner and edge on top together (12)","U (RU'R')<br>If no yellow edges on top: (R'FRF')","d' (L'UL)","U' (RU2R') d (R'U'R)","y U (L'U2L) d' (LUL')<br>Alt: R'U2 (R2U)*2 R","d (R'URU')(R'U'R)","U' (RU'R') U (RUR')","y' (R'UR) U2 y (RUR')<br>Alt: MU (LF'L') U'M'<br>Alt: (RUR') U2 (RU'R'U)(RU'R')","(RU'R') U2 y' (R'U'R)<br>Alt: y MU' (R'FR) UM'","(RU2R'U')(RUR')","y (L'U2L) U (L'U'L)","(RUR'U2)(RUR’U’)(RUR')<br>Alt: U (RU'R'U')(RU'R'U)(RU'R')","d' (L'UL) U (L'ULU'L'UL)<br>Alt: y' U' (R'URU)(R'URU')(R'UR)"],
	["Corner in slot, edge on top (6)","d' (L'UL) d (RU'R')<br>Alt: U' (R'FRF')(RUR')","U (RU'R') d' (L'UL)","(RU'R'U)(RU'R')","y (L'UL) U' (L'UL)<br>Alt: y' (R'UR) U' (R'UR)","y (L'U'LU)(L'U'L)<br>Alt: (R'FRF')*2","(RUR'U')(RUR')<br>Alt: y (LF'L'F)*2"],
	["Edge in slot, corner on top (6)","U' (R'FRF')(RU'R')<br>Alt: (RU'R') d (R'UR)","(RUR'U')*3","(U'RU'R') U2 (RU'R')","U (RUR') U2 (RUR')<br>Alt: y U (L'UL) U2 (L'UL)","(U'RUR') d (R'U'R)<br>Alt: U2 (RUR')(FR'F'R)","d (R'U'R) d' (RUR')"],
	["Corner and edge in slot (5)","(RUR'U')(RU2R'U')(RUR')","(RU'R') U (RU2R') U (RU'R')","(rU'r') U2 (rUr')(RUR')<br>Alt: (RU'R') F (RUR'U') F' (RU'R')","(RU'R')(rU'r') U2 (rUr')<br>Alt: (RUR'U')(RU'R') U2 y' (R'U'R)","(RU'R') d (R'U2RU2)(R'UR)<br>Alt: (R'FRF') (R'U2)(R2U)*2 R"]
];

var casesF2L = [
	["","","","","","","","","","","",""],
	["","","","","","","","","","","",""],
	["","","","","",""],
	["","","","","",""],
	["","","","",""]
];

var algsOLL2 = [
	["Edge orientation (3)","F (RUR'U') F'","f (RUR'U') f'","(MU) (RUR'U') (M2U) (RU'r')<br>Alt: F(RUR'U')F' f(RUR'U')f'"],
	["Corner orientation (7)","(RUR'U)(RU2R')","(L'U'LU')(L'U2L)","(FR'F'r) (URU'r')<br>Alt: y F' (rUR'U') (r'FR)","(rUR'U') (r'FRF')","(R2D')(RU2R'D)(RU2R)","(RU2R'U')(RUR'U')(RU'R')<br>Alt: F(RUR'U')*3 F'","f(RUR'U')f' F(RUR'U')F'<br>Alt: (RU2)(R2U')*2 (R2U2R)"]
];

var casesOLL2 = [
	["Two opposite edges","Two adjacent edges","No correct edges"],
	["Sune","Anti-Sune","Bowtie","Blinkers","Headlights","Double Headlights","Pi"]
];

var algsOLL = [
	["Correct corners (3)","(rUR'U') M (URU'R')<br>Alt:y (MU'M') U2 (MU'M')","(RUR'U') M' (URU'r')","(rUR'U') M2 (URU'R') U'M'<br>Alt: (MU) (RUR'U') (M2U) (RU'r')"],
	["Correct edges (7)","(RUR'U) (RU2R')","(R'U'RU') (RU2R)<br>Alt: y2 (L'U'LU') (L'U2L)<br>Alt: y (RU2R'U') (RU'R')","(rUR'U') (r'FRF')","(R2D') (RU2R') D (RU2R)","(FR'F'r) (URU'r')<br>Alt: y F' (rUR'U') (r'FR)","(RU2) (R2U'R2U'R2) (U2R)<br>Alt: f (RUR'U') f'F (RUR'U') F'","(RU2R'U') (RUR'U') (RU'R')"],
	["No correct edges (7)","(rUr') U2 (rU2R'U2) (RU'r')","(RU2) (R2FRF') U2 (R'FRF')","r' (R2UR'U) (rU2r') UM'<br>Alt: y' f (RUR'U') f'U'F (RUR'U') F'","MU' (rU2r'U'RU'R') M'<br>Alt: y' f (RUR'U') f'UF (RUR'U') F'","(MU) (RUR'U') M' (R'FRF')","(rUR'URU2r') (r'U'RU'R'U2r)","(RUR'U) (R'FRF') U2 (R'FRF')<br>Alt: y2 (FR'F'R2r') (URU'R') U'M'"],
	["T shapes (2)","(RUR'U') (R'FRF')","F (RUR'U') F'"],
	["P shapes (4)","F (URU'R') F'<br>Alt: y2 f (RUR'U') f'","F' (U'L'UL) F<br>Alt: y2 f' (L'U'LU) f","LUF' (U'L'UL) FL'","R'U'F (URU'R') F'R"],
	["C shapes (2)","(RUR2U') R'F (RURU') F'","R'U' (R'FRF') UR"],
	["W shapes (2)","(RUR'U) (RU'R'U') (R'FRF')","(L'U'LU') (L'ULU) (LF'L'F)<br>Alt: (RUR'F') (RUR'U') (R'FRU') (R'FRF')"],
	["I shapes (4)","F (URU'R')*2 F'<br>Alt: y2 f (RUR'U')*2 f'","(RUR'U) Rd' (RU'R'F')","(rUr') (URU'R')*2 (rU'r')","(rU2) (R2FRF') U2 (r'FRF')<br>Alt: y (R'FRU) (RU'R2F') (R2U'R'URUR')"],
	["Squares (2)","(l'U2LU) (L'Ul)<br>Alt: y2 (r'U2) (RUR'U) r","(rU2R'U') (RU'r')"],
	["Fish (4)","(RU2) (R2FRF') (RU2R')","(FR'F'R) (URU'R')<br>Alt: F (RU'R'U') (RUR'F')","(RUR'U) (R'FRF') (RU2R')","(RUR'U') R'F (R2UR'U') F'"],
	["Big lightning (2)","LF' (L'U'LU) (FU'L')","R'F (RUR'U') (F'UR)"],
	["Small lightning (4)","(rUR'U) (RU2r')","(l'U'LU') (L'U2l)<br>Alt: y2 (r'U'RU') (R'U2r)","M' (R'U'RU'R'U2R) U'M","M (RUR'URU2R') UM'<br>Alt: y2 (rUR'U) (R'FRF') (RU2r')"],
	["Big L shapes (4)","(R'F) (RUR'F') R (FU'F')","F (URU'R2) F'R (URU'R')<br>Alt: (rU'r'U'rUr') (F'UF)","(rUr') (RUR'U') (rU'r')","(l'U'l) (L'U'LU) (l'Ul)"],
	["Small L shapes (6)","F (RUR'U')*2 F'","R'U' (R'FRF')*2 UR<br>Alt: F' (L'U'LU)*2 F'","(rU2R'U') (RUR'U') (RU'r')","(l'U2LU) (L'U'LU) (L'Ul)","r'U (r2U'r2U'r2) Ur'","rU' (r2Ur2Ur2) U'r"],
	["Awkward shapes (4)","(RUR'URU2R') F (RUR'U') F'","(R'U'RU'R'U2R) F (RUR'U') F'","F (R'FR2U') (R'U') (RUR') F2","MU (RUR'U') (R'FRF') M'<br>Alt: y (RUR'U') (RU'R') (F'U'F) (RUR')"]
];

var casesOLL = [
	["","",""],
	["","","","","","",""],
	["","","","","","",""],
	["","",],
	["","","",""],
	["",""],
	["",""],
	["","","",""],
	["",""],
	["","","",""],
	["",""],
	["","","","",""],
	["","","","",""],
	["","","","","",""],
	["","","",""],
	
];

var algsPLL2 = [
	["Corner permutation (2)","(l'UR') D2 (RU'R')(D2R2)","F(RU'R'U')(RUR'F')(RUR'U')(R'FRF')"],
	["Edge orientation (4)","(M2U)(M'U2M)(UM2)","(M2U')(M'U2M)(U'M2)","(M2UM2) U2 (M2UM2)","(M2U)*2 (M'U2)(M2U2)(M'U2)<br>Alt: (M2u)(M2D')(MS2M')"]
];

var casesPLL2 = [
	["A Perm (a): put matching corners on the back","Y Perm: no matching corners"],
	["U Perm (a): opposite colors are on the left","U Perm (b): opposite colors are on the right","H Perm: opposite colors on all sides","Z Perm: no opposite colors"]
];

var algsPLL = [
	["Corners only (2)", "(l'UR') D2 (RU'R')(D2R2)", "(rU'L) D2 (L'UL)(D2L2)"],
	["Edges only (4)", "(M2U)(M'U2M)(UM2)", "(M2U')(M'U2M)(U'M2)", "(M2UM2)U2(M2UM2)", "(M2U)*2 (M'U2)(M2U2)(M'U2)<br>Alt: (M2u)(M2D')(MS2M')"],
	["No matching corners (5)", "(R'UR'd')(R'F'R2U')(R'UR'F)(RF)", "(LU'RU2L'UR')*2 U", "(R'UL'U2RU'L)*2 U'", "F (RU'R'U')(RUR'F')(RUR'U')(R'FRF')", "x' (RU'R'D)(RUR'D')(RUR'D)(RU'R'D')"],
	["Switch opposite edges (2)", "(R'U'F')(RUR'U')(R'FR2U')(R'U'RU)(R'UR)", "(RUR'U')(R'FR2U')(R'U')(RUR'F')"],
	["L blocks (2)", "F2 (L'U'rU2)(l'UR'U'R2)", "(RUR'F')(RUR'U')(R'FR2U')(R'U')"],
	["Small blocks (4)", "(R2u)(R'UR'U')(Ru'R2) y' (R'UR)", "(L2u')(LU'LU)(L'uL2) y' (RU'R')", "(RUR') y' (R2u'RU')(R'UR'uR2)","(L'U'L) y (L2uL'U)(LU'Lu'L2)"],
	["Awkward (2)", "(RU2R'U')(R'F)(RU2)*2 (R'F)(RU'R'U)", "(R'U2RU2)(R'FRUR'U')(R'F'R2U')"]
];

var casesPLL = [
	["A Perm (a)","A Perm (b)"],
	["U Perm (a): opposite colors are on the left","U Perm (b): opposite colors are on the right","H Perm: opposite colors on all sides","Z Perm: no opposite colors"],
	["V Perm","N Perm (a)","N Perm (b)","Y Perm","E Perm: no blocks and no matching corners"],
	["F Perm: one solved face and no other blocks","T Perm"],
	["J Perm (a)","J Perm (b)"],
	["G Perm (a)","G Perm (c)","G Perm (d)","G Perm (b)"],
	["R Perm (a)","R Perm (b)"]
];

var algsCMLL2 = [
	["Corner orientation (7)", "(RUR'U)(RU2R')", "(R'U'RU')(R'U2R)", "F(RUR'U')F'", "(RUR'U')(R'FRF')", "(RU2R'U')(RUR'U')*2(RU'R')", "F (RUR'U')*2 F'", "(RU2R'U')(RUR'U')(RU'R')"],
	["Corner permutation (2)", "(RUR'F')(RUR'U')(R'FR2U')R'", "F(RU'R'U')(RUR'F')(RUR'U')(R'FRF')"]
];

var casesCMLL2 = [
	["Sune", "Anti-Sune", "Headlights", "Blinkers", "Bowtie", "Pi", "Double Headlights"],
	["Matching corners - put on left", "No matching corners - face any side"]
];

var algsCMLL = [
	["Oriented (2)","(RUR'F')(RUR'U')(R'FR2U'R')","F(RU'R'U')(RUR'F')(RUR'U')(R'FRF')"],
	["Sune (6)","(RUR'U)(RU2R')","U2(RUR'U)(R'FRF')(RU2R')","(R'F2)(RU2)(rU'r') F","U'(RUR'U)(RU'RD)(R'U'RD'R2)","x (UR'U'L)(U2RU2R')","(RU'L'UR'U'L)"],
	["Anti-Sune (6)","(R'U'RU')(R'U2R)","(R'U'RU')(R'U)(R'FRF')(UR)","U2(R2DR'UR) D' (R'UR'U')(RU'R')","U2(RU2R'U2)(R'FRF')","U2 F'(rUr') U2 (r'F2r)","U2(R'FRF')(rUr')"],
	["Headlights (6)","(R'U'RU'R'U2)(R2UR'U)(RU2R')","U' F(RUR'U')F'","(R'F)(RU'R'U')(RUR'F')(RUR'U')(R'FRF') R","(rU'r'U')*2 (F'U2F)","(R'FRU)*2 (FU2F')","(RUR'U')(R'F2R2U')(R'U')(RUR'F2)"],
	["Blinkers (6)","U'(RUR'U')(R'FRF')","U(L'U'LU)(LF'L'F)","(R'UrU2)(R2FRF'r)","U2 F(RUR'U')(RU'R'U')(RUR'F')","F(R'FR2U')(R'U'RUR'F2)","U2(r2D')(rUr'D)(r2U'r'U'r)"],
	["Bowtie (6)","U2(RU2R'U')(RUR'U')*2 (RU'R')","U2(R'U')(RUR'F')(RUR'U')(R'FR2)","(FR'F'R)(URU'R')","F(RU'R'U')(RUR'F')","U2(RUR'U)(R'FRF') U2 (R'FRF')","(RUR'U')(R'FR2U')(R'U)(RUR'F')"],
	["Pi (6)","F(RUR'U')*2 F'","U'(R'U')(R'FRF')(RU'R'U2R)","U2(R'URU'R2F)(R2UR'U')(F'R)","(RU2R'U')(RUR'U2)(R'FRF')","U(FR'F'R) U2 (RU'R'U)(RU2R')","U'(R'FRU)(FU')(RUR'U') F'"],
	["Double Headlights (4)","(RU2R'U')(RUR'U')(RU'R')","F(RUR'U')*3 F'","[U] (RU2)(R2FRF') U2 (R'FRF')","(rU'r'F) U2 (r2FrU'r)"]
];

var casesCMLL = [
	["Oriented, matching corners","Oriented, no matching corners"],
	["Sune, opposites diagonal, random sticker","Sune, opposites diagonal, back-right match","Sune, opposites column, random sticker","Sune, opposites column, back-left match","Sune, opposites row, back-right match","Sune, opposites row, back-left match"],
	["Anti-Sune, opposites diagonal, back-right match","Anti-Sune, opposites diagonal, front-left match","Anti-Sune, opposites column, random sticker","Anti-Sune, opposites column, front-left match","Anti-Sune, opposites row, random sticker","Anti-Sune, opposites row, back-right match"],
	["Headlights, front row","Headlights, top/back row","Headlights, 2 rows","Headlights, slash","Headlights, backslash","Headlights, X"],
	["Blinkers, left column","Blinkers, right column","Blinkers, front row","Blinkers, top/back row","Blinkers, 2 rows","Blinkers, 2 columns"],
	["Bowtie, top random, stickers opposite","Bowtie, top random, stickers same","Bowtie, top opposite, stickers same","Bowtie, top opposite, stickers random","Bowtie, top same, stickers random","Bowtie, top same, stickers opposite"],
	["Pi, right column","Pi, left column","Pi, 2 columns","Pi, slash","Pi, backslash","Pi, X"],
	["Double headlights, 2 columns","Double headlights, 2 rows","Double headlights, 1 column","Double headlights, 1 row"]
];

var setList = [
	["F2L", "f2l", algsF2L, casesF2L, 
	'F2L (\"First Two Layers\") is the <a href=\"cfop3.html\">second step</a> of the <a href=\"cfop1.html\">CFOP method</a>. After the cross has been solved, F2L inserts the four corner-edge pairs around the cross to complete the first two layers.<br><br>These <a href=\"f2l.pdf\" target=\"_blank\">41 algorithms</a> are for solving the front right slot (red/green). This assumes the corner and edge are either on the top layer or already in the slot.<br><br>F2L is completed when all four corner-edge pairs are inserted around the cross. This prepares the cube for OLL.'],
	
	["2-Look OLL", "oll2", algsOLL2, casesOLL2, 
	'2-look OLL a set of <a href=\"4lookll.pdf\" target=\"_blank\">10 algorithms</a> used to orient the last layer. It is a simplified way to execute the <a href=\"cfop4.html\">third step</a> of the <a href=\"cfop1.html\">CFOP method</a>. The cube is ready for OLL when the first two layers (F2L) are solved.<br><br>Yellow reprents the last layer color. Bold edges represent the last layer color on the side stickers.<br><br>To solve OLL in two steps, use one algorithm to orient the edges and one to orient the corners. This prepares the cube for PLL.'],
	
	["OLL", "oll", algsOLL, casesOLL, 
	'OLL is a set of <a href=\"oll.pdf\" target=\"_blank\">57 algorithms</a> used to orient the last layer. It is the <a href=\"cfop4.html\">third step</a> of the <a href=\"cfop1.html\">CFOP method</a>. The cube is ready for OLL when the first two layers (F2L) are solved.<br><br>Yellow represents the last layer color.'],
	
	["2-Look PLL", "pll2", algsPLL2, casesPLL2, 
	'2-look PLL a set of <a href=\"4lookll.pdf\" target=\"_blank\">6 algorithms</a> used to permute (position) the last layer. It is a simplified way to execute the <a href=\"cfop5.html\">final step</a> of the <a href=\"cfop1.html\">CFOP method</a>. The cube is ready for PLL when the first two layers (F2L) are solved and the last layer is oriented (OLL).<br><br>Black arrows indicate edge movement.<br><br>To solve PLL in two steps, use one algorithm to position the corners and one to position the edges. This solves the cube.'],
	
	["PLL", "pll", algsPLL, casesPLL, 
	'PLL a set of <a href=\"3lookll.pdf\" target=\"_blank\">21 algorithms</a> used to permute (position) the last layer. It is the <a href=\"cfop5.html\">final step</a> of the <a href=\"cfop1.html\">CFOP method</a>. The cube is ready for PLL when the first two layers (F2L) are solved and the last layer is oriented (OLL).<br><br>Shaded pieces are correctly positioned. Bold edges represent matching corners (side stickers of the same color). Black arrows indicate edge movement, while blue arrows indicate corner movement.'],
	
	["2-Look CMLL", "cmll2", algsCMLL2, casesCMLL2, 
	'2-look CMLL is a set of <a href=\"2lookcmll.pdf\" target=\"_blank\">9 algorithms</a> used to orient and permute (position) the top corners. It is a simplified way to execute the <a href=\"roux4.html\">third step</a> of the <a href=\"roux1.html\">Roux method</a>. CMLL does not preserve edge orientation.<br><br>Yellow reprents the last layer color. Bold edges represent the last layer color on the side stickers.<br><br>To solve CMLL in two steps, use one algorithm to orient the corners and one to permute the corners.'],
	
	["CMLL", "cmll", algsCMLL, casesCMLL, 
	'CMLL is a set of <a href=\"cmll.pdf\" target=\"_blank\">42 algorithms</a> that orient and position the top corners simultaneously. It is the <a href=\"roux4.html\">third step</a> of the <a href=\"roux1.html\">Roux method</a>. CMLL does not preserve edge orientation.<br><br><table class=\"sidetable\"><tr><td><b>Case</b></td><td><b>Recognition</b></td></tr><tr><td>Oriented</td><td>Matching corners</td></tr><tr><td>Sune</td><td>Opposite colors on U and RFU</td></tr><tr><td>Anti-Sune</td><td>Opposite colors on U and FRU</td></tr><tr><td>Headlights</td><td>U stickers and FUL/FUR</td></tr><tr><td>Blinkers</td><td>U stickers and FUL/FUR</td></tr><tr><td>Bowtie</td><td>UFL and compare FUR to UBR</td></tr><tr><td>Pi</td><td>U stickers</td></tr><tr><td>Double<br>Headlights</td><td>U stickers</td></tr></table>']
];