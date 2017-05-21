"use strict";

import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
		const {identifier, label, icon} = this.props;
		return (
			<div
				className={`toolbar-button toolbar-button__${identifier}`}
			>
				<button
					onClick={this.onClick.bind(this)}
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
		this.props.onClick(null);
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


