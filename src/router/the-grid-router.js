
import React, {Component, PropTypes} from 'react';

import GridEvents from './grid-event.js';
import {Events} from '../constants.js';

import Backend from '../connection/backend.js'
import BackendHandler from './backend-handler';
import GUIHandler from './gui-handler';

import TheGrid from '../component/the-grid/the-grid.js';


/**
 * this is where all input and output will be handled
 * all other sub components should only use states and props
 */
class TheGridRouter extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		
		/**
		 * save global config
		 */
		this._config = window.grid;
		
		/**
		 * grid events objects
		 * @type {GridEvent}
		 */
		this._events = new GridEvents();
		
		/**
		 * grid backend connection
		 * @type {Backend}
		 */
		this._backend = new Backend(this.getConfig().endpoint, this._events);
		if(this.getConfig().debug) this.getConfig().backend = this._backend;
		
		// TODO: inject additional handlers
		// all to one global array and than filter in handler classes
		let additional_handlers = [];
		
		/**
		 * backend handler
		 * handles answers from backend
		 */
		this._backend_handler = new BackendHandler(
			this.getState.bind(this),
			this.setState.bind(this),
			this._events,
			additional_handlers
		);
		if(this.getConfig().debug) this.getConfig().handler = this._backend_handler;
		
		/**
		 * action handler
		 * handles gui events
		 */
		this._gui_handler = new GUIHandler(
			this.getState.bind(this),
			this.setState.bind(this),
			this._events,
			this._backend,
			this._config,
			additional_handlers
		);
		if(this.getConfig().debug) this.getConfig().handler = this._gui_handler;
		
		/**
		 * component state
		 */
		this.state = {
			
			loading: true,
			isDraft: true,
			isSidebar: false,
			
			container: [],
			revisions: [],
			
			container_types: [],
			box_types: [],
			permissions: [],
			
		};
	}
	
	componentDidMount(){
		/**
		 * get minimum data for the grid editor rendering
		 */
		this._backend.execute("grid.document","loadGrid",[this.getConfig().ID]);
		this._backend.execute("grid.editing.container","getContainerTypes",[this.getConfig().ID]);
		this._backend.execute("grid.editing.box","getMetaTypesAndSearchCriteria",[this.getConfig().ID]);
		this._backend.execute("grid.permissions","Rights");
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {
			loading,
			isDraft,
			container,
			revisions,
			container_types,
			box_types,
		} = this.state;
		if(loading){
			return(
				<div className="the-grid loading">
					Loading...
				</div>
			)
		} else {
			return (
				<TheGrid
					isDraft={isDraft}
					container={container}
					revisions={revisions}
					container_types={container_types}
					box_types={box_types}
				    events={this._events}
				    onBoxTypeSearch={this.onGetBoxTypes.bind(this)}
				/>
			)
		}
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onGetBoxTypes(type, criteria, query, cb){
		this._backend.execute(
			"grid.editing.box",
			"Search",
			[
				this.getConfig().ID,
				type,
				query,
				criteria
			], function(error, response){
				cb(response.data);
			}
		);
	}
	
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	getConfig(){
		return this._config;
	}
	getPlugins(){
		return this.getConfig().plugins;
	}
	getState(){
		return this.state;
	}
}

/**
 * export component to public
 */
export default TheGridRouter;