import React from 'react';
import Grid from './grid.js';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {EventEmitter} from 'events';



class TheGrid extends React.Component{
	constructor(props) {
		super(props);
		this._events = new EventEmitter();
		this._events.setMaxListeners(0);
	}
	render(){
		
		return (
		  <div className="the-grid">
            <div className="grid-toolbar">
                Buttons | Elements | Revisions
            </div>
            <Grid
                container={this.props.grid.container}
                draft={this.props.grid.isDraft}
                events={this._events}
            />
		  </div>
		);
	}
}

export default DragDropContext(HTML5Backend)(TheGrid);