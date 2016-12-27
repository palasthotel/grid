import React from 'react';
import ReactDOM from 'react-dom';
import TheGridRouter from './router/the-grid-router.js';

/**
 * wait for dom to be ready so all plugins etc are loaded
 */
document.addEventListener("DOMContentLoaded", function() {
	
	/**
	 * append app to grid app root
	 */
	ReactDOM.render(
		<TheGridRouter />,
		document.getElementById("grid-app")
	);
	
});