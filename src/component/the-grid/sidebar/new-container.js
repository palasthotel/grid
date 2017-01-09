import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import {ContainerDragPreview} from '../../../helper/drag-preview.js';

import { ItemTypes } from '../../../constants.js';

const containerSource = {
	beginDrag(props){
		/**
		 * for monitor.getItem() in endDrag
		 */
		return props.item;
	},
	endDrag(props, monitor) {
		// const box_drop_area = monitor.getDropResult();
		//
		// if(monitor.didDrop() && typeof box_drop_area == typeof {}){
		// 	/**
		// 	 * monitor.getItem() is item returned from beginDrag
		// 	 */
		// 	const item = monitor.getItem();
		// 	console.log("did drop", props, item, box_drop_area);
		//
		// }
	}
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}

class NewContainer extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {};
		
	}
	
	componentWillMount(){
		
		this.state.preview = ContainerDragPreview.createByType(100, this.props.item.type).src;
	}
	componentDidMount(){
		
		this.setState({preview: ContainerDragPreview.createByType(this.state.preview_img.parentNode.clientWidth, this.props.item.type).src})
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const { connectDragSource, isDragging, item } = this.props;
		return connectDragSource(
			<div
				className="container__new"
				
			>
				<div
					className="container__preview_wrapper"
				>
					<img
						ref={(element)=> this.state.preview_img = element}
						className="container__preview"
						src={this.state.preview}
					/>
				</div>
				
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
}

NewContainer.defaultProps = {
	onDropped: ()=>{},
}

NewContainer.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	item: PropTypes.object.isRequired,
};

/**
 * export component to public
 */
export default DragSource(ItemTypes.CONTAINER, containerSource, collect)(NewContainer);