import React from 'react';
import ReactDOM from 'react-dom';
import BoxEditor from '../src/component/box-editor/box-editor.js';


const grid = require('./dummy-data/grid');

/**
 * append app to grid app root
 */
let box = grid.container[0].slots[0].boxes[0];

ReactDOM.render(
	<div className="grid">
		  <BoxEditor
		    box={box}
			/>
		</div>,
  document.getElementById("demo")
);