import React from 'react';
import ReactDOM from 'react-dom';
import BoxEditor from '../src/component/box-editor/editor.js';

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
let box = grid.container[0].slots[0].boxes[0];
ReactDOM.render(
  <BoxEditor
    box={box}
	/>,
  document.getElementById("box-editor-demo")
);