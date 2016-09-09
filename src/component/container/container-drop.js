import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../constants.js';

const containerTarget = {
	drop(props, monitor) {
		console.log("drop");
		props.onDrop(monitor.getItem());
		return {dropped: true};
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
	onDrop(){
		console.log("onDrop");
	}
	render() {
		const { connectDropTarget, isOver, canDrop } = this.props;
		
		const color = (isOver)? 'red': 'transparent';
		const display = (canDrop)? 'block': 'none';
		
		return connectDropTarget(
			<div className="container__drop-area-wrapper" style={{
				display: display
			}}>
				<div className="container__drop-area" style={{
					backgroundColor: color,
				}}></div>
			</div>
		);
	}
}

ContainerDrop.propTypes = {
	index: PropTypes.number.isRequired,
	isOver: PropTypes.bool.isRequired,
	onDrop: PropTypes.func.isRequired
};

export default DropTarget(ItemTypes.CONTAINER, containerTarget, collect)(ContainerDrop);