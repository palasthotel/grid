/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

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
        isSidebarBox = (this.model.get("type") == "sidebar")? true: false;
        this.$el.html(ich.tpl_boxeditor({
            'lang_values':document.lang_values,
            'box':this.model.toJSON(),
            'b_index':this.model.getIndex(),
            'c_id':this.model.getContainer().get("id"),
            's_id':this.model.getSlot().get("id"),
            'styles':styles,
            'isSidebarBox': isSidebarBox,
        }));
        var contentstructure=this.model.get("contentstructure");
        var fieldcontainer=this.$el.find(".grid-dynamic-fields .grid-editor-field-wrapper");
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

        this.$el.find(".grid-collapsable-shown").addClass('grid-active');

        jQuery.each(this.$el.find(".grid-editor-url-input"), function(index, val) {
             var $url = jQuery(val);
             if($url.val() == ""){
                $url.siblings('button').trigger("click");
             }
        });
        
        return this;
    },
    onCancel: function(){
        GRID.hideEditor(function(){
            GRID.$root_editor.html("");
        });
    },

    onToggle:function(e)
    {
        jQuery(e.currentTarget).parent().toggleClass('grid-active');
    },

    onUrlToggle: function(e){
        var $parent = jQuery(e.target).parent();
        if($parent.hasClass('grid-editor-url-show')){
            $parent.find('input').attr("disabled","disabled").val("");
            $parent.find('button').html("Add link");
        } else {
            $parent.find('button').html("Delete Link");
            $parent.find('input').removeAttr('disabled');
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
