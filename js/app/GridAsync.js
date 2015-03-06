function GridAsync(){
	this.socket = io('http://grid-dev.palasthotel.de:61000');
	var self = this;
	this.on("connect", this.onConnect);
}
GridAsync.prototype.on = function(e, f){
	this.socket.on(e, function(data){ f(data);  });
}

GridAsync.prototype.onConnect = function(data){
	console.log("connected");
	console.log(data);
};

GridAsync.prototype.join = function(){
	this.socket.emit("users.join", {domain: "local-grid-drupal-dev", path: "grid/"+GRID.ID, username: "Edward"});
}