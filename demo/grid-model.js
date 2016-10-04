"use strict";


import {Grid} from '../src/model/grid.js';
import Backend from '../src/connection/backend.js';


window.GridBackend = new Backend("http://grid.local:8080/wp-admin/admin.php?noheader=1&page=grid_ajax");
GridBackend.execute("grid.test","allMethods",[],function(data){
	console.log(data)
});

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
