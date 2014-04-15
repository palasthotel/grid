
var BoxEditor = GridBackbone.View.extend({
    className: "grid-box-editor",
    events: {
        'click .grid-editor-controls [role=cancel]' : 'onCancel',
        'click legend' : 'onToggle',
        'click .grid-editor-controls [role=save]' : 'onSave',
        'click .grid-editor-controls [role=reuse]' : 'onMakeReusable',
        'click .grid-editor-url-button': 'onUrlToggle'
    },
    initialize: function(){
    },
    render: function(){
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
        var fieldcontainer=this.$el.find(".grid-dynamic-fields .field-wrapper");
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
        jQuery.each(this.$el.find(".form-html"), function(index, element) {
            CKEDITOR.replace(
                element,{
                customConfig : document.PathToConfig
            });
        });

        if(GRID.getBoxStyles().length<1)
        {
                this.$el.find(".grid-editor-box-styles-wrapper").hide();
        }
        this.$el.find(".grid-collapsable-hidden .field-wrapper").hide();
        this.$el.find(".grid-collapsable-shown legend").addClass('active');
        return this;
    },
    onCancel: function(){
        GRID.hideEditor(function(){
            GRID.$root_editor.html("");
        });
    },

    onToggle:function(e)
    {
        jQuery(e.currentTarget).toggleClass('active').siblings(".field-wrapper").slideToggle(300);
    },

    onUrlToggle: function(e){
        var $parent = jQuery(e.target).parent();
        if($parent.hasClass('grid-editor-url-show')){
            $parent.find('input').val("");
            $parent.find('button').html("Add link");
        } else {
            $parent.find('button').html("Remove Link");
        }
        jQuery(e.target).parent().toggleClass('grid-editor-url-show');
    },

    onMakeReusable:function(e)
    {
        if(!confirm(document.lang_values["confirm-box-reuse"])) return;
        this.model.save(null,{action:"reuse"});
        GRID.hideEditor(function(){
            GRID.$root_editor.html("");
        });
    },

    onSave:function(e)
    {
        var obj={};
        _.each(this.views,function(view){
            obj[view.model.structure.key]=view.fetchValue();
        });
        this.model.set('content',obj);
        this.model.set('title',this.$el.find(".grid-editor-title").val());
        this.model.set('titleurl',this.$el.find(".grid-editor-titleurl").val());
        this.model.set('prolog',CKEDITOR.instances["grid-editor-prolog"].getData());
        this.model.set('epilog',CKEDITOR.instances['grid-editor-epilog'].getData());
        this.model.set('readmore',this.$el.find('.grid-editor-readmore').val());
        this.model.set('readmoreurl',this.$el.find('.grid-editor-readmoreurl').val());
        this.model.set('style',this.$el.find(".grid-editor-styles-wrapper select").val());
        this.model.save();
        GRID.hideEditor(function(){
            GRID.$root_editor.html("");
        });
    }
});

boxEditorControls={};
