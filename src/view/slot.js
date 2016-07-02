import React from 'react';
import ReactDOM from 'react-dom';
import Box from './box';

export default class Slot extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const boxes = this.props.boxes.map((box)=>{
			return(
			  <Box
				key={box.id}
				{...box}
			  />
			)
		});
		return(
		  <div className="grid-slot grid-slot-1d3">
			  <StyleChanger />
			  <div className="grid-boxes-wrapper boxes-wrapper">{boxes}</div>
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