import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import { ItemTypes } from '../../constants';


const boxTarget = {
	drop(props, monitor) {
		console.log("drop");
		props.onDrop(monitor.getItem());
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
		
		const color = (isOver)? 'red': 'transparent';
		const display = (canDrop)? 'block': 'none';
		
		return connectDropTarget(
			<div
				className="box-drop"
			>
				<div
					className="box-drop__area"
					style={{
						backgroundColor: color,
						display: display
					}}
				></div>
			</div>
		);
	}
}

BoxDrop.propTypes = {
	index: PropTypes.number.isRequired,
	isOver: PropTypes.bool.isRequired,
	onDrop: PropTypes.func.isRequired
};

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(BoxDrop);