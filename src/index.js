import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/app';

/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
// TODO: load async
var grid = require('./demo/grid');
var revisions = require('./demo/revisions');
var container_types = require('./demo/container_types');
var box_types = require('./demo/box_types');

console.log(grid);
/**
 * append app to grid app root
 */
ReactDOM.render(
  <App
    grid={grid}
    revisions={revisions}
    container_types={container_types}
    box_types={box_types}
	/>,
  document.getElementById("grid-app")
);