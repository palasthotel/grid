import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import { ItemTypes, Events } from '../../../constants.js';
import {ContainerDragPreview} from '../../../helper/drag-preview.js';


const containerSource = {
	beginDrag(props){
		return {
			id: props.id,
			index: props.index,
			title: props.title,
		};
	},
	endDrag(props, monitor){
		if(!monitor.didDrop()) return;
		const this_container = monitor.getItem();
		const container_drop = monitor.getDropResult();
		props.onMove(this_container,container_drop);
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
		window.addEventListener('resize', this.onResize.bind(this));
		this.buildDragPreview();
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.onResize);
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
				     opacity: isDragging? 0.3: 1,
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
							<li
								className="container__options-list-item"
								role="edit"
							    onClick={this.onEdit.bind(this)}
							>
								<i className="icon-edit" /> Edit
							</li>
							<li className="container__options-list-item" role="reuse">
								<i className="icon-reuse" /> Reuse
							</li>
							<li className="container__options-list-item" role="toggleslotstyles">
								<i className="icon-style" /> Slot-styles
							</li>
							<li
								className="container__options-list-item"
								role="delete"
							    onClick={this.onDelete.bind(this)}
							>
								<i className="icon-trash" /> Delete
							</li>
						</ul>
					</div>
				</div>
				
				<div className="container__content">
					{(this.props.isMoving)? <p>Moving</p>: null}
					{(this.props.isDeleting)? <p>Deleting</p>: null}
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
	onResize(size){
		this.buildDragPreview();
	}
	onEdit(){
		this.props.onEdit(this.props);
	}
	onDelete(){
		this.props.onDelete(this.props);
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
	buildDragPreview(){
		const { connectDragPreview } = this.props;
		let result = ContainerDragPreview.create(this.state.dom.clientWidth, this.props.slots.length);
		result.img.onload = () => connectDragPreview(result.img);
		result.img.src = result.src;
	}
}

Container.defaultProps = {
	
	onEdit: (done)=>{ done(); },
	onDelete: (done)=> { done(); },
	
	isSaving: false,
	isDeleting: false,
};

Container.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	connectDragPreview: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	id: PropTypes.any.isRequired,
	
	onMove: PropTypes.func.isRequired,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
};

export default DragSource(ItemTypes.CONTAINER, containerSource, collect)(Container);