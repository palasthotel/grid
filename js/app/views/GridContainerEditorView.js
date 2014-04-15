var GridContainerEditor = GridBackbone.View.extend({
    className: "grid-container-editor",
    events: {
        'click .grid-editor-controls [role=cancel]' : 'onCancel',
        'click .grid-editor-controls [role=save]' : 'onSave',
        'click legend' : 'onToggle',
        'click .grid-editor-url-button': 'onUrlToggle'
    },
    initialize: function(){
    },
    render: function(){
        GRID.log(this.model.toJSON());
        var styles=GRID.getContainerStyles().toJSON();
        var self=this;
        _.each(styles,function(elem){
            if(elem.slug==self.model.get("style"))
                elem.selected="selected";
            else
                elem.selected="";
        });
        this.$el.html(ich.tpl_containereditor({
            'lang_values':document.lang_values,
            'model':this.model.toJSON(),
            'styles':styles
        }));

        jQuery.each(jQuery(this.$el).find(".form-html"), function(index, element) {
            CKEDITOR.replace(
                element,{
                customConfig : document.PathToConfig
            });
        });

        this.$el.find(".grid-collapsable-hidden .grid-editor-field-wrapper").hide();
        this.$el.find(".grid-collapsable-shown legend").addClass('active');

        jQuery.each(this.$el.find(".grid-editor-url-input"), function(index, val) {
             var $url = jQuery(val);
             if($url.val() != ""){
                $url.siblings('button').trigger("click");
             }
        });

        return this;
    },

    onToggle:function(e)
    {
        jQuery(e.currentTarget).toggleClass('active').siblings(".grid-editor-field-wrapper").slideToggle(300);
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

    onCancel: function(){
        GRID.hideEditor(function(){
            jQuery(GRID.$root_editor).html("");
        });
    },

    onSave:function(e)
    {
        var class_prefix = ".grid-editor-";
        this.model.set('title',this.$el.find(class_prefix+"title").val());
        this.model.set('titleurl', this.$el.find(class_prefix+"titleurl").val());
        this.model.set('prolog',CKEDITOR.instances["grid-editor-prolog"].getData());
        this.model.set('epilog',CKEDITOR.instances["grid-editor-epilog"].getData());
        this.model.set('readmore', this.$el.find(class_prefix+"readmore").val());
        this.model.set('readmoreurl',this.$el.find(class_prefix+"readmoreurl").val());
        this.model.set('style', this.$el.find(class_prefix+"style").val());
        this.model.save();
        GRID.hideEditor(function(){
            GRID.$root_editor.html("");
        });
    }
});

