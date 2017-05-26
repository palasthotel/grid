import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Collapsible from '../../utils/collapsible.js';

import BoxTypes from '../sidebar/box-types'

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

				{this.renderInPlace()}
			</div>
		);
	}


	renderInPlace(){
		const {box_types} = this.props;
		const {box_dialog} = this.props.ui_state;
		if(box_types.length < 1) return null;

		const is_active = (
			typeof box_dialog === typeof {}
			&& box_dialog.container_id === this.props.container_id
			&& box_dialog.slot_id === this.props.slot_id
			&& box_dialog.index === this.props.index
		);

		console.log(is_active, box_dialog)

		return (
			<div
				className={`grid-box__select ${(is_active)? "is-opened":"is-closed" }`}
			>
				<button
					className="grid-box__select--toggle"
					onClick={this.onClickToggle.bind(this)}
				>
					<span className="grid-box__select--icon">+</span>
					<span className="grid-box__select--open-text">Add Box</span>
					<span className="grid-box__select--close-text">Close</span>
				</button>

				{(is_active)? this.renderBoxes(): null}



			</div>
		)

	}

	renderBoxes(){
		console.log("RENDER BOXEDS");
		const {box_types} = this.props;
		return(
			<div className="grid-box__select--types">

				<BoxTypes
					items={box_types}
					onSearch={this.props.onSearch}
				/>

			</div>
		)
	}

	onClickToggle(){
		const {container_id, slot_id, index} = this.props;
		this.props.onBoxShowInPlaceDialog({
			container_id,
			slot_id,
			index,
		});
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
	onSearch: PropTypes.func,

	onBoxShowInPlaceDialog: PropTypes.func.isRequired,
};

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(BoxDrop);