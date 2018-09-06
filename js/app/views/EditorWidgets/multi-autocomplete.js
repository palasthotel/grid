/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['multi-autocomplete']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-multi-autocomplete",
    events:{
        "keyup .i-autocomplete":"keyup",
        "click .suggestion-list li":"listItemSelected"
    },
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label>";
        var classes="autocomplete-wrapper form-autocomplete dynamic-value";
        var fetch=false;
        if(this.model.container[this.model.structure.key]!='' ||
            this.model.container[this.model.structure.key]===0)
        {
            fetch=true;
        }
        
        html+="<div class='"+classes+"'><input type=text class='form-text autocomplete i-autocomplete' />";
	    html+="<div class='loading'></div>";
        html+="<ul class='suggestion-list'></ul>";
        

        this.$el.html(html);
    
        this.$el.on("click", ".icon-cancel", function(e){
            var item = jQuery(this).parent();
            item.empty();
            item.remove();
                            
        });

        if(fetch)
        {
            var self=this;
            var box=this.model.box;
            var content = this.model.container[this.model.structure.key];
            
            if(typeof content === typeof undefined){
                content = [];
            } else if( typeof content !== typeof []){
                // legacy: before multi autoselect support
                content = [content];
            }
	        
            jQuery.each(content, function(index, key){
	            self.$el.find(".loading").addClass("go");
                GridAjax(
                    "typeAheadGetText",
                    [
                        box.getGrid().getGridID(),
                        box.getContainer().get("id"),
                        box.getSlot().get("id"),
                        box.getIndex(),
                        self.model.parentpath+self.model.structure.key,
                        key
                    ],
                    {
                        success_fn:function(data) {
	                        self.$el.find(".loading").removeClass("go");
                            self.$el
                                .find(".autocomplete-wrapper")
                                .append("<div class='autocomplete-multiselect-item' data-key='"+key+"'>"+
                                    "<span>"+data.result+"</span>"+
                                    "<span class='icon icon-cancel'></span>"+
                                    "</div>");
                    }
                });
                
            });
        }
        
        return this;
    },
    fetchValue:function(){
        var result = [];
        this.$el.find(".autocomplete-multiselect-item").each(function(index,element){
            result.push(jQuery(element).data("key"));
        });
        return result;
    },

    keyup:function(e) {
        if(e.which==13)
        {
            this.selectItem(this.$el.find(".suggestion-list li").first());
        }
        else
        {
            var self=this;
            var search=this.$el.find("input.i-autocomplete").val();
            
            /**
             * dont execute same query twice
             */
            if( this.$el.find("input.i-autocomplete").val() == this.old_search_string ) return;
            self.old_search_string=search;
            
            /**
             * animate loading
             */
            this.$el.find(".loading").addClass("go");
    
            /**
             * start search timeout
             */
            clearTimeout(this.searching);
            this.searching = setTimeout(function(){
                self.doSearch(search);
            }, 1000);
            
        }
    },
    doSearch: function(search){
        var self = this;
        var box=this.model.box;
        
        GridAjax(
            "typeAheadSearch",
            [
                box.getGrid().getGridID(),
                box.getContainer().get("id"),
                box.getSlot().get("id"),
                box.getIndex(),
                this.model.parentpath+this.model.structure.key,
                search
            ],
            {
            success_fn:function(data){
                self.$el.find(".suggestion-list").empty();
                _.each(data.result,function(elem){
                    self.$el.find(".suggestion-list").append(jQuery("<li/>").text(elem.value).attr("data-key",elem.key));
                });
                self.$el.find(".loading").removeClass("go");
            }
        });
        
    },
    selectItem:function($item){
        var key=$item.data("key");
        var value=$item.text();
        if(jQuery(".autocomplete-multiselect-item[data-key='"+key+"']").length)
                {
                    this.$el.find(".suggestion-list").empty();
                    this.$el.find("input.i-autocomplete").removeAttr('value');
                }
        else
        {
            this.$el.find(".autocomplete-wrapper")
            .append(
                jQuery("<div></div>")
                    .addClass("autocomplete-multiselect-item")
                    .text(value)
                    .attr({
                        "data-key": key
                    })
                    .append(
                        jQuery("<span></span>")
                            .addClass("icon icon-cancel")
                            .click(function()
                            {
                                var item = jQuery(this).parent();
                                item.empty();
                                item.remove();
                            })
                    )
            )  
        }
        

        this.$el.find(".suggestion-list").empty();
        this.$el.find("input.i-autocomplete").removeAttr('value');
        
    },
    listItemSelected:function(e){
        this.selectItem(jQuery(e.target));
    }
});