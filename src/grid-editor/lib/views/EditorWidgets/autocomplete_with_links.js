/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import _ from 'underscore'

boxEditorControls['autocomplete-with-links']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-autocomplete-with-links",
    events:{
        "keyup .i-autocomplete":"keyup",
        "click .suggestion-list li":"listItemSelected",
        "click .cancel":"cancelSelection"
    },
    initialize:function(){

    },
    render:function(){
        let html="<label>"+this.model.structure.label+"</label>";
        let classes="autocomplete-wrapper form-autocomplete dynamic-value";
        let readonly="";
        let fetch=false;
	    const key_value = this.model.container[this.model.structure.key];
	    if(typeof key_value !== typeof undefined && key_value !== '')
	    {
            classes+=" locked";
            readonly="readonly";
            fetch=true;
        }
        html+="<div class='"+classes+"'>";
        html+="<input type=text class='form-text autocomplete i-autocomplete' "+readonly+"/>";
        html+="<div class='cancel'><span class='icon-cancel'></span></div>";
        html+="<ul class='suggestion-list'></ul>";

		html+='<p class="links">';
        html+=  '<a class="empty" data-raw="'+this.model.structure.emptyurl+'" href="'+this.model.structure.emptyurl+'" target="_blank">'+this.model.structure.emptylinktext+'</a>';
		html+=	'<a class="full" data-raw="'+this.model.structure.url+'" href="" target="_blank">'+this.model.structure.linktext+'</a>';
		html+='</p>';
        html+= "</div>";

        jQuery(this.$el).html(html);
        if(fetch) {
            this.$el.find("input.i-autocomplete").data("key",key_value);
            const box=this.model.box;
            const self=this;
            new GridAjax("typeAheadGetText",[box.getGrid().getGridID(),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),this.model.parentpath+this.model.structure.key,key_value],{
                success_fn:function(data)
                {
                    self.$el.find("input.i-autocomplete").val(data.result);
                }
            });
	        const $linkUrl=this.$el.find("a.full");
	        $linkUrl.attr('href',$linkUrl.data('raw').replace('%',key_value));
        }
        return this;
    },
    fetchValue:function(){
        return this.$el.find("input.i-autocomplete").data("key");
    },

    keyup:function(e) {
        const $input = this.$el.find("input.i-autocomplete");
        if(typeof $input.attr('readonly') !== 'undefined' || $input.attr('readonly') === false ) return;
        if(e.which===13)
        {
            this.selectItem(this.$el.find(".suggestion-list li").first());
        }
        else
        {
            const search=this.$el.find("input.i-autocomplete").val();
            if(search==this.old_search_string)return;
            const self=this;

            this.$el.find(".loading").show();

            clearTimeout(this.searching);
            this.searching = setTimeout(function(){
                self.doSearch(search);
            }, 1000);


        }
    },
    doSearch: function(search){
        const self = this;
        const box=this.model.box;
        new GridAjax("typeAheadSearch",[box.getGrid().getGridID(),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),this.model.parentpath+this.model.structure.key,search],{
            success_fn:function(data){
                self.old_search_string=search;
                self.$el.find(".suggestion-list").empty();
                _.each(data.result,function(elem){
                    self.$el.find(".suggestion-list").append(jQuery("<li/>").text(elem.value).attr("data-key",elem.key));
                });
                self.$el.find(".loading").hide();
            }
        });
    },
    selectItem:function($item){
        const key_value=$item.data("key");
        const name=$item.text();
        this.$el.find(".autocomplete-wrapper").addClass("locked");
        this.$el.find("input.i-autocomplete")
            .val(name)
            .attr("readonly","readonly")
            .data("key",key_value);
        this.$el.find(".suggestion-list").empty();
        const $linkUrl=this.$el.find("a.full");
        $linkUrl.attr('href',$linkUrl.data('raw').replace('%',key_value));
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
