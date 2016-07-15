import React, {Component} from 'react';
import ContainerTypeHelper from '../../helper/container-type.js'


export default class ContainerTypes extends React.Component{
	
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	renderContainer(container){
		if(!container.type.startsWith("c-") && !container.type.startsWith('s-')) return;
		return(
			<ContainerType
				key={container.type}
			    container={container}
			    trashed={false}
			/>
		);
	}
	render(){
		return(
			<div className="container-factory-types">
				{this.props.container_types.map((container) => this.renderContainer(container ))}
			</div>
		)
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}

export class ContainerType extends React.Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		this.state = {
			trashed: props.trashed,
		}
	}
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	renderSlot(slot, index){
		const style = {
			width: ContainerTypeHelper.getSlotWidth(slot)+"%",
		}
		return(
			<div
				key={index}
				style={style}
				className="container-factory-type-slot"
			>
				{slot}
			</div>
		)
	}
	render(){
		const sizes = ContainerTypeHelper.getSlotSizes(this.props.container.type);
		return(
			<div
				className="container-factory-type"
			>
				{sizes.map(this.renderSlot.bind(this))}
			</div>
		);
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}
