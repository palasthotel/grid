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
		
		this.incremental_id = 1;
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
				{this.renderContainers(this.state.container)}
			</div>
		);
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onContainerAdd(container, drop_index){
		
		// add temporary box id
		if(!container.id){
			container.id = "new-"+(this.incremental_id++);
		}
		
		container.isSaving = true;
		this.state.container.splice(drop_index,0,container);
		
		// TODO: add slots and boxes or set loading?
		
		container.slots = [];
		
		this.updateContainerState();
		
		this.props.onContainerAdd((error, _container)=>{
			if(error){
				// TODO: error handling
			}
			_container.isSaving = false;
			for(let prop in _container){
				if(!_container.hasOwnProperty(prop)) continue;
				this.state.container[drop_index][prop] = _container[prop];
			}
			this.updateContainerState();
		},container, drop_index);
	}
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
		
		this.props.onContainerMove((error, data)=>{
			if(error){
				
			}
			console.log("onContainerMove", data);
			container.isMoving = false;
			this.updateContainerState();
			this.triggerStateChanged();
		}, dragged_container, container_drop.index);
	}
	onContainerDelete(container_props){
		console.log("onContainerDelete", container_props);
		let container = this.state.container[container_props.index];
		container.isDeleting = true;
		this.updateContainerState();
		this.props.onContainerDelete((error, data)=>{
			console.log("onContainerDelete", error, data);
			if(error){
				
			}
			this.state.container.splice(container_props.index,1);
			this.updateContainerState();
			this.triggerStateChanged();
		},container_props);
	}
	
	onBoxAdd(box, drop){
		
		// add temporary box id
		if(!box.id){
			box.id = "new-"+(this.incremental_id++);
		}
		
		box.isSaving = true;
		this.state.container[drop.container_index].slots[drop.slot_index].boxes.splice(drop.index,0,box);
		this.updateContainerState();
		
		this.props.onBoxAdd((error, _box)=>{
			if(error){
				// TODO: error handling
			}
			_box.isSaving = false;
			this.state.container[drop.container_index].slots[drop.slot_index].boxes[drop.index] = _box;
			this.updateContainerState();
		},box, drop);
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
			this.triggerStateChanged();
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
			this.triggerStateChanged();
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
	triggerStateChanged(){
		this.props.onStateChange(this.state.container);
	}
	updateContainerState(){
		this.setState({container: this.state.container});
		// this.props.onStateChange(this.state.container);
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


