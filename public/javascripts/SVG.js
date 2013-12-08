/**
 * Created by timm on 11/21/13.
 */

var constants = {};
var dots = [];
var timer;
var curDot;

/* Helper Functions */
function setConstants () {
	constants.num = 1024;
	constants.delay = 1;
	constants.color = 'rgb(9, 74, 178)';
	constants.r = 5;
	constants.size = 95;
	constants.numVis = 7;
	constants.numToSkip = constants.num / 32;
}

/* Animation Setup */
function initDotsArray () {
	var delta = 2 * Math.PI / constants.num,
		i;
	for ( i = 0; i < constants.num; i += 1 ) {
		dots[i] = { x : Math.cos( i * delta - Math.PI / 2 ), y : Math.sin( i * delta - Math.PI / 2 ), r : constants.r, name : 'dot' + i };
	}
}

function appendSpinner () {
	var spinner = document.createElementNS( "http://www.w3.org/2000/svg", "g" ),
		coordinateFrame = document.getElementById( 'coordinateFrame' );
	spinner.id = 'spinner';
	coordinateFrame.appendChild( spinner );
	return spinner;
}

function appendDot ( dot, spinner ) {
	var circle = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
	circle.id = dot.name;
	circle.cx.baseVal.value = dot.x * constants.size;
	circle.cy.baseVal.value = dot.y * constants.size;
	circle.r.baseVal.value = dot.r;
	circle.style.fill = constants.color;
	circle.style.opacity = 0;
	spinner.appendChild( circle );
}

function loadDots () {
	var i;
	for ( i = 0; i < dots.length; i += 1 ) {
		dots[i].obj = document.getElementById( dots[i].name );
	}
}

function doAnim () {
	var numVis = constants.numVis,
		deltaOpacity = 1 / numVis,
		numToSkip = constants.numToSkip,
		d = 0,
		i,
		elem;

	dots[curDot].obj.style.opacity = 1;

	for ( i = 1; i <= numVis * numToSkip + 1; i++ ) {
		elem = curDot - i;
		if ( elem < 0 ) {
			elem = constants.num + elem;
		}

		if ( !(i % numToSkip === 0) ) {
			dots[elem].obj.style.opacity = 0;
		} else {
			dots[elem].obj.style.opacity = (1 - deltaOpacity * d);
			d++;
		}
	}

	if ( ++curDot >= constants.num ) {
		curDot = 0;
	}
}

function initSpinner () {
	var spinner = appendSpinner(),
		i,
		svgElem = document.getElementById( 'svgElem' ),
		X = (window.innerWidth - $( '#sidebar' ).width()) / 2 - ( constants.size + constants.r ) / 2,
		Y = 20;
	setConstants();

	initDotsArray();
	for ( i = 0; i < dots.length; i += 1 ) {
		appendDot( dots[i], spinner );
	}

	svgElem.style.position = 'absolute';
	svgElem.style.left = X;
	svgElem.style.top = Y;

	loadDots();

	timer = setInterval( doAnim, constants.delay );
	curDot = 0;
}

function stopAnim () {
	clearInterval( timer );
}