import React from 'react';
import ReactDOM from 'react-dom';
import Box from './box';

export default class Slot extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const classname = "grid-slot";
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
			  <div class="grid-slot-style-changer style-changer">
			  </div>
			  <div class="grid-boxes-wrapper boxes-wrapper">{boxes}</div>
		  </div>
		)
	}
}