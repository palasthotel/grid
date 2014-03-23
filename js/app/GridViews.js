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
	className: 'container-drag',
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
        GRID.log(["style--->", this.model.getGrid().getSlotStyles()]);
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
        jQuery("div#new-grid-boxeditor").html(editor.render().el);
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
            'styles':this.model.getGrid().get("styles_box")
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

        if(this.model.getGrid().get("styles_box").length<1)
        {
                jQuery(this.$el).find(".box-styles-wrapper").hide();
        }
        return this;
    },
    onCancel: function(){
        jQuery("div#new-grid-boxeditor").html("");
    },

    onToggle:function(e)
    {
        jQuery(e.srcElement).siblings(".field-wrapper").slideToggle(300);
    },

    onMakeReusable:function(e)
    {
        alert("TODO");
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
        jQuery("div#new-grid-boxeditor").html("");
    }
});

var boxEditorControls={};
boxEditorControls['textarea']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><textarea class='dynamic-value form-textarea'>"+text+"</textarea>");
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("textarea").val();
    }
});

boxEditorControls['html']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><textarea class='dynamic-value form-html'>"+text+"</textarea>");
        return this;
    },
    fetchValue:function(){
        return CKEDITOR.instances[this.$el.find("div.cke").attr("id").substring(4)].getData();
    }
});

boxEditorControls['number']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><input type=number class='dynamic-value form-html' value='"+text+"'/>");
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});

boxEditorControls['text']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><input type=text class='dynamic-value form-html' value='"+text+"'/>");
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});

boxEditorControls['select']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label><select>";
        _.each(this.model.structure.selections,function(elem){
            var selected="";
            if(this.model.container[this.model.structure.key]==elem.key)selected="selected";
            html+="<option "+selected+" value='"+elem.key+"'>"+elem.text+"</option>";
        });
        html=html+"</select>";
        jQuery(this.$el).html(html);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("select").val();
    }
});

boxEditorControls['autocomplete']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label>";
        var classes="autocomplete-wrapper form-autocomplete dynamic-value";
        var disabled="";
        if(this.model.container[this.model.structure.key]!='' ||
            this.model.container[this.model.structure.key]===0)
        {
            classes+=" locked";            
            disabled="disabled=disabled";
        }
        html+="<div class='"+classes+"'><input type=text class='form-text autocomplete i-autocomplete' "+disabled+"/>";
        html+="<div class=loading rotate'></div>";
        html+="<div class='cancel'></div>";
        html+="<ul class='suggestion-list'></ul>";
        jQuery(this.$el).html(html);
        //TODO: fetch current autocomplete value and update accordingly
        return this;
    },
    fetchValue:function(){
        //TODO: fetch value
    }
});

boxEditorControls['autocomplete-with-links']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        //TODO: copy from autocomplete
    },
    fetchValue:function(){
        //TODO: copy from autocomplete
    }
});

boxEditorControls['wp-mediaselect']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        //TODO: reimplement on wordpress
    },
    fetchValue:function(){
        //TODO: reimplement on wordpress
    }
});

boxEditorControls['hidden']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        return this;
    },
    fetchValue:function(){
        return this.model.container[this.structure.key];
    }
});

boxEditorControls['checkbox']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var value=this.model.container[this.model.structure.key];
        var checked='';
        if(value)
            checked='checked=checked';
        html="<label>"+this.model.structure.label+"</label>";
        html="<input type='checkbox' "+checked+"</input>";
        jQuery(this.$el).html(html);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).is(":checked");
    }
});

boxEditorControls['file']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        //TODO: reimplement
    },
    fetchValue:function(){
        //TODO: reimplement
    }
});

boxEditorControls['list']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label>";
        var list=this.model.container[this.model.structure.key];
        var self=this;
        var views=[];
        _.each(list,function(elem){
            var view=new boxEditorControls['listitem']({
                model:{
                    structure:self.structure.contentstructure,
                    container:elem
                }
            });
            views.push(view);
            html+=view.render().el;
        });
        //TODO: add "add" button
        jQuery(this.$el).html(html);
        this.views=views;
        return this;
    },
    fetchValue:function(){
        var content=[];
        _.each(views,function(view){
            content.push(view.fetchValue());
        });
        return content;
    }
});

boxEditorControls['listitem']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var fieldcontainer=jQuery("<div></div>");
        var views=[];
        _.each(this.model.structure,function(elem){
            var type=elem.type;
            var view=new boxEditorControls[type](
            {
                model:
                {
                    structure:elem,
                    container:this.model.get("content"),
                }
            });
            views.push(view);
            fieldcontainer.append(view.render().el);
        });
        jQuery(this.$el).html(fieldcontainer);
        this.views=views;
        return this;
    },
    fetchValue:function(){
        var obj={};
        _.each(this.views,function(view){
            obj[view.model.structure.key]=view.fetchValue();
        });
        return obj;
    }
});


boxEditorControls['info']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        html="<label>"+this.model.structure.label+"</label><p class='info'>"+this.model.structure.text+"</p>";
        jQuery(this.$el).html(html);
        return this;
    },
    fetchValue:function(){
        return {};
    },
});

