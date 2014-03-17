var GridView = Backbone.View.extend({
  initialize: function() {
  	this.el = "#new-grid";
    this.listenTo(this.model, 'change', this.render);
    this.template = _.template
  },
  render: function() {
    //render template with Mustache or something
    GRID.log('i am rendering');
    GRID.log(this.model);

  }
});

var ContainerView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering container');
	}
});

var SlotView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering slot');
	}
});

var BoxView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering box');
	}
});