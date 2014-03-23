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
        this.$el.find(".containers-wrapper").replaceWith(this._containersView.render().el);
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
    	return this;
	},
    remove: function(container,containers,options){
        this.$el.find(".container[data-id="+container.get("id")+"]").remove();
    }
});

var ContainerView = Backbone.View.extend({
	className: 'container display clearfix',
    events:{
        "click [role=trash]": "selfdestruct",
        "click [role=edit]": "renderEditor",
        "click [role=reuse]": "reuse",
        "click [role=revert]": "render",
        "click [role=ok]": "saveEditor"
    },
	initialize: function(){
		//this.listenTo(this.model, 'change', this.render);
        this._slotsView = new SlotsView({collection: this.model.getSlots() });
        this._slotsView._parentView = this;
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering a single container');
        this.refreshAttr();
    	this.$el.html(ich.tpl_container( this.model.toJSON() ));
        this._slotsView.render();
        return this;
	},
    renderEditor: function(){
        this.refreshAttr();
        this.$el.removeClass('display').addClass('editor');
        this.$el.html(ich.tpl_containerEditor(this.model.toJSON()));
        var styles=GRID.getContainerStyles();
        styles=styles.toJSON();
        var self=this;
        _.each(styles,function(style){
            if(self.model.get("style")==style.slug)
            {
                style.selected="selected";
            }
            else
            {
                style.selected="";
            }
        });
        this.$el.html(ich.tpl_containerEditor({model:this.model.toJSON(),styles:styles}));
        GRID.useCKEDITOR("f-c-prolog");
        GRID.useCKEDITOR("f-c-epilog");
        return this;
    },
    refreshAttr: function(){
        var json = this.model.toJSON();
        this.$el
            .attr("data-id", json.id)
            .attr("data-type", json.type)
            .attr("data-style", json.style)
            .attr("data-reused", json.reused)
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
    reuse: function(){
        var reusetitle = prompt("Bitte gib einen Titel für den Container ein");
        if(reusetitle == ""){
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
        GRID.log(this.$el);
    },
    render: function(){
        // renders the containers
        //render template with Mustache or something
        GRID.log('i am rendering the slots collection');
        var self = this;
        this.$el.empty();
        GRID.log(this.collection);
        this.collection.each(function(slot){
            var slotview = new SlotView({model: slot});
            slotview._parentView = self;
            self.$el.append(slotview.render().el);
        });
        GRID.log(this._parentView);
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
        this._slotStyleChangerView = new GridSlotStyleChangerView({model:this.model});
        this._boxesView._parentView = this;
        this._slotStyleChangerView._parentView = this;
        this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		//render template with Mustache or something
    	GRID.log('i am rendering slot');
        var json = this.model.toJSON();
        this.$el.attr("data-style", json.style).attr("data-id",json.id);
        this.$el.html(ich.tpl_slot( this.model.toJSON() ));
        this.$el.find(".style-changer").replaceWith(this._slotStyleChangerView.render().el);
        this._slotStyleChangerView.delegateEvents();
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
        GRID.log(this.collection);
        this.collection.each(function(box){
            var boxview = new BoxView({model: box});
            boxview._parentView = self;
            self.$el.append(boxview.render().el);
        });
        GRID.log(this._parentView);
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
        GRID.showBoxEditor(function(){
            jQuery("div#new-grid-boxeditor").html(editor.render().el);
        });
    }
});

var BoxEditor = Backbone.View.extend({
    events: {
        'click .btn-cancel' : 'onCancel',
        'click legend' : 'onToggle',
        'click .btn-save' : 'onSave',
        'click .btn-make-reusable' : 'onMakeReusable'
    },
    initialize: function(){
    },
    render: function(){
        GRID.log(this.model.toJSON());
        this.$el.html(ich.tpl_boxeditor({
            'lang_values':document.lang_values,
            'box':this.model.toJSON(),
            'b_index':this.model.getIndex(),
            'c_id':this.model.getContainer().get("id"),
            's_id':this.model.getSlot().get("id"),
            'styles':GRID.getBoxStyles()
        }));
        var contentstructure=this.model.get("contentstructure");
        var fieldcontainer=jQuery(this.$el).find(".dynamic-fields .field-wrapper");
        var views=[];
        var self=this;
        _.each(contentstructure,function(elem){
            var type=elem.type;
            var view=new boxEditorControls[type](
            {
                model:
                {
                    structure:elem,
                    container:self.model.get("content"),
                }
            });
            views.push(view);
            fieldcontainer.append(view.render().el);
        });
        this.views=views;
        jQuery.each(jQuery(this.$el).find(".form-html"), function(index, element) {
            CKEDITOR.replace(
                element,{
                customConfig : document.PathToConfig
            });
        });

        if(GRID.getBoxStyles().length<1)
        {
                jQuery(this.$el).find(".box-styles-wrapper").hide();
        }
        return this;
    },
    onCancel: function(){
        GRID.hideBoxEditor(function(){
            jQuery("div#new-grid-boxeditor").html("");
        });
    },

    onToggle:function(e)
    {
        jQuery(e.srcElement).siblings(".field-wrapper").slideToggle(300);
    },

    onMakeReusable:function(e)
    {
        if(!confirm(document.lang_values["confirm-box-reuse"])) return;
        this.model.save(null,{action:"reuse"});
        GRID.hideBoxEditor(function(){
            jQuery("div#new-grid-boxeditor").html("");
        });
    },

    onSave:function(e)
    {
        var obj={};
        _.each(this.views,function(view){
            obj[view.model.structure.key]=view.fetchValue();
        });
        this.model.set('content',obj);
        this.model.set('title',jQuery(this.$el).find(".f-b-title").val());
        this.model.set('titleurl',jQuery(this.$el).find(".f-b-titleurl").val());
        this.model.set('prolog',CKEDITOR.instances[".f-b-prolog"].getData());
        this.model.set('epilog',CKEDITOR.instances['.f-b-epilog'].getData());
        this.model.set('readmore',jQuery(this.$el).find('.f-b-readmore').val());
        this.model.set('readmoreurl',jQuery(this.$el).find('.f-b-readmoreurl').val());
        this.model.save();
        GRID.hideBoxEditor(function(){
            jQuery("div#new-grid-boxeditor").html("");
        });
    }
});

boxEditorControls={};
