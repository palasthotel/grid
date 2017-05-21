
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
			
			container_styles: [],
			slot_styles: [],
			box_styles: [],
			
		};
	}
	
	componentDidMount(){
		/**
		 * get minimum data for the grid editor rendering
		 */
		this._backend.execute("grid.document","loadGrid",[this.getConfig().ID], this.onLoadGrid.bind(this));
		this._backend.execute("grid.permissions","Rights",[],this.onRights.bind(this));
		this._backend.execute("grid.editing.container","getContainerTypes",[this.getConfig().ID], this.onContainerTypes.bind(this));
		this._backend.execute("grid.editing.box","getMetaTypesAndSearchCriteria",[this.getConfig().ID], this.onMetaTypesAndSearchCriteria.bind(this));
		this._backend.execute("grid.styles","getAllStyles",[],this.onStyles.bind(this));
		this._backend.execute("grid.document","getGridRevisions",[this.getConfig().ID],this.onRevisions.bind(this));
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
			container_styles,
			slot_styles,
			box_styles,
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
					
					container_styles={container_styles}
					slot_styles={slot_styles}
					box_styles={box_styles}
					
					{...this._action_handler.getHandlers()}
					
					onPreview={this.onPreview.bind(this)}
				    
				    onUpdateState={this.onUpdateChildState.bind(this)}
				/>
			)
		}
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onUpdateChildState(state){
		console.log("onUpdateChildState", state);
		for(let prop in state){
			if(!state.hasOwnProperty(prop))continue;
			this.state[prop] = state[prop];
		}
		this.setState(this.state);
	}
	
	/**
	 * on get the grid containers from server
	 * @param error
	 * @param response
	 */
	onLoadGrid(error, response){
		const {data} = response;
		this.setState({
			loading:false,
			container: data.container,
			isDraft: data.isDraft,
		})
	}
	
	/**
	 * on get rights from server
	 * @param error
	 * @param response
	 */
	onRights(error, response){
		this._rights = response.data;
		this.setState(this.state);
	}
	
	/**
	 * on get revisions from server
	 * @param error
	 * @param response
	 */
	onRevisions(error, response){
		this.state.revisions = response.data;
		this.setState(this.state);
	}
	
	/**
	 * on get container types from server
	 * @param error
	 * @param response
	 */
	onContainerTypes(error, response){
		const {data} = response;
		this.setState({container_types: data});
	}
	
	/**
	 * on get meta types and search criteria from server
	 * @param error
	 * @param response
	 */
	onMetaTypesAndSearchCriteria(error, response){
		const {data} = response;
		this.setState({box_types: data});
	}
	
	/**
	 * on get styles from server
	 * @param error
	 * @param response
	 */
	onStyles(error, response){
		this.state.container_styles = response.data.container;
		this.state.slot_styles = response.data.slot;
		this.state.box_styles = response.data.box;
		this.setState(this.state);
	}
	
	/**
	 * handle preview
	 * @param revision
	 */
	onPreview(revision){
		if(!revision){
			window.open(
				this.getConfig().preview.url,
				"grid_preview"
			);
			return;
		}
		window.open(
			this.getConfig().preview.pattern.replace("{REV}", revision.revision),
			"grid_preview"
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