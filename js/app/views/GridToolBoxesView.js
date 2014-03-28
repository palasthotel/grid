var GridToolBoxesView = Backbone.View.extend({
    className: "g-tool g-box clearfix",
    currentBox:null,
    timer:null,
    events:{
    	"click .box-type-tabs li": "searchBoxes",
        "keyup .search-bar input": "searchString"
    },
    initializes: function(){
    	this.render();
    },
    render: function(){
    	var self = this;
        this.$el.empty();
        this.$el.append(ich.tpl_toolBoxes());
        this.collection.each(function(boxtype, index){
        	GRID.log(["type tab", boxtype, index]);
        	jQuery("<li></li>")
                .attr("data-index",index)
                .attr("title", boxtype.get("title") ).attr("data-type", boxtype.get("type") )
                .appendTo(self.$el.find(".box-type-tabs"));
        });
        this.delegateEvents();
        this.$el.find(".box-type-tabs li").first().trigger("click");
        return this;
    },
    searchBoxes: function(event){
    	GRID.log(["searchBoxes",event]);
        this.$el.find(".box-list").empty();
        this.$el.find(".box-type-tabs li").removeClass('active');
    	var $li = jQuery(event.target);
        $li.addClass('active');
    	var boxtype = this.collection.at($li.data("index"));
        this.currentBox=boxtype;
        if(boxtype.get("criteria").length==0)
        {
            this.$el.find(".search-bar").hide();
        }
        else
        {
            this.$el.find(".search-bar").show();
        }
        this.stopListening(this.blueprints);
    	this.blueprints = boxtype.searchBoxes();
        this.$el.find(".box-list").empty();
        this.listenTo(this.blueprints ,"add", this.buildBoxlist);
        return this;
    },
    searchString:function(event){
        var input=this.$el.find(".search-bar input").val();
        if(input.length>0 && input.length<2)return;
        var self=this;
        if(this.timer)
            clearTimeout(this.timer);
        this.timer=setTimeout(function(){
            self.stopListening(self.blueprints);
            self.blueprints=self.currentBox.search(input,self.currentBox.criteria);
            self.$el.find(".box-list").empty();
            self.listenTo(self.blueprints, "add", self.buildBoxlist);
        },300);
    },
    buildBoxlist: function(blueprint,collection,event){
        GRID.log(["buildBoxlist", this.blueprints, blueprint]);
        var json = blueprint.toJSON();
        json.cid = blueprint.cid;
        this.$el.find(".box-list").append(ich.tpl_toolBoxBlueprint(json));
        this.initializesDraggable();
        return this;
    },
    initializesDraggable: function(){
        var self = this;
        this.$el.find(".box-dragger").draggable({ 
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
                $slots = jQuery(GRID.getView().el).find(".container[data-reused=false][data-type*=C-] .slot .boxes-wrapper");
                GRID.log($slots);
                // drop place template
                // TODO: if boxes toggled hidden 
                // var $toggle_btn = $toolbar.find("[role=hide_boxes]");

                $slots.children(".box").before($( document.createElement('div'))
                                .addClass("box-drop-area-wrapper"));
                $slots.append($( document.createElement('div'))
                                .addClass("box-drop-area-wrapper"));
                $slots.find(".box-drop-area-wrapper").append($( document.createElement('div'))
                                .addClass("box-drop-area"));
                
                $slots.find(".box-drop-area").droppable({ 
                    accept: ".box-dragger",
                    hoverClass: "hover",
                    drop: function( event, ui ) {
                        var $this_box = $(ui.draggable);
                        var $this_drop = $(this);
                        var $this_slot = $this_drop.parents(".slot");
                        var $this_container = $this_slot.parents(".container");
                        var slot = GRID.getModel().getContainers().get($this_container.data("id")).getSlots().get($this_slot.data("id"));
                        var blueprint = self.blueprints.get($this_box.data("cid"));

                        $new_box = $this_drop.parent().addClass('new-box-place').removeClass('box-drop-area-wrapper');
                        GRID.getView().$el.find(".box-drop-area-wrapper").remove();

                        GRID.log(["DROPPED Box", $this_box.data("cid"), $this_drop, $this_slot, $this_container, slot, blueprint]);
                        var box = slot.createBox(blueprint, $new_box.index() );
                    }
                });
                
            },
            stop: function( event, ui ){
                GRID.getView().$el.find(".box-drop-area-wrapper").remove();
            }
        });
        return this;
    }
});

