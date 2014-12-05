/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridToolBoxBlueprintsView = GridBackbone.View.extend({
    className: "grid-box-blueprints",
    timer:null,
    blueprints: null,
    events:{
        "keyup .grid-box-blueprints-search input": "searchString"
    },
    render: function(){
        this.blueprints = this.model.getBlueprints();
        this.box_type = this.model.get("type");
        this.listenTo(this.blueprints,"add", this.addBlueprintBox);
        this.model.searchBoxes();
        this.delegateEvents();
        if(this.model.get("criteria").length > 0){
            this.$el.append('<div class="grid-box-blueprints-search"><input placeholder="Which do you need?" type="text" value="" /></div>');
        }
        this.$blueprintslist = jQuery("<div class='grid-box-blueprints-list'></div>");
        this.$el.append(this.$blueprintslist);
        return this;
    },
    addBlueprintBox: function(blueprint,collection,event){
        var json = blueprint.toJSON();
        json.cid = blueprint.cid;
        if(this.box_type == "reference"){
            json.reusable = true;
        } else {
            json.reusable = false;
        }
        this.$blueprintslist.append(ich.tpl_toolBoxesBlueprint(json));
        this.initializesDraggable();
        return this;
    },
    searchString:function(event){
        var input=jQuery(event.target).val();
        if(input.length>0 && input.length<2)return;
        var self=this;
        if(this.timer)
            clearTimeout(this.timer);
        this.timer=setTimeout(function(){
            self.stopListening(self.blueprints);
            self.blueprints=self.model.search(input,self.model.criteria);
            self.$blueprintslist.empty();
            self.listenTo(self.blueprints, "add", self.addBlueprintBox);
        },300);
    },
    initializesDraggable: function(){
        var self = this;
        this.$el.find(".grid-box-dragger").draggable({ 
            helper: function(event, element){
                return jQuery("<div class='dragger-helper'></div>");
            },
            cursorAt: { left: 30, top:30 },
            zIndex: 199,
            appendTo: GRID.getView().$el,
            addClass: true,
            //connectToSortable: GRID_SORTABLE,
            start: function(event, ui){
                
                var $ = jQuery;
                $slots = jQuery(GRID.getView().el).find(".grid-container-type-c[data-reused=false] .grid-slot .grid-boxes-wrapper"+
                                                        ", .grid-container-type-sc .grid-slot .grid-boxes-wrapper");
                GRID.log($slots);
                // drop place template
                // TODO: if boxes toggled hidden 
                // var $toggle_btn = $toolbar.find("[role=hide_boxes]");

                $slots.children(".grid-box").before($( document.createElement('div'))
                                .addClass("grid-box-drop-area-wrapper"));
                $slots.append($( document.createElement('div'))
                                .addClass("grid-box-drop-area-wrapper"));
                $slots.find(".grid-box-drop-area-wrapper").append($( document.createElement('div'))
                                .addClass("grid-box-drop-area"));
                
                $slots.find(".grid-box-drop-area").droppable({ 
                    accept: ".grid-box-dragger",
                    hoverClass: "hover",
                    drop: function( event, ui ) {
                        var $this_box = $(ui.draggable);
                        var $this_drop = $(this);
                        var $this_slot = $this_drop.parents(".grid-slot");
                        var $this_container = $this_slot.parents(".grid-container");
                        var slot = GRID.getModel().getContainers().get($this_container.data("id")).getSlots().get($this_slot.data("id"));
                        var blueprint = self.blueprints.get($this_box.data("cid"));

                        $new_box = $this_drop.parent().addClass('grid-new-box-place').removeClass('grid-box-drop-area-wrapper');
                        GRID.getView().$el.find(".grid-box-drop-area-wrapper").remove();
                        
                        var box = slot.createBox(blueprint, $new_box.index() );
                    }
                });
                
            },
            stop: function( event, ui ){
                GRID.getView().$el.find(".grid-box-drop-area-wrapper").remove();
            }
        });
        return this;
    }
});

