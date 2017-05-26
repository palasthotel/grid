import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import { ItemTypes } from '../../../constants.js';

const boxTarget = {
	drop(props, monitor) {
		
		const drop = {
			container_index: props.container_index,
			container_id: props.container_id,
			slot_index: props.slot_index,
			slot_id: props.slot_id,
			index: props.index,
		};
		
		const dragged_box = monitor.getItem();
		if(!dragged_box.id){
			// handle self because its an box from outside
			props.onAdd(dragged_box, drop);
			return;
		}
		/**
		 * return a drop result to dragged box
		 */
		return drop;
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
				className={`grid-box__drop ${over_class} ${can_drop_class}`}
			>
				<div className={`grid-box__drop--area`} />
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
	 * if new box from outside was added
	 */
	onAdd: PropTypes.func,
};

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(BoxDrop);