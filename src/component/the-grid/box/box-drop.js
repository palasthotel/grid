import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import { ItemTypes, Events } from '../../../constants.js';

const boxTarget = {
	drop(props, monitor) {
		/**
		 * return a drop result to draggable
		 */
		return {
			container_index: props.container_index,
			container_id: props.container_id,
			slot_index: props.slot_index,
			slot_id: props.slot_id,
			index: props.index,
		}
	},
	// hover(props, monitor, component){
	// 	console.log("hover!");
	// }
};

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	};
}


class BoxDrop extends Component {
	render() {
		const { connectDropTarget, isOver, canDrop } = this.props;
		
		const can_drop_class = (canDrop)? 'can-drop': '';
		const over_class = (isOver)? 'is-over': '';
		
		
		return connectDropTarget(
			<div
				className={`box-drop ${over_class} ${can_drop_class}`}
			>
				<div
					className={`box-drop__area`}
				></div>
			</div>
		);
	}
}

BoxDrop.propTypes = {
	
	/**
	 * positions
	 */
	container_index: PropTypes.number.isRequired,
	slot_index:PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	
	/**
	 * state
	 */
	isOver: PropTypes.bool,
};

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(BoxDrop);