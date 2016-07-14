import React from 'react';
import Grid from './grid';
import Elements from './toolbar/elements';
import Buttons from './toolbar/buttons';
import Revisions from './toolbar/revisions';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class TheGrid extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  <div id="new-grid-wrapper">
            <div className="grid-toolbar">
                <Buttons />
                <Elements
                    container_types={this.props.container_types}
                    box_types={this.props.box_types}
                />
            <Revisions
                list={this.props.revisions}
            />
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

export default DragDropContext(HTML5Backend)(App);