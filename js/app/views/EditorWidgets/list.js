

boxEditorControls['list']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-list",
    initialize:function(){

    },
    render:function(){
        jQuery("<label></label>")
                .text(this.model.structure.label)
                    .appendTo(this.$el);

        this.$list = jQuery("<div></div>")
                    .addClass('grid-editor-widget-list-items');
        this.$el.append(this.$list);

        var list=this.model.container[this.model.structure.key];
        var self=this;
        var views=[];

        jQuery("<button><span class='icon-plus'></span>Add item</button>")
                .addClass('grid-editor-widget-list-add')
                    .appendTo(this.$el).on('click', function(event) {
                        event.preventDefault();
                       self.onAdd();
                    });

        
        _.each(list,function(elem){
            var view=new boxEditorControls['listitem']({
                model:{
                    structure:self.model.structure.contentstructure,
                    container:elem,
                    box:self.model.box,
                    parentpath:self.model.parentpath+self.model.structure.key+"."
                }
            });
            views.push(view);
            self.$list.append(view.render().el);
        });
        this.views=views;

        return this;
    },
    onAdd: function(){
        var view = new boxEditorControls['listitem']({
            model: {
                structure: this.model.structure.contentstructure,
                container:{},
                box: this.model.box,
                parentpath: this.model.parentpath+this.model.structure.key+"."
            }
        });
        this.views.push(view);
        this.$list.append(view.render().el);

        jQuery.each(view.$el.find(".form-html"), function(index, element) {
            CKEDITOR.replace(
                element,{
                customConfig : document.PathToConfig
            });
        });
    },
    fetchValue:function(){
        var content=[];
        _.each(this.views,function(view){
            content.push(view.fetchValue());
        });
        return content;
    }
});

boxEditorControls['listitem']=GridBackbone.View.extend({
    className: "grid-editor-widget-listitem",
    initialize:function(){

    },
    render:function(){
        var views=[];
        var self = this;
        _.each(this.model.structure,function(elem){
            var type=elem.type;
            var view=new boxEditorControls[type](
            {
                model:
                {
                    structure:elem,
                    container:self.model.container,
                    box:self.model.box,
                    parentpath:self.model.parentpath
                }
            });
            views.push(view);
            self.$el.append(view.render().el);
        });
        jQuery("<button class='widget-list-remove-item-button'><span class='icon-minus'></span>Remove item</button>").on('click', function(event) {
            self.remove();
        }).appendTo(this.$el);
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