import React from 'react';
import ReactDOM from 'react-dom';
import Grid from '../src/component/grid.js';

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

/**
 * add drag and drop context to grid. Normally TheGrid holds context.
 * @type {__ReactDnd.ContextComponentClass<P>}
 */
const DNDGrid = DragDropContext(HTML5Backend)(Grid);

/**
 * render to demo dom
 */
ReactDOM.render(
  <DNDGrid
    container={container}
    events={events}
	/>,
  document.getElementById("grid-demo")
);