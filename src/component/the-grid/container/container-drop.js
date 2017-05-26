import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../constants.js';

import ContainerTypes from '../sidebar/container-types';

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

		const can_drop_class = (canDrop)? 'can-drop': '';
		const over_class = (isOver)? 'is-over': '';
		
		return connectDropTarget(
			<div
				className={`grid-container__drop ${over_class} ${can_drop_class}`}
			>
				<div className="grid-container__drop--area" />
				{this.renderInPlace()}
			</div>
		);
	}

	renderInPlace(){
		const {container_types} = this.props;
		if(container_types.length < 1) return null;
		const {is_opened} = this.state;

		const collapsed = (!is_opened)? true: undefined;

		return (
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
					<Collapsible title="Containers" collapsed={collapsed}>
						{container_types.map((container,index)=>{
							if(container.type.indexOf("i-") === 0
								|| container.type.indexOf("sc-") === 0
								|| container.type.indexOf("s-") === 0
							)
								return;
							return this.renderContainer(container);
						})}
					</Collapsible>
					<Collapsible title="Sidebars" collapsed={collapsed}>
						{container_types.map((container,index)=>{
							if(container.type.indexOf("i-") === 0
								|| container.type.indexOf("sc-") === 0
								|| container.type.indexOf("c-") === 0
							)
								return;
							return this.renderContainer(container);
						})}
					</Collapsible>
					<Collapsible title="Reusable">
						<p>Reusable list!</p>
					</Collapsible>

				</div>
			</div>
		)

	}

	renderContainer(container){

		const slots = [];

		let dimensions = container.type.split("-");

		for(let i = 1; i < dimensions.length; i++){
			const dim = dimensions[i]
			if(dim === "0") continue;
			let parts = dim.split("d");

			slots.push(<div
				key={i}
				className={`grid-slot-with__${parts[0]}`}
			/>);
		}

		return (
			<div
				className="grid-container-preview"
				key={container.type}
				onClick={this.onClickAdd.bind(this, container)}
			>
				{slots}
			</div>
		)
	}

	onClickAdd(container){
		this.props.onAdd(container, this.props.index)
		this.setState({is_opend: false});
	}

}
ContainerDrop.defaultProps = {
	container_types: [],
}
ContainerDrop.propTypes = {
	index: PropTypes.number.isRequired,
	isOver: PropTypes.bool,
	
	/**
	 * if new container from outside was added
	 */
	onAdd: PropTypes.func,

	container_types: PropTypes.array,
};

export default DropTarget(ItemTypes.CONTAINER, containerTarget, collect)(ContainerDrop);