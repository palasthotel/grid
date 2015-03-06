function GridAsync(){
	this.domain = window.location.host;
	this.path = window.location.pathname;
	this.author = document.author;
	this.socket = io('http://grid-dev.palasthotel.de:61000');

	this.on("connect", "connect");
	this.on("users.list", "users_list");
	this.on("users.joined", "users_joined");
	this.on("users.left", "users_left");
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
GridAsync.prototype.join = function(){
	this.socket.emit("users.join", {domain: this.domain, path: this.path, author: this.author});
}
GridAsync.prototype.users_list = function(data){
	console.log(data);
};
GridAsync.prototype.users_joined = function(data){
	console.log(data);
};
GridAsync.prototype.users_left = function(data){
	console.log(data);
};


