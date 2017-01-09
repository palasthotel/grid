import React, {Component, PropTypes} from 'react';

import Grid from './grid.js';
import TabView from './sidebar/tab-view.js';
import ContainerTypes from './sidebar/container-types.js';
import BoxTypes from './sidebar/box-types.js';

import Revision from './revision/revision';

import ToolbarButton from './toolbar/toolbar-button';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class TheGrid extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {
			show_revisions: false,
		}
	}
	
	render(){
		const {isDraft,container,container_types,box_types, revisions} = this.props;
		const {show_revisions} = this.state;
		return (
			<div
				className="the-grid"
			>
				<div
					className="grid__toolbar"
				>
					<ToolbarButton
						label="Publish"
					    identifier="publish"
					    onClick={this.onClickPublish.bind(this)}
					/>
					<ToolbarButton
						label="Preview"
						identifier="preview"
						onClick={this.props.onPreview}
					/>
					<ToolbarButton
						label="Revert"
						identifier="revert"
						onClick={this.onClickRevert.bind(this)}
					/>
					<ToolbarButton
						label="Revisions"
						identifier="revisions"
						onClick={this.onClickRevisions.bind(this)}
					/>
					
				</div>
				
				<div
					className="grid-revisions"
				>
					{show_revisions && revisions.map((item)=>{
						return	(
							<Revision
								key={item.revision}
								{...item}
								onPreview={this.props.onPreview.bind(this,item)}
							    onRevert={this.onClickRevert.bind(this,item)}
							/>
						)
					} )}
				</div>
				
				<Grid
					container={container}
					draft={isDraft}
					
				    onStateChange={this.onGridStateChange.bind(this)}
				    
					onContainerAdd={this.props.onContainerAdd.bind(this)}
					onContainerMove={this.props.onContainerMove.bind(this)}
				    onContainerDelete={this.props.onContainerDelete.bind(this)}
				    onContainerReuse={this.props.onContainerReuse.bind(this)}
				    
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
					    onSearch={this.onBoxTypeSearch.bind(this)}
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
		this.props.onUpdateState({"container":container});
	}
	onClickPublish(){
		console.log("publish grid!");
		this.props.onPublish((error, success)=>{
			
		});
	}
	onClickRevert(revision){
		this.props.onRevert((error, data)=>{
			console.log("onReverted", data);
		},revision);
	}
	onClickRevisions(){
		this.setState({show_revisions: !this.state.show_revisions})
	}
	onBoxTypeSearch(done, type, criteria, query){
		console.log("on box type search");
		this.props.onBoxTypeSearch((boxes)=>{
			console.log("found boxes", boxes);
			const box_types = this.props.box_types;
			for(let index in box_types){
				if(!box_types.hasOwnProperty(index)) continue;
				if(box_types[index].type == type){
					box_types[index].boxes = boxes;
					this.props.onUpdateState({"box_types":box_types});
				}
			}
		},type,criteria,query);
	}
	
	/**
	 * ---------------------
	 * functions
	 * ---------------------
	 */
}

/**
 * property defaults
 */
TheGrid.defaultProps = {
	container_types: [],
	box_types: [],
	
	container_styles: [],
	slot_styles: [],
	box_styles: [],
	
	onRevert: (done)=>{ done() },
	onPublish: (done)=>{ done() },
	onPreview: ()=>{ },
	
	onBoxTypeSearch: (done, type, criteria, query)=>{ done([]) },
	onUpdateState: ()=>{},
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
	
	container_styles: PropTypes.array,
	slot_styles: PropTypes.array,
	box_styles: PropTypes.array,
	
	onUpdateState: PropTypes.func,
	
};


export default DragDropContext(HTML5Backend)(TheGrid);