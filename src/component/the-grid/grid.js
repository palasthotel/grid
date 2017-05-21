"use strict";

import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
		this.state = {};
		this.incremental_id = 1;
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
		const container_id = this.props.container[container_index].id;
		const slot_id = this.props.container[container_index].slots[slot_index].id;
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

				onAdd={this.onBoxAdd.bind(this)}
				onMove={this.onBoxMove.bind(this)}
				onEdit={this.props.onBoxEdit}
				onDelete={this.onBoxDelete.bind(this)}

			/>);
			$boxes.push(this.renderBoxDrop(i+1, container_index, slot_index));
			
		}
		return $boxes;
	}
	renderBoxDrop(index, container_index, slot_index){
		const drop_key = "box-drop-"+index;
		const container_id = this.props.container[container_index].id;
		const slot_id = this.props.container[container_index].slots[slot_index].id;
		return(
			<BoxDrop
				key={drop_key}
				index={index}
				container_index={container_index}
				container_id={container_id}
				slot_index={slot_index}
				slot_id={slot_id}
			    onAdd={this.onBoxAdd.bind(this)}
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
					key={container_index+"-"+index}
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
				    onDelete={this.props.onContainerDelete}
				    onReuse={this.onContainerReuse.bind(this)}
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
			    onAdd={this.onContainerAdd.bind(this)}
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
				{this.renderContainers(this.props.container)}
			</div>
		);
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onContainerAdd(container, drop_index){
		this.props.onContainerAdd(container, drop_index);
	}
	onContainerMove(dragged_container, container_drop){
		if( dragged_container.index === container_drop.index
			|| dragged_container.index+1 === container_drop.index
		) return;

		if(dragged_container.index < container_drop.index){
			container_drop.index--;
		}
		this.props.onContainerMove(dragged_container.id, container_drop.index)
	}
	onContainerDelete(container_props){
		this.props.onContainerDelete(container_props.id);
	}
	onContainerReuse(container_index,title){
		this.props.onContainerReuse(container_index, title);
	}
	
	onBoxAdd(box, drop){
		this.props.onBoxAdd(drop.container_id, drop.slot_id, drop.index, box );
	}
	onBoxMove(dragged_box, box_drop){

		this.props.onBoxMove(
			dragged_box.container_id, dragged_box.slot_id, dragged_box.index,
			box_drop.container_id, box_drop.slot_id, box_drop.index
		);
	}
	onBoxDelete(box_props){
		const {container_id, slot_id, index} = box_props
		this.props.onBoxDelete( container_id, slot_id, index );
	}
	
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
	getWidth(){
		return this.state.dom.clientWidth;
	}
	triggerStateChanged(){
		this.props.onStateChange(this.props.container);
	}
	updateContainerState(){
		this.setState({container: this.props.container});
		// this.props.onStateChange(this.props.container);
	}
}

/**
 * property defaults
 */
Grid.defaultProps = {
	onStateChange: (container)=>{ },
	
	onContainerAdd: (done, container)=> { done(false, container) },
	onContainerMove: (done)=> { done(); },
	onContainerEdit: (done)=>{ done(); },
	onContainerDelete: (done)=>{ done(); },
	onContainerReuse: (done)=>{ done(); },
	
	onBoxAdd: (done, box)=> { done(false, box) },
	onBoxMove: (done)=>{ done(); },
	onBoxEdit: (done)=>{ done(); },
	onBoxDelete: (done)=>{ done(); },

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
	
	onContainerAdd: PropTypes.func,
	onContainerMove: PropTypes.func,
	onContainerEdit: PropTypes.func,
	onContainerDelete: PropTypes.func,
	
	onBoxAdd: PropTypes.func,
	onBoxMove: PropTypes.func,
	onBoxEdit: PropTypes.func,
	onBoxDelete: PropTypes.func,
	
};
