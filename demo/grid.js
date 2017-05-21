"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Grid from '../src/component/the-grid/grid.js';

/**
 * drag and drop context
 */
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {EventEmitter} from 'events';
const events = new EventEmitter();
events.setMaxListeners(0);

/**
 * grid dummy
 */
const container = require('./dummy-data/grid').container;

const DNDGrid = DragDropContext(HTML5Backend)(Grid);


/**
 * wait for dom to be ready so all plugins etc are loaded
 */
ReactDOM.render(
	<DNDGrid
		container={container}
		events={events}
	/>,
	document.getElementById("demo")
);

