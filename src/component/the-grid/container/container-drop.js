import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../constants.js';

import Collapsible from '../../utils/collapsible.js';

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
	constructor(props){
		super(props);
		this.state = { is_opened: false }
	}
	render() {
		const { connectDropTarget, isOver, canDrop } = this.props;

		const {is_opened } = this.state;
		
		const can_drop_class = (canDrop)? 'can-drop': '';
		const over_class = (isOver)? 'is-over': '';
		
		return connectDropTarget(
			<div
				className={`grid-container__drop ${over_class} ${can_drop_class}`}
			>
				<div className="grid-container__drop--area" />
				<div
					className={`grid-container__select ${(is_opened)? "is-opened":"is-closed" }`}
				>
					<button
						className="grid-container__select--toggle"
						onClick={()=>{this.setState({is_opened:!is_opened})}}
					>
						<span className="grid-container__select--icon">+</span>
						<span className="grid-container__select--open-text">Add Container</span>
						<span className="grid-container__select--close-text">Close</span>
					</button>
					<div className="grid-container__select--types">
						<Collapsible title="Containers">
							<p>Container list!</p>
						</Collapsible>
						<Collapsible title="Sidebars">
							<p>Sidebars list!</p>
						</Collapsible>
						<Collapsible title="Reusable">
							<p>Reusable list!</p>
						</Collapsible>

					</div>
				</div>
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