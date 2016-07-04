import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/app';

/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
var grid = require('./demo');

console.log(grid);
/**
 * append app to grid app root
 */
ReactDOM.render(
  <App
    grid={grid}
	/>,
  document.getElementById("grid-app")
);