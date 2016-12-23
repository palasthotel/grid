import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import { ItemTypes, Events, States } from '../../../constants.js';
import {BoxDragPreview} from '../../../helper/drag-preview.js';

import TrashIcon from '../../icon/trash.js';

const boxSource = {
	beginDrag(props){
		return {
			container_index: props.container_index,
			container_id: props.container_id,
			slot_index: props.slot_index,
			slot_id: props.slot_id,
			box_index: props.index,
			box_id: props.id,
		};
	},
	endDrag(props, monitor) {
		
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
		
		props.events.emit(Events.BOX_MOVE, item, dropResult);
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
		this.state = {};
	}
	componentDidMount(){
		this.props.events.on(Events.GRID_RESIZE.key, this.onGridResize.bind(this));
		this.buildDragPreview();
	}
	componentWillUnmount(){
		this.props.events.off(Events.GRID_RESIZE.key, this.onGridResize.bind(this));
		
	}
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { connectDragSource, connectDragPreview, isDragging, box} = this.props;
		const {state, titleurl, prolog, epilog, readmore, readmoreurl, html} = this.props;
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
				ref={ (element) => this.state.dom = element }
			>
				<div className="box__content">
					{(state == States.LOADING)? <p>{state}</p>: null}
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
					<div className="grid-box-control-button grid-box-edit">
						<div className="grid-box-control-wrapper">
							<i className="icon-edit" />
							<span className="grid-box-control-text">Edit</span>
						</div>
					</div>
					<div className="grid-box-control-button grid-box-delete">
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
	onGridResize(size){
		this.buildDragPreview();
	}
	
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
	buildDragPreview(){
		const { connectDragPreview } = this.props;
		let result = BoxDragPreview.create(this.state.dom.clientWidth);
		result.img.onload = () => connectDragPreview(result.img);
		result.img.src = result.src;
	}
}

Box.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	connectDragPreview: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	id: PropTypes.any.isRequired,
};

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);