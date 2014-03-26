var GridToolContainersView = Backbone.View.extend({
    className: "g-tool g-container clearfix",
    initializes: function(){

    },
    render: function(){
        var containers = { containers: this.collection.toJSON() };
        _.each(containers.containers, function(value, key, list){
            value.slots = [];
            if(value.type.indexOf("C-") != 0 && value.type.indexOf("S-") != 0){
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
                return jQuery("<div class='dragger-helper'></div>");
            },
            cursorAt: { left: 30, top:30 },
            zIndex: 99,
            appendTo: GRID.getView().$el,
            scroll: true,
            start: function(event, ui){
                GRID.log("Start dragging")
                var $ = jQuery;
                var $grid = GRID.getView().$el;
                var $containers = $grid.find(".container");
                var $dropArea = $(document.createElement("div"))
                                .addClass("container-drop-area-wrapper")
                                .attr("data-type","container-drop-area-wrapper");
                $grid.find(".containers-wrapper").prepend($dropArea.clone());
                $containers.after( $dropArea.clone() );
                $grid.find(".container-drop-area-wrapper").append($(document.createElement("div")).addClass("container-drop-area"));
                $grid.find(".container-drop-area").droppable({ 
                    accept: ".new-container",
                    hoverClass: "hover",
                    drop: function( event, ui ) {
                        GRID.log("DROPPiNG");
                        var $draggable = $(ui.draggable);
                        var containerReusable = $draggable.data("reusable"); 
                        var containerType =  $draggable.data("type");
                        var $dropwrapper = $(this).parent();
                        
                        $dropwrapper.removeClass('container-drop-area-wrapper').addClass('new-container-target');
                        GRID.getView().$el.find('.container-drop-area-wrapper').remove();
                        GRID.log($dropwrapper.index());
                        GRID.getModel().createContainer(containerType, $dropwrapper.index());

                        // what if reusable??? addReusableContainer
                    }
                });
            },
            stop: function( event, ui ){
                GRID.log("stop Dragging");
                GRID.getView().$el.find('.container-drop-area-wrapper').remove();
            }
        });
    }
});