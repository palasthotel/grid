/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridView = GridBackbone.View.extend({
    tagName: 'div',
    className: 'grid-wrapper',
    initialize: function() {
        this._containersView = new ContainersView({collection: this.model.getContainers() });    
    },
    render: function() {
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
        this.listenTo(this.collection, 'add',this.render);
        this.listenTo(this.collection, 'remove',this.render);
	},
	render: function(){
    	var self = this;
    	this.$el.empty();
    	this.collection.each(function(container){
            var containerview = new ContainerView({model: container});
    		self.$el.append(containerview.render().el);
    	});
        GRID._initializeBoxSortable();
        GRID.onSidebarCalculation();
    	return this;
	}
});

var ContainerView = GridBackbone.View.extend({
	className: 'grid-container',
    events:{
        "click [role=trash]": "selfdestruct",
        "click [role=edit]": "onEdit",
        "click [role=reuse]": "onReuse",
        "click [role=toggleslotstyles]": "onToggleSlotStyles"
    },
	initialize: function(){
        var self = this;
        var listen_to = ["title","titleurl","prolog","epilog", "readmore", "readmoreurl", "style", "style_label"];
        _.each(listen_to, function(value, key, list){
            self.listenTo(self.model,'change:'+value, self.render);
        });
        this._slotsView = new SlotsView({collection: this.model.getSlots() });
	},
	render: function(){
        var json = this.model.toJSON();

        this.$el
            .attr("data-id", json.id)
            .attr("data-type", json.type)
            .attr("data-style", json.style)
            .attr("data-reused", json.reused)
            .attr("data-cid", this.model.cid)
            .attr("data-space-left", this.model.getSpace("left"))
            .attr("data-space-right", this.model.getSpace("right"));
        this.$el.addClass('grid-container-type-'+this.model.getType());
        this.$el.addClass('grid-container-'+json.type);
        this.$el.addClass('grid-container-left-space-'+json.space_to_left);
        this.$el.addClass('grid-container-right-space-'+json.space_to_right);
        // shorten title, prolog and epilog
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

        json.right_edit = GRID.getRights().get("edit-container");
        json.right_delete = GRID.getRights().get("delete-container");

        json.right_options = true;
        if(!json.right_delete && (!json.right_edit || json.reused)){
            json.right_options = false;
        }

        json.right_move = GRID.getRights().get("move-container");

        json.isSidebarGrid = GRID.IS_SIDEBAR;
        this.$el.empty();
    	this.$el.append(ich.tpl_container( json));
        
        this.$slots_wrapper = this.$el.find(".grid-slots-wrapper");
        this.$slots_wrapper.replaceWith(this._slotsView.render().el);
        return this;
	},
    onEdit: function(){
        var editor=new GridContainerEditor({model:this.model});
        GRID.showEditor(function(){
            GRID.$root_editor.html(editor.render().el);
        });
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
    onToggleSlotStyles: function(){
        this.$el.toggleClass('grid-container-show-slot-styles');
    },
    selfdestruct: function(){
        this.model.destroy({wait:true});
        this.remove();
    }
});

var SlotsView = GridBackbone.View.extend({
    tagName: 'div',
    className: 'grid-slots-wrapper slots-wrapper',
    initialize: function(){
        this.collection.bind('add',this.render, this);
        this.collection.bind('remove', this.render, this);
    },
    render: function(){
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
    className: 'grid-slot',
	initialize: function(){
        this._boxesView = new BoxesView({collection: this.model.getBoxes() });
        if(GRID.mode != "box"){
            this._slotStyleChangerView = new GridSlotStyleChangerView({model:this.model});
        }
        this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
        var json = this.model.toJSON();
        this.$el.attr("data-style", json.style)
                .attr("data-id",json.id)
                .attr("data-dimension",json.dimension);

        this.$el.addClass('grid-slot-'+json.dimension); 

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
        this.collection.bind('add',this.render, this);
    },
    render: function(){
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
        var json = this.model.toJSON();

        this.$el
        .attr("data-id",json.id)
        .attr("data-type",json.type);
        
        this.$el.addClass("grid-box-"+json.type);

        if(json.type == "reference"){
            json.reference = true;
        }

        json.right_move = GRID.getRights().get("move-box");
        json.right_edit = GRID.getRights().get("edit-box");
        json.right_delete = GRID.getRights().get("delete-box");

        json.right_none = false;
        if(!(json.right_move || json.right_edit || json.right_delete)){
            json.right_none = true;
        }
        GRID.log(["render box", json]);

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

var BoxEditor = GridBackbone.View.extend({
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
        var styles=GRID.getBoxStyles().toJSON();
        var self=this;
        _.each(styles,function(elem){
            if(elem.slug==self.model.get("style"))
                elem.selected="selected";
            else
                elem.selected="";
        });
        this.$el.html(ich.tpl_boxeditor({
            'lang_values':document.lang_values,
            'box':this.model.toJSON(),
            'b_index':this.model.getIndex(),
            'c_id':this.model.getContainer().get("id"),
            's_id':this.model.getSlot().get("id"),
            'styles':styles,
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
                    box:self.model,
                    parentpath:"",
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
        jQuery(e.target).siblings(".field-wrapper").slideToggle(300);
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
        this.model.set('prolog',CKEDITOR.instances["f-b-prolog"].getData());
        this.model.set('epilog',CKEDITOR.instances['f-b-epilog'].getData());
        this.model.set('readmore',jQuery(this.$el).find('.f-b-readmore').val());
        this.model.set('readmoreurl',jQuery(this.$el).find('.f-b-readmoreurl').val());
        this.model.set('style',jQuery(this.$el).find(".box-styles-wrapper select").val());
        this.model.save();
        GRID.hideBoxEditor(function(){
            jQuery("div#new-grid-boxeditor").html("");
        });
    }
});

boxEditorControls={};
