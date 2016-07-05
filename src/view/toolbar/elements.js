import React, {Component} from 'react';

export default class Elements extends Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  <div className="grid-tool-elements">
			  <div className="grid-element-type-select">
				  <div className="grid-element-type" data-type="container">Container</div>
				  <div className="grid-element-type" data-type="box">Box</div>
			  </div>
			  <div className="grid-element-type-content"></div>
			  <div className="grid-element-trash">
				  <div>Delete<span className="icon-trash"></span></div>
			  </div>
		  </div>
		);
	}
}