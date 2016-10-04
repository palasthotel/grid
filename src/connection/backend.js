
// https://github.com/mzabriskie/axios
import axios from 'axios';

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
		}).then(function(response){
			if(typeof success == "function") success(response.data);
		}).catch(function(error){
			console.error(error);
			if(typeof error == "function") error(error);
		});
	}
}

class Backend {
	constructor(endpoint){
		this.endpoint = endpoint;
	}
	buildRequest(component, method){
		return new BackendRequest(
			this.endpoint,
			component,
			method,
		);
	}
	execute(component, method, params, success, error){
		this.buildRequest(component,method).execute(params,success,error);
	}
}

export default Backend;