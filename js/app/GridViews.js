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
		//this.listenTo(this.collection, 'change', this.render);
        this.collection.bind('add',this.render, this);
        this.collection.bind('remove', this.render, this);
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
	className: 'container-drag',
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
        this._slotsView = new SlotsView({collection: this.model.getSlots() });
        this._slotsView._parentView = this;
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering a single container');
    	this.$el.html(ich.tpl_container( this.model.toJSON() ));
        this._slotsView.render();
        return this;
	},
    renderEditor: function(){

        return this;
    }
});

var SlotsView = Backbone.View.extend({
    tagName: 'div',
    className: 'slots-wrapper clearfix',
    initialize: function(){
        GRID.log('INIT SlotsView');
        //this.listenTo(this.collection, 'change', this.render);
        this.collection.bind('add',this.render, this);
        this.collection.bind('remove', this.render, this);
    },
    render: function(){
        // renders the containers
        //render template with Mustache or something
        GRID.log('i am rendering the slots collection');
        var self = this;
        this.$el.empty();
        this.collection.each(function(slot){
            var slotview = new SlotView({model: slot});
            slotview._parentView = self;
            self.$el.append(slotview.render().el);
        });
        this._parentView.$el.find(".slots-wrapper").replaceWith(this.$el);
        return this;
    }
});

var SlotView = Backbone.View.extend({
    tagName: 'div',
    className: 'slot',
	initialize: function(){
        GRID.log("INIT SlotView")
        this._boxesView = new BoxesView({collection: this.model.getBoxes() });
        this._boxesView._parentView = this;
        this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering slot');
        var json = this.model.toJSON();
        this.$el.attr("data-style", json.style).attr("data-id",json.id);
        this.$el.html(ich.tpl_slot( this.model.toJSON() ));
        this._boxesView.render();
        return this;
	}
});

var BoxesView = Backbone.View.extend({
    tagName: 'div',
    className: 'boxes-wrapper',
    initialize: function(){
        GRID.log('INIT BoxesView');
        //this.listenTo(this.collection, 'change', this.render);
        this.collection.bind('add',this.render, this);
        this.collection.bind('remove', this.render, this);
        GRID.log(this.$el);
    },
    render: function(){
        // renders the containers
        //render template with Mustache or something
        GRID.log('i am rendering the Boxes collection');
        var self = this;
        this.$el.empty();
        this.collection.each(function(box){
            var boxview = new BoxView({model: box});
            boxview._parentView = self;
            self.$el.append(boxview.render().el);
        });
        this._parentView.$el.find(".boxes-wrapper").replaceWith(this.$el);
        return this;
    }
});

var BoxView = Backbone.View.extend({
    events: {
        'click .edit' : 'edit'
    },
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering box');
        var json = this.model.toJSON();
        if(json.type == "reference"){
            json.reference = true;
        }
        this.$el.html(ich.tpl_box( json ));
        return this;
	},
    edit:function(){
        var editor=new BoxEditor({model:this.model});
        jQuery("div#new-grid-boxeditor").html(editor.render().el);
    }
});

var BoxEditor = Backbone.View.extend({
    events: {
        'click .btn-cancel' : 'onCancel'
    },
    initialize: function(){
    },
    render: function(){
        this.$el.html(ich.tpl_boxeditor({
            'lang_values':document.lang_values,
            'box':this.model.toJSON(),
            'b_index':this.model.getIndex(),
            'c_id':this.model.getContainer().get("id"),
            's_id':this.model.getSlot().get("id"),
            'styles':this.model.getGrid().get("styles_box")
        }));
        return this;
    },
    onCancel: function(){
        jQuery("div#new-grid-boxeditor").html("");
    }
})
