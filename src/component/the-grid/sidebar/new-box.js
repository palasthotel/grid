import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

import { ItemTypes } from '../../../constants.js';

const boxSource = {
	beginDrag(props){
		/**
		 * for monitor.getItem() in endDrag
		 */
		return props.item;
	},
	endDrag(props, monitor) {
		// const box_drop_area = monitor.getDropResult();
		//
		// if(monitor.didDrop() && typeof box_drop_area == typeof {}){
		// 	/**
		// 	 * monitor.getItem() is item returned from beginDrag
		// 	 */
		// 	const item = monitor.getItem();
		// 	console.log("did drop", props, item, box_drop_area);
		//
		// }
	}
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}

/**
 * NewBox component
 */
class NewBox extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		this.state = {};
	}
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { connectDragSource, isDragging, item } = this.props;
		return connectDragSource(
			<div
				className={`box box__new ${(isDragging)?" is-dragged":""}`}
				style={{
					padding: "5px",
					border: isDragging? "1px solid transparent": "1px solid black",
				}}
				ref={ (element) => this.state.dom = element }
			>
				<div className="box__content">
					<div className="box__html" dangerouslySetInnerHTML={{__html: item.html}} />
				</div>
			</div>
		)
	}
}

NewBox.defaultProps = {
	onDropped: ()=>{},
}

NewBox.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	item: PropTypes.object.isRequired,
};

export default DragSource(ItemTypes.BOX, boxSource, collect)(NewBox);