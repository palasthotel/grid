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
	render(){
		const {isDraft,container,container_types,box_types} = this.props;
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
				    onStateChange={this.onGridStateChange.bind(this)}
				    onContainerMove={this.onContainerMove.bind(this)}
				    onContainerDelete={this.onContainerDelete.bind(this)}
				    onBoxAdd={this.props.onBoxAdd}
				    onBoxMove={this.props.onBoxMove}
					onBoxEdit={this.props.onBoxEdit}
				    onBoxDelete={this.props.onBoxDelete}
				    
				/>
				
				<TabView
					className="grid__new-elements"
					titles={["Containers","Boxes"]}
				>
					
					<ContainerTypes
						items={container_types}
					/>
					
					<BoxTypes
						items={box_types}
					    onSearch={this.props.onBoxTypeSearch}
					/>
					
				</TabView>
				
			</div>
		);
	}
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onGridStateChange(container){
		console.log("onGridStateChange");
	}
	onContainerMove(done){
		done();
	}
	onContainerDelete(done){
		done();
	}
	onNewBoxDrop(dragged_box,box_drop){
		
	}
}

/**
 * property defaults
 */
TheGrid.defaultProps = {
	container_types: [],
	box_types: [],
	
	onBoxTypeSearch: (done, type, criteria, query)=>{ done([]) },
	onBoxDrop: ()=>{},
};

/**
 * define property types
 */
TheGrid.propTypes = {
	isDraft: PropTypes.bool.isRequired,
	container: PropTypes.array.isRequired,
	revisions: PropTypes.array.isRequired,
	container_types: PropTypes.array,
	box_types: PropTypes.array,
	
	onBoxTypeSearch: PropTypes.func,
	onBoxDrop: PropTypes.func,
};


export default DragDropContext(HTML5Backend)(TheGrid);