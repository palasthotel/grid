import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes, Events } from '../../../constants.js';

const containerTarget = {
	drop(props, monitor) {
		return {
			index: props.index,
		};
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
};

export default DropTarget(ItemTypes.CONTAINER, containerTarget, collect)(ContainerDrop);