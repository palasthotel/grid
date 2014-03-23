var GridToolContainersView = Backbone.View.extend({
    className: "g-tool g-container clearfix",
    initializes: function(){

    },
    render: function(){
        var containers = { containers: this.collection.toJSON() };
        _.each(containers.containers, function(value, key, list){
            value.slots = [];
            if(value.type.indexOf("C-") != 0 && value.type.indexOf("SC-") != 0){
                delete containers.containers[key];
            } else {
                for( var i = 0 ;i < value.numslots; i++){
                    value.slots.push(i);
                }
            }           
        });
        this.$el.html(ich.tpl_toolContainers(containers));
        this.$el.show();
        this.initializesDraggable();
        return this;
    },
    initializesDraggable: function(){
        this.$el.find(".container-dragger").draggable({ 
            helper: function(event, element){
                return $("<div class='dragger-helper'></div>");
            },
            cursorAt: { left: 30, top:30 },
            zIndex: 99,
            appendTo: this._gridView.$el,
            scroll: true,
            start: function(event, ui){
                
            },
            stop: function( event, ui ){
                
            }
        });
    }
});