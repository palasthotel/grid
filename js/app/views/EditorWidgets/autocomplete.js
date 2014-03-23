boxEditorControls['autocomplete']=Backbone.View.extend({
    initialize:function(){

    },
    render:function(){
        var html="<label>"+this.model.structure.label+"</label>";
        var classes="autocomplete-wrapper form-autocomplete dynamic-value";
        var disabled="";
        if(this.model.container[this.model.structure.key]!='' ||
            this.model.container[this.model.structure.key]===0)
        {
            classes+=" locked";            
            disabled="disabled=disabled";
        }
        html+="<div class='"+classes+"'><input type=text class='form-text autocomplete i-autocomplete' "+disabled+"/>";
        html+="<div class=loading rotate'></div>";
        html+="<div class='cancel'></div>";
        html+="<ul class='suggestion-list'></ul>";
        jQuery(this.$el).html(html);
        //TODO: fetch current autocomplete value and update accordingly
        return this;
    },
    fetchValue:function(){
        //TODO: fetch value
    }
});