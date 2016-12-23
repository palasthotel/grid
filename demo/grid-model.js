"use strict";

import Backend from '../src/connection/backend.js';

/**
 * grid dummy
 */
const demo = document.getElementById("demo");

/**
 * methods
 */
const endpoint = "http://grid.local:8080/wp-admin/admin-ajax.php?action=grid_ajax";
const backend = new Backend(endpoint);

backend.execute("grid.test","allMethods",[],(error, response)=>{
	console.log(response);
	const data = response.data;
	
	demo.innerHTML+= "<h1>Ajax methods</h1>";
	demo.innerHTML+="<p>Ajax URL: "+endpoint+"</p>";
	for(let component_key in data){
		let component = data[component_key];
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

