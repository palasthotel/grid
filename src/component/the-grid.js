import React from 'react';
import Grid from './grid.js';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class TheGrid extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		
		return (
		  <div className="the-grid">
            <div className="grid-toolbar">
                Buttons | Elements | Revisions
            </div>
            <Grid
                id={this.props.grid.id}
                container={this.props.grid.container}
                draft={this.props.grid.isDraft}
            />
		  </div>
		);
	}
}

export default DragDropContext(HTML5Backend)(TheGrid);