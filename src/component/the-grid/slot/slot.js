import React, { Component, PropTypes } from 'react';

class Slot extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
	}
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		return(
			<div
				className="slot"
			    style={{
			    	width: this.props.dimension+"%",
			    }}
			>
				<StyleChanger />
				<div className="grid-boxes-wrapper boxes-wrapper">{this.props.children}</div>
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
Slot.propTypes = {
	dimension: PropTypes.number.isRequired,
}

export default Slot;

class StyleChanger extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
	}
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		return (
			<div className="grid-slot-style-changer style-changer">
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