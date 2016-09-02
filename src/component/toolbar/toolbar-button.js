"use strict";

import React, { Component, PropTypes } from 'react';

export default class ToolbarButton extends Component{
	
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
			<div
				className={`grid-tool grid-tool-${this.props.unique_id}`}
			>
				<button
					onClick={this.onClick.bind(this)}
				>
					<span className={`icon-${this.props.unique_id}`} />
					{ this.props.label? this.props.label : "Tool Button"  }
				</button>
			</div>
		);
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onClick(){
		console.log("grid tool clicked: "+this.props.unique_id);
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}

Grid.propTypes = {
	unique_id: PropTypes.string.isRequired,
	events: PropTypes.func.isRequired,
	label: PropTypes.string
};


