import React from 'react';
import Grid from './grid';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  <Grid
			id={this.props.grid.id}
			container={this.props.grid.container}
			draft={this.props.grid.isDraft}
		  />
		);
	}
}

export default DragDropContext(HTML5Backend)(App);