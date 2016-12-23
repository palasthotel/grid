"use strict";

import React, { Component, PropTypes } from 'react';

import Container from './container/container.js';
import ContainerDrop from './container/container-drop.js';
import Slot from './slot/slot.js';
import BoxDrop from './box/box-drop.js';
import Box from './box/box.js';

import { ItemTypes, Events, States } from '../../constants.js';

export default class Grid extends Component{
	
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		
		this.state = {
			container: props.container,
		};
	}
	componentDidMount(){
		window.addEventListener('resize', this.onResize.bind(this));
		this.onResize();
		
		const {events} = this.props;
		
		events.on(Events.BOX_ADD,this.onBoxAdd.bind(this));
		events.on(Events.BOX_WAS_ADDED, this.onBoxWasAdded.bind(this));
		
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.onResize);
		
		const {events} = this.props;
		events.off(Events.BOX_ADD,this.onBoxAdd.bind(this));
		events.off(Events.BOX_WAS_ADDED, this.onBoxWasAdded.bind(this));
	}
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	
	/**
	 * render boxes
	 * @param boxes
	 * @returns {Array}
	 */
	renderBoxes(boxes, container_index, slot_index){
		const container_id = this.state.container[container_index].id;
		const slot_id = this.state.container[container_index].slots[slot_index].id;
		let $boxes = [];
		for(let i = 0; i < boxes.length; i++){
			const box = boxes[i];
			$boxes.push(this.renderBoxDrop(i, container_index, slot_index));
			$boxes.push(<Box
				key={i}
				index={i}
				container_index={container_index}
				container_id={container_id}
				slot_index={slot_index}
				slot_id={slot_id}
				{...box}
				events={this.props.events}
			/>);
			if(i == boxes.length-1)
				$boxes.push(this.renderBoxDrop(++i, container_index, slot_index));
			
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
				onDrop={this.onBoxDrop.bind(this)}
				events={this.props.events}
			/>
		);
	}
	
	/**
	 * render slots
	 * @param slots
	 * @param dimensions array
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
					events={this.props.events}
				>{this.renderBoxes(slot.boxes, container_index, index)}</Slot>
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
		
		for(let i = 0; i < containers.length; i++ ){
			let container = containers[i];
			
			/**
			 * render drop area for containers
			 * @type {string}
			 */
			$containers.push(this.renderContainerDrop(i));
			
			/**
			 * render container
			 */
			let dimensions = container.type.split("-").slice(1);
			$containers.push((
				<Container
					key={container.id}
					{...container}
					index={i}
				    events={this.props.events}
				>
					{this.renderSlots(container.slots, dimensions, i)}
				</Container>
			));
			
			/**
			 * render last drop area for containers
			 */
			if(i == this.props.container.length-1){
				$containers.push(this.renderContainerDrop(++i));
			}
		}
		return $containers;
	}
	renderContainerDrop(index){
		const drop_key = "container-drop_"+index;
		return(
			<ContainerDrop
				key={drop_key}
				index={index}
				onDrop={this.onContainerDrop.bind(this, index)}
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
	onResize(){
		console.log("grid width",this.getWidth());
		this.props.events.emit(Events.GRID_RESIZE.key, this.getWidth());
	}
	onContainerDrop(index){
		console.log("dropped on index "+index);
	}
	onBoxDrop(container_index, slot_index, box_index, box){
		// console.log("Box drop on", container_index, slot_index, box_index, box);
	}
	onBoxAdd(box, to){
		console.log("onBoxAdd", box, to);
		const {container_index, slot_index, box_index} = to;
		
		box.id = "new";
		box.state = States.LOADING;
		this.state.container[container_index].slots[slot_index].boxes.splice(box_index,0,box);
		this.setState(this.state);
	}
	onBoxWasAdded(box, container_id, slot_id, box_index, type){
		
		for(let c of this.state.container){
			if(c.id == container_id){
				for(let s of c.slots){
					if(s.id == slot_id){
						if(s.boxes[box_index].type == type && s.boxes[box_index].id == "new"){
							s.boxes[box_index] = box;
							this.setState(this.state);
							return;
						}
						break;
					}
				}
				break;
			}
		}
		throw "Box that should have been added was not found in dom.";
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
	getWidth(){
		return this.state.dom.clientWidth;
	}
}

Grid.propTypes = {
	container: PropTypes.arrayOf(
		PropTypes.object.isRequired
	).isRequired,
	events: PropTypes.object.isRequired,
};


