
import React, {Component, PropTypes} from 'react';

import GridEvents from './grid-event.js';
import {Events} from '../constants.js';

import BackendHandler from './backend-handler';

import TheGrid from '../component/the-grid/the-grid.js';
import Backend from '../connection/backend.js'

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
		 * grid events object
		 * @type {GridEvent}
		 */
		this.events = new GridEvents();
		
		/**
		 * Toolbar button components
		 */
		const tb = window.grid_toolbar_buttons;
		const etb = window.grid_toolbar_buttons_editor;
		
		/**
		 * grid overlays
		 */
		const gov = window.grid_overlays;
		const eov = window.grid_overlays_editor;
		
		/**
		 * grid backend connection
		 * @type {Backend}
		 */
		this.backend = new Backend(this.getConfig().endpoint, this.events);
		if(this.getConfig().debug) this.getConfig().backend = this.backend;
		
		/**
		 * connection handler
		 */
		// TODO: inject additional handlers
		let additional_handlers = [];
		this.handler = new BackendHandler(this.getState.bind(this), this.setState.bind(this),this.events, additional_handlers);
		if(this.getConfig().debug) this.getConfig().handler = this.handler;
		
		/**
		 * component state
		 */
		this.state = {
			
			loading: true,
			isDraft: true,
			isSidebar: false,
			
			container:{},
			revisions: [],
			container_types: [],
			box_types: [],
			
		};
	}
	
	componentDidMount(){
		// TODO: get data from grid
		this.backend.execute("grid.document","loadGrid",[this.getConfig().ID]);
		this.backend.execute("grid.editing.container","getContainerTypes",[this.getConfig().ID]);
		this.backend.execute("grid.editing.box","getMetaTypesAndSearchCriteria",[this.getConfig().ID]);
		
		/**
		 * bind events
		 */
		this.events.on(Events.GET_BOX_TYPES,this.onGetBoxTypes.bind(this));
		this.events.on(Events.BOX_MOVE,this.onBoxMove.bind(this));
		this.events.on(Events.BOX_ADD,this.onBoxAdd.bind(this));
	}
	componentWillUnmount(){
		this.events.off(Events.GET_BOX_TYPES, this.onGetBoxTypes.bind(this));
		this.events.off(Events.BOX_MOVE,this.onBoxMove.bind(this));
		this.events.off(Events.BOX_ADD,this.onBoxAdd.bind(this));
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
				    events={this.events}
				/>
			)
		}
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onGetBoxTypes(type, search = "", criteria = []){
		this.backend.execute(
			"grid.editing.box",
			"Search",
			[
				this.getConfig().ID,
				type,
				search,
				criteria
			]
		);
	}
	onBoxAdd(box, to){
		const {container} = this.state;
		this.backend.execute("grid.editing.box","CreateBox",[
			this.getConfig().ID,
			to.container_id,
			to.slot_id,
			to.box_index,
			box.type,
			box.content,
		]);
	}
	onBoxMove(){
		
	}
	
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	getConfig(){
		return window.grid;
	}
	getState(){
		return this.state;
	}
}

/**
 * export component to public
 */
export default TheGridRouter;