import React, {Component, PropTypes} from 'react';

import Grid from './grid.js';
import TabView from './sidebar/tab-view.js';
import ContainerTypes from './sidebar/container-types.js';
import BoxTypes from './sidebar/box-types.js';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class TheGrid extends React.Component{
	constructor(props) {
		super(props);
	}
	componentWillReceiveProps(nextProps){
		console.log(nextProps);
	}
	render(){
		const {events,isDraft,container,container_types,box_types} = this.props;
		return (
			<div
				className="the-grid"
			>
				<div
					className="grid__toolbar"
				>
					Buttons | Elements | Revisions
				</div>
				
				<Grid
					container={container}
					draft={isDraft}
					events={events}
				/>
				
				<TabView
					className="grid__new-elements"
					titles={["Containers","Boxes"]}
				>
					
					<ContainerTypes
						items={container_types}
					    events={events}
					/>
					
					<BoxTypes
						items={box_types}
					    events={events}
					/>
					
				</TabView>
				
			</div>
		);
	}
}

/**
 * property defaults
 */
TheGrid.defaultProps = {
	container_types: [],
	box_types: [],
};

/**
 * define property types
 */
TheGrid.propTypes = {
	events: PropTypes.object.isRequired,
	isDraft: PropTypes.bool.isRequired,
	container: PropTypes.array.isRequired,
	revisions: PropTypes.array.isRequired,
	container_types: PropTypes.array,
	box_types: PropTypes.array,
};


export default DragDropContext(HTML5Backend)(TheGrid);