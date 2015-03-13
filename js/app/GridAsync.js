function GridAsync(){
	this.domain = window.location.host;
	this.path = window.location.pathname;
	this.author = document.author;
	this.observers = [];

}
GridAsync.prototype.init = function(){
	this.socket = io('http://grid-dev.palasthotel.de:61000');
	this.initEvents();
}


GridAsync.prototype.addObserver = function(observer){
	this.observers.push(observer);
};
GridAsync.prototype.notifyAll = function(_event, data){
	_.each(this.observers, function(_observer, index, list){
		console.log("nofiy observer "+index);
		if(typeof _observer["async_"+_event] == "function")
		{
			console.log("nofiy event "+_event);
			_observer["async_"+_event](data);
		}
		
	});
};

/**
 * Emitters
 */
GridAsync.prototype.join = function(){
	this.socket.emit("authors.join", {domain: this.domain, path: this.path, author: this.author});
}
/**
 * Grid Async server events
 */
GridAsync.prototype.initEvents = function(){
	this.on("connect", "connect");
	this.on("authors.list", "authors_list");
	this.on("authors.joined", "authors_joined");
	this.on("authors.left", "authors_left");
}
GridAsync.prototype.on = function(e, f){
	var self = this;
	this.socket.on(e, function(data){ 
		self[f](data);
	});	
}
GridAsync.prototype.connect = function(data){
	console.log("connected");
	this.join();
};
GridAsync.prototype.authors_list = function(authors){
	this.notifyAll("authors_list",authors);
};
GridAsync.prototype.authors_joined = function(author){
	this.notifyAll("authors_joined",author);
};
GridAsync.prototype.authors_left = function(author){
	this.notifyAll("authors_left",author);
};


