import React, {Component, PropTypes} from 'react';

import {Events} from '../../../constants.js';

import Box from './new-box';

let box_key_incrementation = 0;


class BoxTypeList extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.key_incrementation = 0;
		this.state = {
			loading: false,
			query: "",
			boxes: props.item.boxes,
		};
	}
	componentDidMount(){
		if(!this.state.boxes){
			this.onSearch();
		}
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		return (<div>
			{this.renderCriteria()}
			{(this.state.loading)? <p>loading</p>:null}
			{this.renderBoxes()}
		</div>);
	}
	
	renderCriteria() {
		const {criteria} = this.props.item;
		if (criteria.length < 1) return null;
		
		// TODO: advanced criteria rendering #
		
		return (
			<div>
				<input
					type="text"
					value={this.state.query}
				    onChange={this.onQueryChange.bind(this)}
				/>
			</div>
		)
	}
	
	renderBoxes(){
		const {boxes} = this.state;
		if(typeof boxes == typeof undefined || typeof boxes != typeof []) return null;
		return boxes.map((box)=>{
			return <Box
				item={box}
				key={this.key_incrementation++}
			    events={this.props.events}
			/>
		});
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onQueryChange(e){
		this.setState({query: e.target.value, loading: true});
		/**
		 * not every change for performance
		 */
		clearTimeout(this.timeout);
		this.timeout = setTimeout(()=>{
			this.onSearch()
		},600);
	}
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	onSearch(){
		this.setState({loading: true});
		this.props.onSearch(this.props.item.type, this.props.item.criteria, this.state.query,(boxes)=>{
			this.setState({loading: false, boxes: boxes});
		});
	}
}

/**
 * define property types
 */
BoxTypeList.propTypes = {
	item: PropTypes.object.isRequired,
	
	onSearch: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default BoxTypeList;