import React, {Component, PropTypes} from 'react';
import {EventEmitter} from 'events';

import TheGrid from '../component/the-grid/the-grid.js';
import Backend from '../connection/backend.js'
import {Grid} from '../model/grid.js';
import {Container} from '../model/container.js';

class TheGridRouter extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		
		this.state = {
			loading: true,
		};
		
		this.grid = new Grid({id:props.grid_id});
		
		this.revisions = {};
		this.container_types = {};
		this.box_types = {};
		this.backend = new Backend(props.ajax_url);
		
		this.events = new EventEmitter();
		this.events.setMaxListeners(0);
	}
	
	componentDidMount(){
		// TODO: get data from grid
		this.backend.execute("grid.document","loadGrid",[this.grid.id], this.onLoadedGrid.bind(this));
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		if(this.state.loading){
			return(<div className="the-grid loading">Loading...</div>)
		} else {
			return (
				<TheGrid
					grid={this.grid.toJSON()}
					revisions={this.revisions}
					container_types={this.container_types}
					box_types={this.box_types}
				/>
			)
		}
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onLoadedGrid(data){
		console.log(data, this.grid);
		this.grid.container.add(data.result.container);
		// for(let ci = 0; ci < data.result.container.length; ci++){
		// 	const container = data.result.container[ci];
		//
		// }
		console.log(this.grid);
		this.setState({loading:false});
	}
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
}

/**
 * property defaults
 */
TheGridRouter.defaultProps = {
	mode: "",
};

/**
 * define property types
 */
TheGridRouter.propTypes = {
	grid_id: PropTypes.number.isRequired,
	ajax_url: PropTypes.string.isRequired,
};

/**
 * export component to public
 */
export default TheGridRouter;