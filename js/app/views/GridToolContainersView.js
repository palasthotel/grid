var GridToolContainersView = GridBackbone.View.extend({
    className: "grid-tool grid-element-container",
    events:{
        "click .grid-container-type": "renderContainerType"
    },
    render: function(){
        this.$el.empty();
        this.$el.append(ich.tpl_toolContainers({}));
        // because of old css
        this.$el.show();
        this.delegateEvents();
        this.$el.find(".element-type-tabs li:first-child()").trigger("click");
        return this;
    },
    renderContainerType: function(event){
        var $type = jQuery(event.target);
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
    renderContainerTypes: function(event){
        var $target = jQuery(event.target);
        this.$el.find(".element-type-tabs li").removeClass('active');
        $target.addClass('active');
        var containers = {};
        switch($target.attr("role")){
            case "show-reusable":
            containers = this.getReusable();
            break;
            case "show-containers":
            containers = this.getContainers($target.attr("scope"));
            break;
        }
        var $ul = this.$el.find(".element-list");
        $ul.empty();
        GRID.log(["containers", containers]);
        $ul.replaceWith(ich.tpl_toolContainersContainer(containers));
        this.initializesDraggable();
        return this;
    },
    getContainers: function(scope){
        var scope_val = "C-";
        if(scope == "sidebar"){ scope_val = "S-"; }
        var containers = { containers: this.collection.toJSON() };
        _.each(containers.containers, function(value, key, list){
            value.slots = [];
            if( value.type.indexOf(scope_val) != 0 ){
                delete containers.containers[key];
            } else {
                for( var i = 0 ;i < value.numslots; i++){
                    value.slots.push(i);
                }
            }           
        });
        GRID.log(["getContainers",scope, containers]);
        return containers;
    },
    getReusable: function(){
        return { containers: GRID.getReusableContainers().toJSON() };
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
                var $containers = $grid.find(".grid-container");
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
                        
                        var $draggable = $(ui.draggable);
                        var containerReusable = $draggable.data("reusable"); 
                        var containerType =  $draggable.data("type");
                        var $dropwrapper = $(this).parent();
                        
                        $dropwrapper.removeClass('container-drop-area-wrapper').addClass('new-container-target');
                        GRID.getView().$el.find('.container-drop-area-wrapper').remove();
                        var new_index = $dropwrapper.index();

                        GRID.log(["DROPPiNG", $draggable, containerReusable]);
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
                GRID.log("stop Dragging");
                GRID.getView().$el.find('.container-drop-area-wrapper').remove();
            }
        });
        return this;
    }
});