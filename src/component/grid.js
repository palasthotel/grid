"use strict";

import React, { Component, PropTypes } from 'react';

import Container from './container/container.js';
import ContainerDrop from './container/container-drop.js';
import Slot from './slot/slot';
import BoxDrop from './box/box-drop.js';
import Box from './box/box.js';

import { Events } from '../constants.js';

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
			var box = boxes[i];
			$boxes.push(this.renderBoxDrop(i));
			$boxes.push(<Box
				key={i}
				index={i}
				{...box}
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
			/>
		);
	}
	
	/**
	 * render slots
	 * @param slots
	 * @returns {*}
	 */
	renderSlots(slots){
		return slots.map((slot, index)=>{
			return(
				<Slot
					key={index}
					{...slot}
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
		let drop_key = "";
		
		for(let i = 0; i < containers.length; i++ ){
			let container = containers[i];
			
			/**
			 * render drop area for containers
			 * @type {string}
			 */
			drop_key = "container-drop_"+i;
			$containers.push(this.renderContainerDrop(i));
			
			/**
			 * render container
			 */
			$containers.push((
				<Container
					key={container.id}
					{...container}
					index={i}
				    events={this.props.events}
				>
					{this.renderSlots(container.slots)}
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
			<div className="grid-wrapper">
				<div
					className="grid-containers-wrapper"
					ref={(element)=> this.state.dom = element}
				>
					{this.renderContainers(this.props.container)}
				</div>
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


