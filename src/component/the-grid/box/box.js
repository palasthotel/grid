import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import { ItemTypes, Events } from '../../../constants.js';
import {BoxDragPreview} from '../../../helper/drag-preview.js';

import TrashIcon from '../../icon/trash.js';

const boxSource = {
	beginDrag(props){
		console.log("begin drag");
		return {
			id: props.id,
			index: props.index
		};
	},
	endDrag(props, monitor) {
		console.log("end drop");
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
		
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
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { connectDragSource, connectDragPreview, isDragging } = this.props;
		let title = "";
		if(this.props.titleurl){
			title = <h3>
				{this.props.titleurl}
				<a
					href={this.props.titleurl}
				    className="box-title">
					{this.props.title}
					</a>
			</h3>
		} else {
			title = <h3>
				{this.props.title}
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
					<span>{title}</span>
					<div className="box__prolog">{this.props.prolog}</div>
					<div className="box__html" dangerouslySetInnerHTML={{__html: this.props.html}} ></div>
					<div className="box__epilog">{this.props.epilog}</div>
					<p className="box__readmore">
						<a href={this.props.readmoreurl} >{this.props.readmore}</a>
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
	id: PropTypes.any.isRequired
};

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);