/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['textarea']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-textarea",
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><textarea class='dynamic-value form-textarea'>"+text+"</textarea>");
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("textarea").val();
    }
});
