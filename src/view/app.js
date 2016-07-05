import React from 'react';
import Grid from './grid';
import Elements from './toolbar/elements';
import Buttons from './toolbar/buttons';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  <div id="new-grid-wrapper">
			  <Grid
				id={this.props.grid.id}
				container={this.props.grid.container}
				draft={this.props.grid.isDraft}
			  />
			<Buttons />
			<Elements />
		  </div>
		);
	}
}

export default DragDropContext(HTML5Backend)(App);