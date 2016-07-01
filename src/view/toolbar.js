import React from 'react';
import ReactDOM from 'react-dom';

export default class Toolbar extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			ticked: 0,
		};
		this.tick = this.tick.bind(this);
	}
	tick(){
		this.setState({ticked:++this.state.ticked});
	}
	render(){
		const ticked = this.state.ticked;
		return (
		  <div onClick={this.tick}>
			  Toolbar Clicked {ticked}
		  </div>
		);
	}
}