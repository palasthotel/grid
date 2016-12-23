import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import { ItemTypes, Events } from '../../../constants.js';

const boxSource = {
	beginDrag(props){
		/**
		 * for monitor.getItem() in endDrag
		 */
		return props.item;
	},
	endDrag(props, monitor) {
		const drop_result = monitor.getDropResult();
		
		if(monitor.didDrop() && typeof drop_result == typeof {}){
			/**
			 * monitor.getItem() is item returned from beginDrag
			 */
			const item = monitor.getItem();
			console.log("did drop", props, item, drop_result);
			
			props.events.emit(Events.BOX_ADD, item, drop_result);
		}
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

NewBox.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	item: PropTypes.object.isRequired,
};

export default DragSource(ItemTypes.BOX, boxSource, collect)(NewBox);