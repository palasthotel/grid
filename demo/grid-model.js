"use strict";


import {Grid} from '../src/model/grid.js';


/**
 * grid dummy
 */
const grid = require('./dummy-data/grid');

window.GRID = new Grid(grid);

var demo = document.getElementById("demo");

/**
 * check it
 */
GRID.container.forEach(function(container){
	console.log("the container", container);
	container.grid = GRID;
	demo.innerHTML+="<p>"+container.get("title")+"</p>";
});