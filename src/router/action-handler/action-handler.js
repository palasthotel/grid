import ContainerHandler from './handler/container';
import BoxHandler from './handler/box';
import SidebarHandler from './handler/sidebar';

/**
 * add here all GUI event function for router
 */
export default class ActionHandler{
	
	/**
	 * constructor
	 * @param config
	 * @param backend
	 */
	constructor(config,backend){
		
		this._config = config;
		this._grid_id = this._config.ID;
		this._backend = backend;
		
		this._methods = {};
		
		// TODO: autoload from ./handler and additional plugin handlers?
		let _handlers = [];
		_handlers.push(ContainerHandler);
		_handlers.push(BoxHandler);
		_handlers.push(SidebarHandler);
		
		/**
		 * collect handlers methods
		 */
		for(let handler of _handlers){
			
			let _h = new handler(this._config,this._backend);
			
			for(let method of Object.getOwnPropertyNames(handler.prototype)){
				
				/**
				 * ingore constructor
				 */
				if(method == "constructor") continue;
				
				/**
				 * methods must have unique names
				 */
				if(this._methods.hasOwnProperty(method)){
					console.error(_h);
					console.log(handler);
					console.error( "Method already declared: \""+method+"\"! Cannot be redecalred and will be ignored.");
					continue;
				}
				
				/**
				 * bind to this so all properties will be available in methods
				 */
				this._methods[method] = _h[method].bind(this);
			}
		}
		
	}
	
	/**
	 * handler function to object for router
	 */
	getHandlers(){
		return this._methods
	}
	
}


