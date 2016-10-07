"use strict";


import {Grid} from '../src/model/grid.js';
import Backend from '../src/connection/backend.js';


/**
 * grid dummy
 */
const grid = require('./dummy-data/grid');
window.GRID = new Grid(grid);
var demo = document.getElementById("demo");

/**
 * methods
 */
const ajaxurl = "http://grid.local:8080/wp-admin/admin-ajax.php?action=grid_ajax";
window.GridBackend = new Backend(ajaxurl);
GridBackend.execute("grid.test","allMethods",[],function(data){
	console.log(data);
	demo.innerHTML+= "<h1>Ajax methods</h1>";
	demo.innerHTML+="<p>Ajax URL: "+ajaxurl+"</p>";
	for(let component_key in data.result){
		let component = data.result[component_key];
		demo.innerHTML+="<h2>"+component_key+"</h2>";
		
		let component_html="<p>Class: "+component.class+"<br />"+"File: "+component.file+"</p>";
		
		let methods_html = "";
		
		methods_html+="<ul style='padding: 0 30px;' >";
		for(let i = 0; i < component.methods.length; i++){
			methods_html+="<li>"+component.methods[i]+"</li>";
		}
		methods_html+="</ul>";
		
		demo.innerHTML+=methods_html;
	}
});



/**
 * check it
 */
GRID.container.forEach(function(container){
	console.log("the container", container);
	container.grid = GRID;
	demo.innerHTML+="<p>"+container.get("title")+"</p>";
});
