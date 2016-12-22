
import {Events} from '../helper/constants.js';

import GridDocumentHandler from './backend-handlers/grid.document.js';
import GridEditingContainer from './backend-handlers/grid.editing.container.js';
import GridEditingBox from './backend-handlers/grid.editing.box.js';

const ROUTES = [
	{
		component: "grid.document",
		methods: [
			"loadGrid",
			"publishDraft",
			"setToRevision",
			"getGridRevisions",
			"revertDraft",
			"checkDraftStatus"
		],
	},
	{
		component: "grid.editing.container",
		methods: [
			"getContainerTypes",
			"getReusableContainers",
			"addContainer",
			"addReuseContainer",
			"moveContainer",
			"deleteContainer",
			"updateContaienr",
			"reuseContaienr",
			"updateSlotStyle",
		]
	},
	{
		component: "grid.editing.box",
		methods: [
			"getMetaTypesAndSearchCriteria",
		],
	}
];

export default class BackendHandler{
	/**
	 *
	 * @param {func} getState get state of router component
	 * @param {func} setState set state of router component
	 * @param {GridEvent} events object
	 */
	constructor(getState, setState, events){
		
		// TODO: additional handlers for own ajax routes
		
		this.handlers={};
		this.handlers["grid.document"] = new GridDocumentHandler(getState, setState);
		this.handlers["grid.editing.container"] = new GridEditingContainer(getState, setState);
		this.handlers["grid.editing.box"] = new GridEditingBox(getState, setState);
		
		events.on(Events.BACKEND,this.onBackend.bind(this));
	}
	
	onBackend(result){
		if(typeof this.handlers[result.component] != typeof undefined &&
			typeof this.handlers[result.component][result.method] != typeof undefined){
			this.handlers[result.component][result.method](result);
		} else {
			console.info("No handler for this", result);
		}
	}
	
}