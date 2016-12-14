/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridToolContainersView = GridBackbone.View.extend({
    className: "grid-tool grid-element-container",
    events:{
        "click .grid-container-type": "renderContainerType"
    },
    render: function(){
        this.$el.empty();
        this.$el.append(ich.tpl_toolContainers({}));
        this.delegateEvents();
        // if you want to show containers on default uncomment next line
        //this.$el.find(".grid-container-type").first().trigger("click");
        return this;
    },
    renderContainerType: function(event){
        var $type = jQuery(event.currentTarget);
        $type.toggleClass('active');
        var role = $type.attr("role");
        var list = "";
        if(role == "reusable"){
            // reusables
            var reusables = this.getReusable();
            list = this.getRenderedContainerList(reusables);
        } else {
            // containers and sidebars
            var containers = this.getContainers(role);
            list = this.getRenderedContainerList(containers);
        }
        // DOM manipulation
        if($type.hasClass('active')){
            // add elements
            $type.next("dl").append(list);
        } else {
            // remove elements
            $type.next("dl").empty();
        }
        this.initializesDraggable();
        return this;
    },
    getRenderedContainerList: function(json){
        return ich.tpl_toolContainersContainer(json);
    },
    getContainers: function(type){
        var scope_type = "c-";
        if(type == "sidebar"){ scope_type = "s-"; }
        var collection = this.collection;
        var containers = { containers: this.collection.toJSON() };
        _.each(containers.containers, function(value, key, list){

            if( value.type.indexOf(scope_type) != 0 ){
                delete containers.containers[key];
            } else {
                value.slots = [];
                var slots_dimension = collection.at(key).getDimension().split("-");
                var i=0;
                for( var i = 0 ;i < value.numslots; i++){
                    value.slots.push({dimension: slots_dimension[i]});
                }
            }           
        });
        return containers;
    },
    getReusable: function(){
        return { containers: GRID.getReusableContainers().toJSON() };
    },
    initializesDraggable: function(){
        this.$el.find(".grid-new-element").draggable({ 
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

                // only first layer of .grid-containers (needed if sidebar with nested grid)
                var $containers = $grid.find('.grid-container').filter(function(){
                   return !$(this).parent().closest(".grid-container").length;
                });

                var $dropArea = $(document.createElement("div"))
                                .addClass("container-drop-area-wrapper")
                                .attr("data-type","container-drop-area-wrapper");
                $grid.find(".containers-wrapper").prepend($dropArea.clone());
                $containers.after( $dropArea.clone() );
                $grid.find(".container-drop-area-wrapper").append($(document.createElement("div")).addClass("container-drop-area"));
                $grid.find(".container-drop-area").droppable({ 
                    accept: ".grid-new-element",
                    hoverClass: "hover",
                    drop: function( event, ui ) {
                        
                        var $draggable = $(ui.draggable);
                        var containerReusable = $draggable.data("reusable"); 
                        var containerType =  $draggable.data("type");
                        var $dropwrapper = $(this).parent();
                        
                        $dropwrapper.removeClass('container-drop-area-wrapper').addClass('new-container-target');
                        GRID.getView().$el.find('.container-drop-area-wrapper').remove();
                        var new_index = $dropwrapper.index();
                        
                        if(containerReusable == true || containerReusable == "true"){
                            var container = GRID.getReusableContainers().at($draggable.index());
                            GRID.getModel().addReuseContainer(container, new_index);
                            GRID.log(["REUSED", container]);
                            return;
                        }

                        GRID.getModel().createContainer(containerType, new_index);
                    }
                });
            },
            stop: function( event, ui ){
                GRID.getView().$el.find('.container-drop-area-wrapper').remove();
            }
        });
        return this;
    }
});