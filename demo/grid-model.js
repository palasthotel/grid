"use strict";


import {Grid} from '../src/model/grid.js';


/**
 * grid dummy
 */
const grid = require('./dummy-data/grid');

window.GRID = new Grid(grid);

GRID.container.forEach(function(container){
	console.log("the container", container);
	container.grid = GRID;
});