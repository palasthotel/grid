import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import { ItemTypes, Events } from '../../constants.js';
import ContainerDragPreview from '../../helper/container-drag-preview.js';


const containerSource = {
	beginDrag(props){
		console.log("begin drag");
		return {
			id: props.id,
			index: props.index,
			title: props.title,
		};
	},
	endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
		console.log("dropped", item, dropResult);
		if (dropResult) {
			// window.alert( // eslint-disable-line no-alert
			//   `You dropped ${item.name} into ${dropResult.name}!`
			// );
		}
	}
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	}
}

class Container extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		this.state = {active: false};
	}
	componentDidMount(){
		this.props.events.on(Events.GRID_RESIZE.key, this.onGridResize.bind(this));
	}
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { connectDragSource, isDragging, type } = this.props;
		return (
			<div
				className={`container contaner__${type}`}
			     style={{
				     display: isDragging ? "none" : "block",
			     }}
			     ref={ (element) => this.state.dom = element }
			>
				
				<div className="container__controls">
					<span className="container__title">test{this.props.title}</span>
					{connectDragSource(
						<span
							style={{
								cursor: "move"
							}}
							className="container__drag">
						  <i className="icon-drag" />
					  </span>
					)}
					<div className="container__options">
						<span className="container__options-icon">Options <i className="icon-options" /></span>
						<ul className="container__options-list">
							<li className="container__options-list-item" role="edit">
								<i className="icon-edit" /> Edit
							</li>
							<li className="container__options-list-item" role="reuse">
								<i className="icon-reuse" /> Reuse
							</li>
							<li className="container__options-list-item" role="toggleslotstyles">
								<i className="icon-style" /> Slot-styles
							</li>
							<li className="container__options-list-item" role="delete">
								<i className="icon-trash" /> Delete
							</li>
						</ul>
					</div>
				</div>
				
				<div className="container__content">
					<div className="container__before">
						<div className="container__prolog">PROLOG</div>
					</div>
					
					<div className="container__slots">{this.props.children}</div>
					
					<div className="container__after">
						<div className="container__epilog">EPILOG</div>
					</div>
				</div>
			</div>
		)
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onGridResize(size){
		this.buildDragPreview(size);
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
	buildDragPreview(size){
		const { connectDragPreview } = this.props;
		let result = ContainerDragPreview.create(this.state.dom.clientWidth, this.props.slots.length);
		result.img.onload = () => connectDragPreview(result.img);
		result.img.src = result.src;
	}
}

Container.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	connectDragPreview: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	id: PropTypes.any.isRequired
};

export default DragSource(ItemTypes.CONTAINER, containerSource, collect)(Container);