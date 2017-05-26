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
			<li
				className={`grid-menu__item grid-adminbar__item--${identifier}`}
			>
				<button
					className="grid-menu__button"
					onClick={this.onClick.bind(this)}
				>
					{label}
				</button>
				{this.props.children}
			</li>
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


