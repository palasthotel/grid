import React from 'react';
import ReactDOM from 'react-dom';

export default class Box extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const classname = "grid-box ";
		return(
		  <div className={classname}>BOX</div>
		)
	}
}