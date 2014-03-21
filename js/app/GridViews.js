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
        this.collection.bind('remove', this.remove, this);
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
	},
    remove: function(container,containers,options){
        this._parentView.$el.find(".container[data-id="+container.get("id")+"]").remove();
    }
});

var ContainerView = Backbone.View.extend({
	className: 'container-drag',
    events:{
        "click [role=trash]": "selfdestruct",
        "click [role=edit]": "renderEditor",
        "click [role=reuse]": "reuse",
        "click [role=revert]": "render",
        "click [role=ok]": "saveEditor",
        "change .form-val": "changedVal"
    },
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
        this.$el.html(ich.tpl_containerEditor(this.model.toJSON()));
        GRID.useCKEDITOR("f-c-prolog");
        GRID.useCKEDITOR("f-c-epilog");
        return this;
    },
    changedVal: function(event){
        GRID.log(["changedval",event]);
        var $target = jQuery(event.currentTarget);
        GRID.log(["target",$target.attr("scope")]);

    },
    saveEditor: function(){
        // save values with model.set and model.save
        // templateParams = {
        //             id:$editContainer.data("id"), 
        //             title: $editContainer.find("#f-c-title").val(),
        //             titleurl: $editContainer.find("#f-c-titleurl").val(),
        //             type: $editContainer.data("type"),
        //             prolog: CKEDITOR.instances["f-c-prolog"].getData(),
        //             epilog: CKEDITOR.instances["f-c-epilog"].getData(),
        //             readmore: $editContainer.find("#f-c-readmore").val(),
        //             readmoreurl: $editContainer.find("#f-c-readmoreurl").val(),
        //             style: style
        //         };
        // params =[ID, templateParams.id,{
        //     style: templateParams.style,
        //     title: templateParams.title,
        //     titleurl: templateParams.titleurl,
        //     readmore: templateParams.readmore,
        //     readmoreurl: templateParams.readmoreurl,
        //     prolog: templateParams.prolog,
        //     epilog: templateParams.epilog,
        //     style: style
        //     }];
        var json = this.model.toJSON();
        this.model.set("prolog", GRID.getCKEDITORVal("f-c-prolog"));
        this.model.set("epilog",GRID.getCKEDITORVal("f-c-epilog"));
        this.model.save();
        return this.render();
    },
    reuse: function(){
        // send reuse container and rerender
        return this;
    },
    selfdestruct: function(){
        console.log("delete container");
        this.model.destroy({wait:true});
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
        this.collection.bind('remove', this.remove, this);
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
    },
    remove: function(box,boxes,options){
        this._parentView.$el.find("box[]")
    }
});

var BoxView = Backbone.View.extend({
    className: "box",
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
        this.$el.attr("data-id",json.id).attr("data-type",json.type);
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
