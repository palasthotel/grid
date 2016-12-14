import React from 'react';
import Grid from './grid.js';
import TabView from './sidebar/tab-view.js';
import ContainerTypes from './sidebar/container-types.js';

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
				<div className="grid__toolbar">
					Buttons | Elements | Revisions
				</div>
				<Grid
					id="1"
					container={this.props.grid.container}
					draft={this.props.grid.isDraft}
					events={this._events}
				/>
				<TabView
					className="grid__new-elements"
					titles={["Containers","Boxes"]}
				>
					<ContainerTypes
						container_types={[]}
					/>
					<div>Boxes</div>
				</TabView>
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(TheGrid);