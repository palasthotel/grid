var GridView = GridBackbone.View.extend({
    tagName: 'div',
    className: 'grid-wrapper',
    initialize: function() {
    	GRID.log("INIT GridView");
        this._containersView = new ContainersView({collection: this.model.getContainers() });    },
    render: function() {
        GRID.log('i am rendering the grid interface');
        this.$el.empty();
        this.$el.append(ich.tpl_grid(this.model.toJSON() ));
        this.renderContainers();
        return this;
    },
    renderContainers: function(){
        this.$el.find(".containers-wrapper").replaceWith(this._containersView.render().el);
        return this;
    }

});

var ContainersView = GridBackbone.View.extend({
	tagName: 'div',
	className: 'grid-containers-wrapper containers-wrapper',
	initialize: function(){
        GRID.log('INIT ContainersView');
        this.listenTo(this.collection, 'add',this.render);
        this.listenTo(this.collection, 'remove',this.render);
	},
	render: function(){
    	GRID.log('i am rendering the container collection');
    	var self = this;
    	this.$el.empty();
    	this.collection.each(function(container){
            var containerview = new ContainerView({model: container});
    		self.$el.append(containerview.render().el);
    	});
        GRID._initializeBoxSortable();
    	return this;
	}
});

var ContainerView = GridBackbone.View.extend({
	className: 'grid-container container display',
    events:{
        "click [role=trash]": "selfdestruct",
        "click [role=edit]": "onEdit",
        "click [role=reuse]": "onReuse"
    },
	initialize: function(){
        var self = this;
        var listen_to = ["title","titleurl","prolog","epilog", "readmore", "readmoreurl", "style"];
        _.each(listen_to, function(value, key, list){
            self.listenTo(self.model,'change:'+value, self.render);
        });
        this._slotsView = new SlotsView({collection: this.model.getSlots() });
	},
	render: function(){
    	GRID.log('i am rendering a single container');
        this.$el.addClass('display').removeClass('editor');
        this.refreshAttr();
        var json = this.model.toJSON();
        var cut = 60;

        if(json.title){
            json.title_short = ( json.title.length <= cut ? json.title : json.title.substring(0,cut)+"&hellip;" );
        }
        if(json.prolog){
            var prolog = jQuery(json.prolog).text();
            json.prolog_short = "<p>"+( prolog.length <= cut ? prolog : prolog.substring(0,cut)+"&hellip;" )+"</p>";
        }
        if(json.epilog){
            var epilog = jQuery(json.epilog).text();
            json.epilog_short = "<p>"+( epilog.length <= cut ? epilog : epilog.substring(0,cut)+"&hellip;" )+"</p>";
        }
        json.isSidebarGrid = GRID.IS_SIDEBAR;

    	this.$el.html(ich.tpl_container( json));
        this._slotsView.render();
        this.$el.find(".grid-slots-wrapper").replaceWith(this._slotsView.$el);
        return this;
	},
    onEdit: function(){
        var editor=new GridContainerEditor({model:this.model});
        GRID.showEditor(function(){
            GRID.$root_editor.html(editor.render().el);
        });
    },
    refreshAttr: function(){
        var json = this.model.toJSON();
        this.$el
            .attr("data-id", json.id)
            .attr("data-type", json.type)
            .attr("data-style", json.style)
            .attr("data-reused", json.reused)
            .attr("data-cid", this.model.cid)
            .addClass(json.type+" display");
    },
    saveEditor: function(){
        var self = this;
        jQuery.each(this.$el.find(".form-val"), function(index, element) {
            var $this = jQuery(element);
            var scope = $this.attr("scope");
            if($this.hasClass('form-html')){
                self.model.set(scope, GRID.getCKEDITORVal($this.attr("name") ) );
            } else {
                self.model.set(scope, $this.val() );
            }
        });
        this.model.save();
        return this.render();
    },
    onReuse: function(){ 
        var reusetitle = prompt("Bitte gib einen Titel für den Container ein");
        if(reusetitle == "" || reusetitle == false){
            return false;
        }
        var self = this;
        this.model.save(null,{
            reusetitle: reusetitle,
            action: "reuse",
            success:function(data){
                self.render();
            }
        });
        return this;
    },
    selfdestruct: function(){
        console.log("delete container");
        this.model.destroy({wait:true});
        this.remove();
    }
});

var SlotsView = GridBackbone.View.extend({
    tagName: 'div',
    className: 'grid-slots-wrapper slots-wrapper grid-clearfix',
    initialize: function(){
        GRID.log('INIT SlotsView');
        this.collection.bind('add',this.render, this);
        this.collection.bind('remove', this.render, this);
    },
    render: function(){
        GRID.log('i am rendering the slots collection');
        var self = this;
        this.$el.empty();
        this.collection.each(function(slot){
            var slotview = new SlotView({model: slot});
            slotview._parentView = self;
            self.$el.append(slotview.render().el);
        });
        return this;
    }
});

var SlotView = GridBackbone.View.extend({
    tagName: 'div',
    className: 'grid-slot slot',
	initialize: function(){
        GRID.log("INIT SlotView")
        this._boxesView = new BoxesView({collection: this.model.getBoxes() });
        if(GRID.mode != "box"){
            this._slotStyleChangerView = new GridSlotStyleChangerView({model:this.model});
        }
        this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
    	GRID.log('i am rendering slot');
        var json = this.model.toJSON();
        this.$el.attr("data-style", json.style).attr("data-id",json.id);
        this.$el.html(ich.tpl_slot( this.model.toJSON() ));
        if(GRID.mode != "box"){
            this.$el.find(".style-changer").replaceWith(this._slotStyleChangerView.render().el);
            this._slotStyleChangerView.delegateEvents();
        }
        this._boxesView.render();
        this.$el.find(".boxes-wrapper").replaceWith(this._boxesView.$el);
        return this;
	}
});

var BoxesView = GridBackbone.View.extend({
    tagName: 'div',
    className: 'grid-boxes-wrapper boxes-wrapper',
    initialize: function(){
        GRID.log('INIT BoxesView');
        this.collection.bind('add',this.render, this);
    },
    render: function(){
        GRID.log('i am rendering the Boxes collection');
        var self = this;
        this.$el.empty();
        this.collection.each(function(box){
            var boxview = new BoxView({model: box});
            boxview._parentView = self;
            self.$el.append(boxview.render().el);
        });
        return this;
    }
});

var BoxView = GridBackbone.View.extend({
    className: "grid-box box",
    events: {
        'click .grid-box-edit' : 'edit',
        'click .grid-box-delete' : 'deleteBox'
    },
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.selfdestruct);
	},
	render: function(){
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
        GRID.showEditor(function(){
            GRID.$root_editor.html(editor.render().el);
        });
    },
    deleteBox: function(){
        this.model.destroy();
    },
    selfdestruct: function(){
        this.remove();
    }
});
