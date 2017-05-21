import React, {Component} from 'react';
import PropTypes from 'prop-types';

import BoxTypeList from './box-type-list.jsx';
import Collapsible from '../../utils/collapsible.js';

import {States} from '../../../constants.js';


class BoxTypes extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
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
						>
							{this.renderBoxes(item)}
						</Collapsible>
					)
				})}
			</div>
		)
	}
	renderBoxes(item){
		return (<BoxTypeList
			item={item}
			onSearch={this.props.onSearch}
		/>)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	// onStateChanged(type, collapsed){
	//
	// 	/**
	// 	 * if there are items do not react on change
	// 	 */
	// 	if(this.getTypeItems(type)!=null) return;
	//
	// 	/**
	// 	 * else load boxes
	// 	 */
	// 	if(typeof this.state[type] == typeof undefined){
	// 		this.props.onSearch((boxes)=>{
	// 			this.setState({state:States.DONE});
	// 		}, type);
	// 		this.state[type] = States.LOADING;
	// 		this.setState( this.state );
	// 	}
	//
	//
	// }
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	// getTypeItems(type){
	// 	for(let item of this.props.items){
	// 		if(item.type == type){
	// 			return (item.boxes)? item.boxes: null;
	// 		}
	// 	}
	// 	return null;
	// }
	// getTypeState(type){
	// 	if(typeof this.state[type] == typeof undefined){
	// 		return States.WAITING;
	// 	}
	// 	return this.state[type];
	// }
}

BoxTypes.defaultProps = {
}

/**
 * define property types
 */
BoxTypes.propTypes = {
	items: PropTypes.array.isRequired,
	onSearch: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default BoxTypes;