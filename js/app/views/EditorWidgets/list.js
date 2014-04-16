

boxEditorControls['list']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-list",
    events:{
        "click .grid-editor-widget-list-add": "onAdd"
    },
    initialize:function(){

    },
    render:function(){
        jQuery("<label></label>")
                .text(this.model.structure.label)
                    .appendTo(this.$el);

        this.$list = jQuery("<div></div>")
                    .addClass('grid-editor-widget-list-items');
        this.$el.append(this.$list);

        jQuery("<button></button>")
                .text("Add item")
                .addClass('grid-editor-widget-list-add')
                    .appendTo(this.$el);

        var list=this.model.container[this.model.structure.key];
        var self=this;
        var views=[];
        _.each(list,function(elem){
            var view=new boxEditorControls['listitem']({
                model:{
                    structure:self.structure.contentstructure,
                    container:elem,
                    box:self.model.box,
                    parentpath:self.model.parentpath+self.structure.key+"."
                }
            });
            views.push(view);
            this.$list.append(view.render().el);
        });
        this.views=views;
        return this;
    },
    onAdd: function(){
        GRID.log(["add List Item", this.model]);
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