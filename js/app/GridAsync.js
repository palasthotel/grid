function GridAsync(domain, path){
	this.domain = domain;
	this.path = path;
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
	console.log("notify event "+_event);
	_.each(this.observers, function(_observer, index, list){
		if(typeof _observer["async_"+_event] == "function")
		{
			console.log(["observer", _observer]);
			_observer["async_"+_event](data);
		}
	});
};

/**
 * Emitters
 */
/**
 * authors
 */
GridAsync.prototype.authors_join = function(){
	this.socket.emit("authors.join", {domain: this.domain, path: this.path, author: this.author});
}
/**
 * locking
 */
GridAsync.prototype.locking_request_lock = function(){
	this.socket.emit("locking.requestLock");
}
GridAsync.prototype.locking_handover = function(identifier){
	this.socket.emit("locking.handover", identifier);
}
GridAsync.prototype.locking_deny_handover = function(identifier){
	this.socket.emit("locking.denyHandover", identifier);
}
/**
 * Grid Async server events
 */
GridAsync.prototype.initEvents = function(){
	this.on("connect", "connect");
	this.on("disconnect", "disconnect");
	// autors
	this.on("authors.list", "authors_list");
	this.on("authors.joined", "authors_joined");
	this.on("authors.left", "authors_left");
	// locking
	this.on("locking.isLocked", "locking_is_locked");
}
GridAsync.prototype.on = function(e, f){
	var self = this;
	this.socket.on(e, function(data){ 
		self[f](data);
	});	
}
GridAsync.prototype.connect = function(data){
	this.authors_join();
};
GridAsync.prototype.disconnect = function(data){
	console.log("disconnected");
	this.notifyAll("disconnect");
	this.notifyAll("locking_is_locked");
};
/**
 * authors events
 */
GridAsync.prototype.authors_list = function(data){
	this.notifyAll("authors_list",data);
};
GridAsync.prototype.authors_joined = function(data){
	this.notifyAll("authors_joined",data);
};
GridAsync.prototype.authors_left = function(id){
	this.notifyAll("authors_left",id);
};
/**
 * locking events
 */
GridAsync.prototype.locking_is_locked = function(data){
	GRID.authors.resetLock();
	if(data.isLocked){
		GRID.authors.setLock(data.identifier);
	}
	this.notifyAll("locking_is_locked");
};



