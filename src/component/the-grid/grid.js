"use strict";

import React, { Component, PropTypes } from 'react';

import Container from './container/container.js';
import ContainerDrop from './container/container-drop.js';
import Slot from './slot/slot.js';
import BoxDrop from './box/box-drop.js';
import Box from './box/box.js';

import { States } from '../../constants.js';

export default class Grid extends Component{
	
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		
		/**
		 * knows the state of the containers
		 * @type {{container}}
		 */
		this.state = {
			container: props.container,
		};
	}
	componentWillReceiveProps(nextProps){
		this.state.container = nextProps.container;
	}
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	
	/**
	 * render boxes
	 * @param boxes
	 * @param container_index
	 * @param slot_index
	 * @returns {Array}
	 */
	renderBoxes(boxes, container_index, slot_index){
		const container_id = this.state.container[container_index].id;
		const slot_id = this.state.container[container_index].slots[slot_index].id;
		let $boxes = [];
		$boxes.push(this.renderBoxDrop(0, container_index, slot_index));
		for(let i = 0; i < boxes.length; i++){
			const box = boxes[i];
			
			$boxes.push(<Box
				key={box.id}
				index={i}
				container_index={container_index}
				container_id={container_id}
				slot_index={slot_index}
				slot_id={slot_id}
				{...box}
				onMove={this.onBoxMove.bind(this)}
				onEdit={()=>{}}
				onDelete={this.onBoxDelete.bind(this)}
			/>);
			$boxes.push(this.renderBoxDrop(i+1, container_index, slot_index));
			
		}
		return $boxes;
	}
	renderBoxDrop(index, container_index, slot_index){
		const drop_key = "box-drop-"+index;
		const container_id = this.state.container[container_index].id;
		const slot_id = this.state.container[container_index].slots[slot_index].id;
		return(
			<BoxDrop
				key={drop_key}
				index={index}
				container_index={container_index}
				container_id={container_id}
				slot_index={slot_index}
				slot_id={slot_id}
			/>
		);
	}
	
	/**
	 * render slots
	 * @param slots
	 * @param dimensions array
	 * @param container_index
	 * @returns {*}
	 */
	renderSlots(slots, dimensions, container_index){
		return slots.map((slot, index)=>{
			let parts = dimensions[index].split("d");
			let width = (parts[0]/parts[1])*100;
			return(
				<Slot
					key={index}
					index={index}
					container_index={container_index}
					{...slot}
					dimension={width}
				>
					{this.renderBoxes(slot.boxes, container_index, index)}
				</Slot>
			)
		});
	}
	
	/**
	 * render containers
	 * @param containers
	 * @returns {Array}
	 */
	renderContainers(containers){
		const $containers = [];
		
		/**
		 * render drop area for containers
		 * @type {string}
		 */
		$containers.push(this.renderContainerDrop(0));
		
		for(let i = 0; i < containers.length; i++ ){
			let container = containers[i];
			
			/**
			 * render container
			 */
			let dimensions = container.type.split("-").slice(1);
			$containers.push((
				<Container
					key={container.id}
					{...container}
					index={i}
				    onMove={this.onContainerMove.bind(this)}
				    onDelete={this.onContainerDelete.bind(this)}
				>
					{this.renderSlots(container.slots, dimensions, i)}
				</Container>
			));
			
			$containers.push(this.renderContainerDrop(i+1));
			
		}
		return $containers;
	}
	renderContainerDrop(index){
		const drop_key = "container-drop_"+index;
		return(
			<ContainerDrop
				key={drop_key}
				index={index}
			/>
		);
	}
	/**
	 * render the whole grid
	 * @returns {XML}
	 */
	render(){
		return (
			<div
				className="grid"
				ref={(element)=> this.state.dom = element}
			>
				{this.renderContainers(this.state.container)}
			</div>
		);
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	
	onContainerMove(dragged_container, container_drop){
		
		if( dragged_container.index == container_drop.index
			|| dragged_container.index+1 == container_drop.index
		) return;
		
		if(dragged_container.index < container_drop.index){
			container_drop.index--;
		}
		
		let container = this.state.container.splice(dragged_container.index,1)[0];
		container.isMoving = true;
		this.state.container.splice(container_drop.index,0,container);
		this.updateContainerState();
		
		this.props.onContainerMove((error)=>{
			if(error){
				
			}
			container.isMoving = false;
			this.updateContainerState();
		});
	}
	
	onContainerDelete(container_props){
		console.log("onContainerDelete", container_props);
		let container = this.state.container[container_props.index];
		container.isDeleting = true;
		this.updateContainerState();
		this.props.onContainerDelete((error)=>{
			if(error){
				
			}
			this.state.container.splice(container_props.index,1);
			this.updateContainerState();
		},container_props);
	}
	
	onBoxMove(dragged_box, box_drop){
		
		if(dragged_box.container_id == box_drop.container_id
		&& dragged_box.slot_id == box_drop.slot_id ){
			/**
			 * no need for operation. it's the same potision
			 */
			if( dragged_box.index == box_drop.index || dragged_box.index+1 == box_drop.index) return;
			
			/**
			 * if dragged box before destination and in same slot we need to decrease the index because of coming slice operation
			 */
			if(dragged_box.index < box_drop.index){
				box_drop.index--;
			}
			
		}
		
		/**
		 * handle movement in state
		 */
		let box = this.state.container[dragged_box.container_index].slots[dragged_box.slot_index].boxes.splice(dragged_box.index,1)[0];
		box.isMoving = true;
		this.state.container[box_drop.container_index].slots[box_drop.slot_index].boxes.splice(box_drop.index,0,box);
		this.updateContainerState();
		
		/**
		 * deligate move to parent component
		 */
		this.props.onBoxMove((error)=>{
			if(error){
				
			}
			box.isMoving = false;
			this.updateContainerState();
		},dragged_box,box_drop);
	}
	onBoxDelete(box_props){
		const {container_index, slot_index, index} = box_props;
		let box = this.state.container[container_index].slots[slot_index].boxes[index];
		/**
		 * set box deleting
		 */
		box.isDeleting = true;
		this.updateContainerState();
		this.props.onBoxDelete((error)=> {
			if (error) {
				// handle error
				console.error(box);
				throw "onBoxDelete Error";
			}
			/**
			 * if no error occured delete the box finally
			 */
			this.state.container[container_index].slots[slot_index].boxes.splice(index,1);
			this.updateContainerState();
			
		}, box_props);
		
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
	getWidth(){
		return this.state.dom.clientWidth;
	}
	triggerStateChange(){
		this.props.onStateChange(this.state.container);
	}
	updateContainerState(){
		this.setState({container: this.state.container});
	}
}

/**
 * property defaults
 */
Grid.defaultProps = {
	onStateChange: (container)=>{ },
	
	onContainerMove: (done)=> { done(); },
	onContainerDelete: (done)=>{ done(); },
	onContainerEdit: (done)=>{ done(); },
	
	onBoxMove: (done)=>{ done(); },
	onBoxDelete: (done)=>{ done(); },
	onBoxEdit: (done)=>{ done(); },
};

Grid.propTypes = {
	/**
	 * initial state
	 */
	container: PropTypes.arrayOf(
		PropTypes.object.isRequired
	).isRequired,
	
	/**
	 * callback handlers
	 */
	onStateChange: PropTypes.func,
	
	onContainerMove: PropTypes.func,
	onContainerDelete: PropTypes.func,
	onContainerEdit: PropTypes.func,
	
	onBoxMove: PropTypes.func,
	onBoxDelete: PropTypes.func,
	onBoxEdit: PropTypes.func,
};


