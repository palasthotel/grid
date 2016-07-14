import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/view/app';

/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
var grid = require('./dummy-data/grid');
var revisions = require('./dummy-data/revisions');
var container_types = require('./dummy-data/container_types');
var box_types = require('./dummy-data/box_types');

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