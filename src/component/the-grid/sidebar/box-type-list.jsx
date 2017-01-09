import React, {Component, PropTypes} from 'react';

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
			loading: false,
			query: "",
		};
	}
	componentDidMount(){
		if(!this.props.boxes){
			this.onSearch();
		}
	}
	
	componentWillReceiveProps(nextProps){
		this.setState({loading: false });
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
		this.setState({loading: true});
		this.props.onSearch((boxes)=>{
			// is updated via properties from parent because of possible unmounting problem
		},this.props.item.type, this.props.item.criteria, this.state.query);
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