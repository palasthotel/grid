import React, {Component} from 'react';
import PropTypes from 'prop-types';

import BoxTypeList from './box-type-list';


class BoxInPlaceList extends Component {
	
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
			className={`grid-box__select ${(this.isActive())? "is-opened":"is-closed" }`}
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

		/**
		 *

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
		 */

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

	onClickToggle(){
		if(this.isInPlaceActive()){
			this.props.onBoxShowInPlaceDialog({});
		} else {
			const {container_id, slot_id, index} = this.props;
			this.props.onBoxShowInPlaceDialog({
				container_id,
				slot_id,
				index,
			});
		}

	}

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

	isActive(){

		return (typeof box_dialog === typeof {}
		&& box_dialog.container_id === this.props.container_id
		&& box_dialog.slot_id === this.props.slot_id
		&& box_dialog.index === index)
	}
}

BoxInPlaceList.defaultProps = {
}

/**
 * define property types
 */
BoxInPlaceList.propTypes = {
	items: PropTypes.array.isRequired,
	onSearch: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default BoxInPlaceList;