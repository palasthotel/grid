/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['autocomplete']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-autocomplete",
    events:{
        "keyup .i-autocomplete":"keyup",
        "click .suggestion-list li":"listItemSelected",
        "click .cancel":"cancelSelection"
    },
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label>";
        var classes="autocomplete-wrapper form-autocomplete dynamic-value";
        var readonly="";
        var fetch=false;
        if(this.model.container[this.model.structure.key]!='' ||
            this.model.container[this.model.structure.key]===0)
        {
            classes+=" locked";            
            readonly="readonly=readonly";
            fetch=true;
        }
        html+="<div class='"+classes+"'><input type=text class='form-text autocomplete i-autocomplete' "+readonly+"/>";
        html+="<div class='loading'></div>";
        html+="<div class='cancel icon-cancel'></div>";
        html+="<ul class='suggestion-list'></ul>";
        jQuery(this.$el).html(html);
        if(fetch)
        {
            var key=this.model.container[this.model.structure.key];
            this.$el.find("input.i-autocomplete").data("key",key);
            var box=this.model.box;
            var self=this;
            GridAjax("typeAheadGetText",[box.getGrid().get("id"),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),this.model.parentpath+this.model.structure.key,key],{
                success_fn:function(data)
                {
                    self.$el.find("input.i-autocomplete").val(data.result);
                }
            });
        }
        return this;
    },
    fetchValue:function(){
        return this.$el.find("input.i-autocomplete").data("key");
    },
    keyup:function(e) {
        if(e.which==13)
        {
            this.selectItem(this.$el.find(".suggestion-list li").first());
        }
        else
        {
            var search=this.$el.find("input.i-autocomplete").val();
            this.$el.find(".loading").addClass("go");
            clearTimeout(this.searching);
            var self = this;
            this.searching = setTimeout(function(){
                self.doSearch(search);
            }, 1000);
            
        }
    },
    doSearch: function(search){
        var self = this;
        var box=this.model.box;
        
        GridAjax("typeAheadSearch",[box.getGrid().get("id"),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),this.model.parentpath+this.model.structure.key,search],{
            success_fn:function(data){
                self.$el.find(".suggestion-list").empty();
                _.each(data.result,function(elem){
                    self.$el.find(".suggestion-list").append(jQuery("<li>"+elem.value+"</li>").attr("data-key",elem.key));
                });
                self.$el.find(".loading").removeClass("go");
            }
        });
    },
    selectItem:function($item){
        var key=$item.data("key");
        var value=$item.text();
        this.$el.find(".autocomplete-wrapper").addClass("locked");
        this.$el.find("input.i-autocomplete")
            .val(value)
            .attr("readonly","readonly")
            .data("key",key);
        this.$el.find(".suggestion-list").empty();
    },
    listItemSelected:function(e){
        this.selectItem(jQuery(e.target));
    },
    cancelSelection:function(e){
        this.$el.find(".autocomplete-wrapper").removeClass("locked");
        this.$el.find("input.i-autocomplete")
            .data("key","")
            .removeAttr("readonly")
            .val("");
        this.old_search_string="";
    }
});