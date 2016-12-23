
// https://github.com/mzabriskie/axios
import axios from 'axios';

import {Events} from '../constants.js';

class BackendRequest{
	constructor(url, component, method){
		this.settings = {
			url: url,
			component: component,
			method: method,
			async: true,
		};
	}
	execute(params, success, error){
		axios.post(this.settings.url,{
			method: this.settings.method,
			component: this.settings.component,
			params: params,
		}).then((response)=>{
			if(typeof success == "function") success({
				success: true,
				data: response.data.result,
				component: this.settings.component,
				method: this.settings.method,
				async: this.settings.async,
				params: params,
			});
		});
	}
}

class Backend {
	constructor(endpoint, events = null){
		this.endpoint = endpoint;
		this.events = events;
	}
	buildRequest(component, method){
		return new BackendRequest(
			this.endpoint,
			component,
			method,
		);
	}
	
	/**
	 *
	 * @param {boolean} error
	 * @param {object} result
	 * @param {function|null} callback
	 */
	callback(error, result, callback){
		// direct callback?
		if(typeof callback != typeof undefined && callback != null){
			callback(error, result);
		}
		// deliver as event
		if(typeof this.events != typeof undefined
			&& this.events != null ){
			this.events.emit(Events.BACKEND, result);
		}
	}
	
	/**
	 *
	 * @param {String} component
	 * @param {String} method
	 * @param {array} params
	 * @param {function|null} callback
	 */
	execute(component, method, params = [], callback = null){
		if(typeof component != "string"){
			throw "Component must be of type string.";
		}
		if(typeof method != "string"){
			throw "Method must be of type string.";
		}
		if(typeof params != typeof []){
			throw "Params must be of type array.";
		}
		if(typeof callback != typeof undefined && callback != null && typeof callback != "function"){
			console.error(typeof callback);
			throw "If use callback it must be a function.";
		}
		this.buildRequest(component, method).execute(
			params,
			(result)=>{
				this.callback(false, result, callback);
			},
			(error)=>{
				this.callback(true, error, callback);
			}
		);
	}
	
	/**
	 *
	 * @param {array} bundle array of {component,method,params}
	 * @param {function} success
	 * @param {function} error
	 */
	executeBundle(bundle, success, error){
		// TODO: bundled requests
	}
}

export default Backend;