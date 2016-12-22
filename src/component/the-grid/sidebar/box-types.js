import React, {Component, PropTypes} from 'react';

import Collapsible from '../../utils/collapsible.js';

import {States, Events} from '../../../helper/constants.js';

class BoxTypes extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.events = props.events;
		this.state = {
			box_key_incrementation: 0,
		};
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {items} = this.props;
		
		return (
			<div
				className="box-types"
			>
				{items.map((item,index)=>{
					return (
						<Collapsible
							key={item.type}
							title={item.title}
						    onStateChanged={this.onStateChanged.bind(this, item.type)}
						>
							{/* TODO: criteria intelligent search input field */}
							{this.renderBoxes(item)}
						</Collapsible>
					)
				})}
			</div>
		)
	}
	renderBoxes(item){
		if(typeof item.boxes == typeof undefined) return this.state[item.type];
		return item.boxes.map((box)=>{
			return <div key={this.state.box_key_incrementation++} dangerouslySetInnerHTML={{ __html : box.html}} />
		});
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onStateChanged(type, collapsed){
		
		/**
		 * if there are items do not react on change
		 */
		if(this.getTypeItems(type)!=null) return;
		
		/**
		 * else load boxes
		 */
		if(typeof this.state[type] == typeof undefined){
			this.events.emit(Events.GET_BOX_TYPES.key,type);
			this.state[type] = States.LOADING;
			this.setState( this.state );
		}
	}
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	getTypeItems(type){
		for(let item of this.props.items){
			if(item.type == type){
				return (item.boxes)? item.boxes: null;
			}
		}
		return null;
	}
	getTypeState(type){
		if(typeof this.state[type] == typeof undefined){
			return States.WAITING;
		}
		return this.state[type];
	}
}

/**
 * define property types
 */
BoxTypes.propTypes = {
	items: PropTypes.array.isRequired
};

/**
 * export component to public
 */
export default BoxTypes;