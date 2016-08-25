import React from 'react';
import ReactDOM from 'react-dom';
import TheGrid from '../src/component/the-grid/the-grid.js';

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
  <TheGrid
    grid={grid}
    revisions={revisions}
    container_types={container_types}
    box_types={box_types}
	/>,
  document.getElementById("grid-app")
);