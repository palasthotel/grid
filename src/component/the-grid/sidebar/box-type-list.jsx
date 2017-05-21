import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Events} from '../../../constants.js';

import NewBox from './new-box';

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
			query: "",
		};
	}
	componentDidMount(){
		if(typeof this.props.item.boxes !== typeof []){
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
			{(this.props.loading)? <p>loading</p>:null}
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
					ref={ (input)=> { this.input_query = input } }
				/>
			</div>
		)
	}
	
	renderBoxes(){
		const {boxes} = this.props.item;
		if(typeof boxes == typeof undefined || typeof boxes != typeof []) return null;
		return boxes.map((box)=>{
			return <NewBox
				item={box}
				key={this.key_incrementation++}
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
		const {type, criteria } = this.props.item;
		this.props.onSearch( type, criteria, "");
	}
}

/**
 * define property types
 */
BoxTypeList.propTypes = {
	item: PropTypes.object.isRequired,
	onSearch: PropTypes.func.isRequired,
	is_loading: PropTypes.bool,
};

/**
 * export component to public
 */
export default BoxTypeList;