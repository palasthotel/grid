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
                return jQuery("<div class='dragger-helper'></div>");
            },
            cursorAt: { left: 30, top:30 },
            zIndex: 99,
            appendTo: GRID.getView().$el,
            scroll: true,
            start: function(event, ui){
                var $ = jQuery;
                var $grid = GRID.getView().$el;
                var $containers = $grid.find(".container");
                var $dropArea = $(document.createElement("div"))
                                .addClass("container-drop-area-wrapper")
                                .attr("data-type","container-drop-area-wrapper");

                $containers.after( $dropArea.clone() );
                $containers.first().before($dropArea.clone() );
                $grid.find(".container-drop-area-wrapper").append($(document.createElement("div")).addClass("container-drop-area"));

                $grid.find(".container-drop-area").droppable({ 
                    accept: ".new-container",
                    hoverClass: "hover",
                    drop: function( event, ui ) {
                        // var $draggable = $(ui.draggable);
                        // var containerReusable = $draggable.data("reusable"); 
                        // var containerType =  $draggable.data("type");
                        // var $this = $(this);
                        // if(containerReusable == "reusable"){
                        //     $working_placeholder = $("<div class='working-placeholder'>").insertBefore($this.parent());
                        //     $grid.children().remove(".container-drop-area-wrapper");
                        //     //reused container
                        //     // sendAjax(
                        //     //     "addReuseContainer",
                        //     //     [ID, $working_placeholder.index(), $draggable.data("id")],
                        //     //     function(data){
                        //     //         $working_placeholder.replaceWith(buildContainer(data.result));
                        //     //         $grid.trigger("structureChange");
                        //     //         scrollToContainer(data.result.id);
                        //     // });
                        // } else {
                        //     // new container
                        //     $temp = buildContainer([{   "type": containerType,
                        //             "id" : "new",
                        //             "prolog": "",
                        //             "epilog": "" }] )
                        //         .insertBefore( $(this).parent() );
                        
                        //     $grid.children().remove(".container-drop-area-wrapper");
                        //     params = [ID, containerType, $temp.index()];
                        //     // sendAjax("addContainer",params,
                        //     // function(data){
                        //     //     $temp.attr("data-id", data.result.id);
                        //     //     $slots_wrapper = $temp.find(".slots-wrapper");
                        //     //     $.each( data.result.slots, function(index,value){
                        //     //         buildSlot([value]).appendTo( $slots_wrapper );
                        //     //     });
                        //     //     refreshBoxSortable();
                        //     //     $grid.trigger("structureChange");
                        //     //     scrollToContainer(data.result.id);
                        //     // });
                        // }
                        
                    }
                });
            },
            stop: function( event, ui ){
                GRID.getView().$el.find('.container-drop-area-wrapper').remove();
            }
        });
    }
});