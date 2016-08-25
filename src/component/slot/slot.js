import React from 'react';

export default class Slot extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="grid-slot grid-slot-1d3">
				<StyleChanger />
				<div className="grid-boxes-wrapper boxes-wrapper">{this.props.children}</div>
			</div>
		)
	}
}

class StyleChanger extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className="grid-slot-style-changer style-changer">
			</div>
		)
	}
}