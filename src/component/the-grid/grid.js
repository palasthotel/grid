"use strict";

import React, { Component, PropTypes } from 'react';

import Container from './container/container.js';
import ContainerDrop from './container/container-drop.js';
import Slot from './slot/slot.js';
import BoxDrop from './box/box-drop.js';
import Box from './box/box.js';

import { ItemTypes, Events } from '../../constants.js';

export default class Grid extends Component{
	
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		
		this.state = {
			container: {
				dragging: false,
				from: null,
				to: null,
			},
			box: {
				dragging: false,
				from: {
					container: null,
					slot: null,
					index: null,
				},
				to: {
					container: null,
					slot: null,
					index: null,
				}
			},
			loading: false
		};
	}
	componentDidMount(){
		window.addEventListener('resize', this.onResize.bind(this));
		this.onResize();
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.onResize);
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
	renderBoxes(boxes){
		let $boxes = [];
		for(let i = 0; i < boxes.length; i++){
			const box = boxes[i];
			$boxes.push(this.renderBoxDrop(i));
			$boxes.push(<Box
				key={i}
				index={i}
				{...box}
				events={this.props.events}
			/>);
			if(i == boxes.length-1)
				$boxes.push(this.renderBoxDrop(++i));
			
		}
		return $boxes;
	}
	renderBoxDrop(index){
		const drop_key = "box-drop-"+index;
		return(
			<BoxDrop
				key={drop_key}
				index={index}
				onDrop={this.onBoxDrop.bind(this, index)}
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
	renderSlots(slots, dimensions){
		return slots.map((slot, index)=>{
			let parts = dimensions[index].split("d");
			let width = (parts[0]/parts[1])*100;
			return(
				<Slot
					key={index}
					{...slot}
					dimension={width}
					events={this.props.events}
				>{this.renderBoxes(slot.boxes)}</Slot>
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
					{this.renderSlots(container.slots, dimensions)}
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
				{this.renderContainers(this.props.container)}
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
	onBoxDrop(box, slot, container){
		console.log("dropped on container ");
		console.log(container);
		console.log("dropped on slot ");
		console.log(slot);
		console.log("box dropped ");
		console.log(box);
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


