import React, {Component, PropTypes} from 'react';

import BoxTypeList from './box-type-list.jsx';
import Collapsible from '../../utils/collapsible.js';

import {States, Events} from '../../../constants.js';

class BoxType extends Component{
	constructor(props){
		super(props);
		
	}
}

class BoxTypes extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {};
		
	}
	componentDidMount(){
		this.props.events.on(Events.GOT_BOX_TYPE_SEARCH,this.onSearchResult.bind(this));
	}
	componentWillUnmount(){
		this.props.events.off(Events.GOT_BOX_TYPE_SEARCH,this.onSearchResult.bind(this));
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
			events={this.props.events}
		/>)
		
		
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
			this.props.events.emit(Events.GET_BOX_TYPES.key,type);
			this.state[type] = States.LOADING;
			this.setState( this.state );
		}
	}
	onSearchResult(){
		this.setState({state:States.DONE});
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