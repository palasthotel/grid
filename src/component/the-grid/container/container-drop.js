import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../constants.js';

import {
	get_slot_weights
} from '../../../helper/dimensions';

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
		const {container_edit_index} = this.props.ui_state;
		if(container_types.length < 1) return null;

		return (
			<div
				className={`grid-container__select ${(container_edit_index === this.props.index)? "is-opened":"is-closed" }`}
			>
				<button
					className="grid-container__select--toggle"
					onClick={this.onClickToggle.bind(this)}
				>
					<span className="grid-container__select--icon">+</span>
					<span className="grid-container__select--open-text">Add Container</span>
					<span className="grid-container__select--close-text">Close</span>
				</button>


				<div className="grid-container__select--types">
					<Collapsible
						title="Containers"
						collapsed={!this.isOpenType("c")}
						onStateChanged={this.onCollapsedStateChange.bind(this, "c")}
					>
						{container_types.map((container,index)=>{
							if(container.type.indexOf("i-") === 0
								|| container.type.indexOf("sc-") === 0
								|| container.type.indexOf("s-") === 0
							)
								return;
							return this.renderContainer(container);
						})}
					</Collapsible>
					<Collapsible
						title="Sidebars"
						collapsed={!this.isOpenType("s")}
						onStateChanged={this.onCollapsedStateChange.bind(this, "s")}
					>
						{container_types.map((container,index)=>{
							if(container.type.indexOf("i-") === 0
								|| container.type.indexOf("sc-") === 0
								|| container.type.indexOf("c-") === 0
							)
								return;
							return this.renderContainer(container);
						})}
					</Collapsible>
					<Collapsible
						title="Reusable"
						collapsed={!this.isOpenType("r")}
						onStateChanged={this.onCollapsedStateChange.bind(this, "r")}
					>
						<p>Reusable list!</p>
					</Collapsible>

				</div>
			</div>
		)

	}

	renderContainer(container){
		const slots = [];
		const items = get_slot_weights(container);
		for(const i in items){
			const item = items[i];
			slots.push(<div
				key={i}
				className={`grid-container-preview__slot grid-slot__width--${item.weight} ${(item.space)? "is-space": ""}`}
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
	onClickToggle(){
		this.props.onUiStateChange("container_edit_index", (this.props.index === this.props.ui_state.container_edit_index)? undefined: this.props.index);
	}
	onCollapsedStateChange(type){
		const open_types = this.getOpenTypes();

		if( open_types.hasOwnProperty(type) ){
			delete open_types[type];
		} else {
			open_types[type] = 1;
		}
		this.props.onUiStateChange("container_edit_open_types", open_types);
	}
	getOpenTypes(){
		return {...this.props.ui_state.container_edit_open_types}
	}
	isOpenType(type){
		return (this.getOpenTypes().hasOwnProperty(type))
	}

}
ContainerDrop.defaultProps = {
	container_types: [],
	ui_state: {},
}
ContainerDrop.propTypes = {
	index: PropTypes.number.isRequired,
	isOver: PropTypes.bool,

	
	/**
	 * if new container from outside was added
	 */
	onAdd: PropTypes.func,

	container_types: PropTypes.array,

	onUiStateChange: PropTypes.func.isRequired,
	ui_state: PropTypes.object.isRequired,
};

export default DropTarget(ItemTypes.CONTAINER, containerTarget, collect)(ContainerDrop);