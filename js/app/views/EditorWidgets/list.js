/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['list']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-list",
    initialize:function(){

    },
    render:function(){
        this.$el.empty();
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
            self.$list.append(view.render().$el);
        });
        this.views=views;

        this.$list.on("click", ".widget-list-sort-button", {self: this}, this.sortItem);
        this.$list.on("click", ".widget-list-remove-item-button", {self: this}, this.onRemove);

        return this;
    },
    sortItem: function(e){
        var self = e.data.self;
        var $button= $(e.currentTarget);
        var $this = $button.closest(".grid-editor-widget-listitem");
        var index = $this.index();
        var views = self.views
        var view = views[index];
        var newPos = index;
        switch($button.attr("data-dir")){
            case "up":    
                newPos = index-1;
                if(newPos < 0) 
                    newPos = 0;
                $this.insertBefore($this.prev());
                break;
            case "down":
                newPos = index+1;
                $this.insertAfter($this.next());
                break;
        }
        views.splice(index,1);
        views.splice(newPos,0,view);

    },
    onRemove: function(e){

        var self = e.data.self;
        var index = $(e.currentTarget).closest(".grid-editor-widget-listitem").index();
        var list = self.model.container[self.model.structure.key];
        list.splice(index,1);
        self.views[index].removed = true;
        self.views[index].remove();
        self.views.splice(index,1);
        console.log(["remove",e, self]);

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
            if(view.removed) return;
            content.push(view.fetchValue());
        });
        return content;
    }
});

boxEditorControls['listitem']=GridBackbone.View.extend({
    className: "grid-editor-widget-listitem",
    removed: false,
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
        jQuery("<button class='widget-list-remove-item-button'><span class='icon-minus'></span>Remove item</button>")
        .appendTo(this.$el);
        jQuery("<button class='widget-list-move-up-item-button widget-list-sort-button' data-dir='up'><span class='icon-dir-up'></span></button>")
        .appendTo(this.$el);
        jQuery("<button class='widget-list-move-down-item-button widget-list-sort-button' data-dir='down'><span class='icon-dir-down'></span></button>")
        .appendTo(this.$el);
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