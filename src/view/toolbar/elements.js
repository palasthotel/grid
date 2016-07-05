import React, {Component} from 'react';

class BoxBlueprint extends Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
			<div className={`grid-new-element grid-box-dragger grid-new-box ${this.props.type} ui-draggable`}>
				<i className="icon-drag grid-element-drag-icon" />
				<div className="grid-new-box">
					<div className="grid-element-title" dangerouslySetInnerHTML={{__html: this.props.html}}></div>
				</div>
			</div>
		);
	}
}

class ContainerBlueprint extends Component{
	constructor(props) {
		super(props);
	}
	renderSlot(slot, index){
		console.log([slot, index]);
		return (
			<div key={index} className={`grid-slot grid-slot-${slot}`}></div>
		);
	}
	render(){
		let content = "";
		if(this.props.reused){
			content = (
				<div className="grid-new-container-slots grid-reuseable-container">
					<p className="grid-element-title grid-reusable-container-title">{this.props.reusetitle}</p>
				</div>
			);
		} else {
			let classes = "grid-new-container-slots"+
				" grid-container-"+this.props.type+
				" grid-container-left-space-"+this.props.space_to_left+
				" grid-container-right-space-"+this.props.space_to_right;
			let slots = this.props.type.split("-").slice(1);
			content = (
				<div
					className={classes}
				style={{
					width: '100%'
				}}>
					{slots.map(this.renderSlot.bind(this))}
				</div>
			);
		}
		return (
			<div className="grid-new-element ">
				<i className="icon-drag grid-element-drag-icon" />
				{content}
			</div>
		);
	}
}

export default class Elements extends Component{
	constructor(props) {
		super(props);
		this.state = {
			type: "containers",
		}
	}
	renderContainer(obj){
		return (
			<ContainerBlueprint
				key={obj.type}
				{...obj}
				/>
		);
	}
	renderBox(obj){
		return (
			<BoxBlueprint
				key={obj.type}
				{...obj}
			/>
		);
	}
	onTypeChange(type){
		this.setState({type});
	}
	render(){
		var $contents = null;
		if(this.state.type == "containers"){
			$contents = this.props.container_types.map(this.renderContainer.bind(this));
		} else {
			$contents = this.props.container_types.map(this.renderBox.bind(this));
		}
		return (
		  <div className="grid-tool-elements">
			  <div className="grid-element-type-select">
				  <div
					  onClick={this.onTypeChange.bind(this,"containers")}
					  className={`grid-element-type ${(this.state.type == "containers")? "active" : "" }`}
				  >
					  Container
				  </div>
				  <div
					  onClick={this.onTypeChange.bind(this,"boxes")}
					  className={`grid-element-type ${(this.state.type != "containers")? "active" : "" }`}
				  >
					  Box
				  </div>
			  </div>
			  <div className="grid-element-type-content">{$contents}</div>
			  <div className="grid-element-trash">
				  <div>Delete<span className="icon-trash" /></div>
			  </div>
		  </div>
		);
	}
}