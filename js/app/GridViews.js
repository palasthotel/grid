var GridView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    //render template with Mustache or something
    GRID.log('i am rendering');
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