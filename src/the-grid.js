import {initGrid} from './init/the-grid'


/**
 * wait for dom to be ready so all plugins etc are loaded
 */
document.addEventListener("DOMContentLoaded", function() {

	initGrid(window.grid, document.getElementById("grid-app"));
	
});