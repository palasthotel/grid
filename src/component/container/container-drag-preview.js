import React, { Component, PropTypes } from 'react';

export default class ContainerDragPreview extends Component{
	render(){
		const class_name = "grid-container grid-contaner-"+this.props.type+" grid-container-drag-preview";
		const {title, type, slots} = this.props;
		
		return (
			<div className={class_name}>
				<p>{title} Slots: {slots} {type}</p>
			</div>
		)
	}
		
}

ContainerDragPreview.propTypes = {
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	slots: PropTypes.number.isRequired,
};