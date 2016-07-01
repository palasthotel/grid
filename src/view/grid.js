import React from 'react';
import ReactDOM from 'react-dom';
import Container from './container';

export default class Grid extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		const size = this.props.container.length;
		const containers = this.props.container.map((container)=>{
			return(
			  <Container
			    key={container.id}
			    {...container}
			  />
			)
		});
		return (
		  <div className="grid-wrapper">
			  <div className="grid-containers-wrapper">
			    {containers}
			  </div>
		  </div>
		);
	}
}


