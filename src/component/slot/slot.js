import {Component} from 'react';

export default class Slot extends Component{
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
			<div className="grid-slot grid-slot-1d3">
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