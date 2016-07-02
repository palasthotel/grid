import React from 'react';
import ReactDOM from 'react-dom';

export default class Box extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const class_name = "grid-box ";
		let title = "";
		if(this.props.titleurl){
			title = <h3>{this.props.titleurl}<a href={this.props.titleurl} className="box-title">{this.props.title}</a></h3>
		} else {
			title = <h3>{this.props.title}</h3>
		}
		return(
		  <div className={class_name}>
			  <div className="grid-box-content">
				  {title}
				  <div className="prolog">{this.props.prolog}</div>
				  <div className="content" dangerouslySetInnerHTML={{__html: this.props.html}} ></div>
				  <div className="epilog">{this.props.epilog}</div>
				  <p className="readmore">
					  <a href={this.props.readmoreurl} >{this.props.readmore}</a>
				  </p>
			  </div>
			  <div className="grid-box-controls grid-box-movable">
				  <i className="grid-box-drag icon-drag" />
				  <div className="grid-box-control-button grid-box-edit">
					  <div className="grid-box-control-wrapper">
						  <i className="icon-edit" />
						  <span className="grid-box-control-text">Edit</span>
					  </div>
				  </div>
				  <div className="grid-box-reused">Reused box <i className="icon-reuse" /></div>
				  <div className="grid-box-control-button grid-box-delete">
					  <div className="grid-box-control-wrapper">
						  <i className="icon-trash" />
						  <span className="grid-box-control-text">Delete</span>
					  </div>
				  </div>
			  </div>
		  </div>
		)
	}
}