var GridView = Backbone.View.extend({
    tagName: 'div',
    className: 'grid-wrapper',
    initialize: function() {
    	GRID.log("INIT GridView");
        this._containersView = new ContainersView({collection: this.model.getContainers() });
        this._containersView._parentView = this;
        // listener comes at last position
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    render: function() {
        GRID.log('i am rendering the grid interface');
        this.$el.html(ich.tpl_grid(this.model.toJSON() ));
        this._containersView.render();
        return this;
    }
});

var ContainersView = Backbone.View.extend({
	tagName: 'div',
	className: 'containers-wrapper',
	initialize: function(){
        GRID.log('INIT ContainersView');
		this.listenTo(this.collection, 'change', this.render);
        this.collection.bind('add',this.render, this);
        this.collection.bind('remove', this.render, this);
        GRID.log(this.$el);
	},
	render: function(){
        // renders the containers
		//render template with Mustache or something
    	GRID.log('i am rendering the container collection');
    	var self = this;
    	this.$el.empty();

    	this.collection.each(function(container){
            var containerview = new ContainerView({model: container});
            containerview._parentView = self;
    		self.$el.append(containerview.render().el);
    	});
        this._parentView.$el.find(".containers-wrapper").replaceWith(this.$el);
    	return this;
	}
});

var ContainerView = Backbone.View.extend({
	className: 'container',
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering a single container');
    	GRID.log(this.model.toJSON());
    	this.$el.html(ich.tpl_container( this.model.toJSON() ));
        return this;
	}
});

var SlotView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering slot');
        return this;
	}
});

var BoxView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering box');
        return this;
	}
});