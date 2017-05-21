import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../constants.js';

const containerTarget = {
	drop(props, monitor) {
		const dragged_container = monitor.getItem();
		if(!dragged_container.id){
			// handle self because its a new container from outside
			props.onAdd(dragged_container, props.index);
			return;
		}
		return {
			index: props.index,
		};
	}
};

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	};
}

class ContainerDrop extends Component {
	render() {
		const { connectDropTarget, isOver, canDrop } = this.props;
		
		const can_drop_class = (canDrop)? 'can-drop': '';
		const over_class = (isOver)? 'is-over': '';
		
		return connectDropTarget(
			<div
				className={`container-drop ${over_class} ${can_drop_class}`}
			>
				<div className="container-drop__area"></div>
			</div>
		);
	}
}

ContainerDrop.propTypes = {
	index: PropTypes.number.isRequired,
	isOver: PropTypes.bool,
	
	/**
	 * if new container from outside was added
	 */
	onAdd: PropTypes.func,
};

export default DropTarget(ItemTypes.CONTAINER, containerTarget, collect)(ContainerDrop);