/**
*	@author Edward
*	The ajax object thats responsible for server communication.
*	
*	Method: which operation to run
*	params_array: an numeric array with data
*	settings: an Object to overwrite the jquery Ajax settings
*			use success_fn, error_fn to prevent default debugging
*			output of success and error functions
*
*
*	Available Methods:
		- loadGrid [ID] :: loads a whole grid by its ID
		- 
*/
console.log("cool mit codekit !!!");
var GridAjax = function(method, params_array, settings){
	// two required variables
	json["method"] = method;
	json["params"] = params_array;
	if(typeof settings != "object"){ settings = {}; }
	// default settings
	this.settings = {
		url: GRID.SERVER,
		async: true,
		type: 'POST',
		dataType: 'json',
		error: function(jqXHR, textStatus, error){
   			GRID.log("!--- error Method: "+method);
			GRID.log(jqXHR);
			GRID.log(textStatus);
			GRID.log(error);
			GRID.log(json);
			GRID.log("--------!");
			if(typeof settings.error_fn == 'function' ){
				settings.error_fn(jqXHR, textStatus, error);
			}
   		},
   		success: function(data, textStatus, jqXHR){
   			GRID.log("!--- success Method: "+method);
			GRID.log(data);
			GRID.log(textStatus);
			GRID.log(jqXHR);
			GRID.log(json);
			GRID.log("---------!");
			if(typeof settings.success_fn == 'function' ){
				settings.success_fn(data, textStatus, jqXHR);
			}
   		},
   		data: JSON.stringify(json),
   		wait: false
	};
	// overwrite settings
	jQuery.extend(true,this.settings, settings);
	
	// sends the request to the server
	this.send = function(){
		jQuery.ajax(this.settings);
	}
	if(!this.settings.wait){ this.send(); }
	
}
