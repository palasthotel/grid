
import React, {Component, PropTypes} from 'react';

import GridEvents from './grid-event.js';
import {Events} from '../constants.js';

import Backend from '../connection/backend.js'
import ActionHandler from './action-handler';

import TheGrid from '../component/the-grid/the-grid.js';


window.ActionHandler = ActionHandler;

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
		
		this._action_handler = new ActionHandler(this.getConfig(),this._backend);
		
		// TODO: inject additional handlers
		// all to one global array and than filter in handler classes
		let additional_handlers = [];
		
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
		this._backend.execute("grid.document","loadGrid",[this.getConfig().ID], this.onLoadGrid.bind(this));
		this._backend.execute("grid.editing.container","getContainerTypes",[this.getConfig().ID], this.onContainerTypes.bind(this));
		this._backend.execute("grid.editing.box","getMetaTypesAndSearchCriteria",[this.getConfig().ID], this.onMetaTypesAndSearchCriteria.bind(this));
		this._backend.execute("grid.permissions","Rights",[],this.onRights.bind(this));
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
					
					{...this._action_handler.getHandlers()}
				/>
			)
		}
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onLoadGrid(error, response){
		const {data} = response;
		this.setState({
			loading:false,
			container: data.container,
			isDraft: data.isDraft,
		})
	}
	onContainerTypes(error, response){
		const {data} = response;
		this.setState({container_types: data});
	}
	onMetaTypesAndSearchCriteria(error, response){
		const {data} = response;
		this.setState({box_types: data});
	}
	onRights(error, response){
		console.log("onRights", response);
		this._rights = response.data;
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