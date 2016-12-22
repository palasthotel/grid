
// https://github.com/mzabriskie/axios
import axios from 'axios';

import {Events} from '../helper/constants.js';

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
				data: response.data,
				component: this.settings.component,
				method: this.settings.method,
				async: this.settings.async,
				params: params,
			});
		});
	}
}

class Backend {
	constructor(endpoint, events){
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
	 * @param {String} component
	 * @param {String} method
	 * @param {array} params
	 */
	execute(component, method, params){
		
		this.buildRequest(component, method).execute(
			params,
			(result)=>{
				this.events.emit(Events.BACKEND, result);
			},
			(error)=>{
				this.events.emit(Events.BACKEND, error);
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