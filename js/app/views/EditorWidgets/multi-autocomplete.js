boxEditorControls['m-autocomplete']=GridBackbone.View.extend({
    className: "grid-editor-widget-m-autocomplete",
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
        html+="<div class=loading rotate'></div>";
        html+="<ul class='suggestion-list'></ul>";
        

        this.$el.html(html);
    
        this.$el.on("click", ".icon-close", function(e){
            var item = $(this).parent();
            item.empty();
            item.remove();
                            
        });

        if(fetch)
        {
            var key=this.model.container[this.model.structure.key];
            this.$el.find(".autocomplete-multiselect-item").data("key");
            var box=this.model.box;
            var self=this;
            $.each(this.model.container[this.model.structure.key], function(index, key) 
            {
                GridAjax("typeAheadGetText",[box.getGrid().get("id"),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),self.model.parentpath+self.model.structure.key,key],
                {
                    success_fn:function(data)
                    {
                        self.$el.append("<div class='autocomplete-multiselect-item' data-key='"+key+"'><span>"+data.result+"</span><span class='icon icon-close'></span></div>");
                    }
                });
            });
        }
        
        return this;
    },
    fetchValue:function(){
        var result = [];
        this.$el.find(".autocomplete-multiselect-item").each(function(index,element){
            result.push($(element).data("key"));
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
            if(this.$el.find("input.i-autocomplete").val()==this.old_search_string)return;
            var self=this;
            var search=this.$el.find("input.i-autocomplete").val();
            this.$el.find(".loading").show();
            var box=this.model.box;
            GridAjax("typeAheadSearch",[box.getGrid().get("id"),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),this.model.parentpath+this.model.structure.key,search],{
                success_fn:function(data){
                    self.old_search_string=search;
                    self.$el.find(".suggestion-list").empty();
                    _.each(data.result,function(elem){
                        self.$el.find(".suggestion-list").append(jQuery("<li>"+elem.value+"</li>").attr("data-key",elem.key));
                    });
                    self.$el.find(".loading").hide();
                }
            });
        }
    },
    selectItem:function($item){
        var key=$item.data("key");
        var value=$item.text();
        if($(".autocomplete-multiselect-item[data-key='"+key+"']").length) 
                {
                    this.$el.find(".suggestion-list").empty();
                    this.$el.find("input.i-autocomplete").removeAttr('value');
                }
        else
        {
            this.$el.find(".autocomplete-wrapper")
            .append(
                $("<div></div>")
                    .addClass("autocomplete-multiselect-item")
                    .text(value)
                    .attr({
                        "data-key": key
                    })
                    .append(
                        $("<span></span>")
                            .addClass("icon icon-close")
                            .text(" X")
                            .click(function()
                            {
                                var item = $(this).parent();
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


/**
 * STYLESHEET FOR EDWARD
 * ================
 *
 * DELETE-ICON
 * 
.icon-close {
    display: block;
    text-indent: -99999px;
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
    background-image: url("../images/icons_888888_256x240.png");
    background-position: -80px -128px; 
    float: right;
    cursor: pointer;
}

 * SUGGESTION-LIST
 *
.suggestion-list {
    position: absolute;
    list-style: none;
    padding: 0;
    margin: 0;
    display: block;
    outline: none;  
}

.suggestion-list li {
    position: relative;
    margin: 0;
    padding: 3px 1em 3px .4em;
    cursor: pointer;
    min-height: 0;
}

.suggestion-list li:hover {
    border: 1px solid #999999;
    background: #509BF8;
    font-weight: normal;
    color: #FFFFFF;
}

 * AUTOCOMPLETE ITEM
 *
.autocomplete-multiselect-item {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1px 3px;
    margin-right: 2px;
    margin-bottom: 3px;
    color: #333;
    background-color: #f6f6f6;
}

 * 
 */