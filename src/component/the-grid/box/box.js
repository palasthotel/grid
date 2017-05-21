import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

import { ItemTypes, States } from '../../../constants.js';
import {BoxDragPreview} from '../../../helper/drag-preview.js';

import TrashIcon from '../../icon/trash.js';

const boxSource = {
	beginDrag(props){
		return {
			container_index: props.container_index,
			container_id: props.container_id,
			slot_index: props.slot_index,
			slot_id: props.slot_id,
			index: props.index,
			id: props.id,
		};
	},
	endDrag(props, monitor) {
		if(!monitor.didDrop()) return;
		const this_box = monitor.getItem();
		const box_drop = monitor.getDropResult();
		props.onMove(this_box, box_drop);
	}
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	}
}

class Box extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
	}
	componentWillReceiveProps(){
		this.buildDragPreview();
	}
	componentDidMount(){
		
		/**
		 * watch resizing of browser
		 */
		window.addEventListener('resize', this.onResize.bind(this));
		this.onResize();
		
	}
	componentWillUnmount(){
		/**
		 * unwatch events if not displayed
		 */
		window.removeEventListener('resize', this.onResize);
	}
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { connectDragSource, connectDragPreview, isDragging} = this.props;
		const {state, titleurl, prolog, epilog, readmore, readmoreurl, html} = this.props;
		const {isMoving, isDeleting, isSaving} = this.props;
		let {title} = this.props;
		if(titleurl){
			title = <h3>
				{titleurl}
				<a
					href={titleurl}
				    className="box-title">
					{title}
					</a>
			</h3>
		} else {
			title = <h3>
				{title}
				</h3>
		}
		return connectDragPreview(
			<div
				className={`box${(isDragging)?" is-dragged":""}`}
				style={{
					opacity: isDragging? 0.3: 1,
				}}
				ref={ (element) => this.box_element = element }
			>
				<div className="box__content">
					{(isSaving)? <p>Box is saving</p>: null}
					{(isDeleting)? <p>Box is deleting</p>: null}
					{(isMoving)? <p>Box is Moving</p>: null}
					{(state === States.LOADING)? <p>{state}</p>: null}
					<span>{title}</span>
					<div className="box__prolog">{prolog}</div>
					<div className="box__html" dangerouslySetInnerHTML={{__html: html}} ></div>
					<div className="box__epilog">{epilog}</div>
					<p className="box__readmore">
						<a href={readmoreurl} >{readmore}</a>
					</p>
				</div>
				{connectDragSource(<div className="box__controls grid-box-movable">
					<i className="grid-box-drag icon-drag" />
					{() => {
						if(false){
							return <div className="grid-box-reused">Reused box <i className="icon-reuse" /></div>;
						}
					}}
					<div
						className="grid-box-control-button grid-box-edit"
					    onClick={this.onEdit.bind(this)}
					>
						<div className="grid-box-control-wrapper">
							<i className="icon-edit" />
							<span className="grid-box-control-text">Edit</span>
						</div>
					</div>
					<div
						className="grid-box-control-button grid-box-delete"
					    onClick={this.onDelete.bind(this)}
					>
						<div className="grid-box-control-wrapper">
							<TrashIcon/>
							<span className="grid-box-control-text">Delete</span>
						</div>
					</div>
				</div>)}
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
		const {container_id, slot_id, id} = this.props;
		this.props.onEdit({ container_id, slot_id, box_id:id });
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
		let result = BoxDragPreview.create(this.box_element.clientWidth);
		result.img.onload = () => connectDragPreview(result.img);
		result.img.src = result.src;
	}
}

Box.defaultProps = {
	isMoving: false,
	isSaving: false,
	isDeleting: false,
};

Box.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	connectDragPreview: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	
	id: PropTypes.any.isRequired,

	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onMove: PropTypes.func.isRequired,
	
	isMoving: PropTypes.bool,
	isSaving: PropTypes.bool,
	isDeleting: PropTypes.bool,
};

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);