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
		const {identifier, label, onClick, icon} = this.props;
		return (
			<div
				className={`toolbar-button toolbar-button__${identifier}`}
			>
				<button
					onClick={onClick}
				>
					{this.props.children}
					<div className="toolbar-button__label">{label}</div>
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

ToolbarButton.defaultProps = {
	identifier: "",
	label: "Tool-Button",
	onClick: ()=>{ }
}

ToolbarButton.propTypes = {
	
	identifier: PropTypes.string,
	
	label: PropTypes.string,
	
	onClick: PropTypes.func,
};


