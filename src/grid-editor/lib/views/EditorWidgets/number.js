/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['number']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-number",
    initialize:function(){

    },
    render:function(){
        var text=this.model.container[this.model.structure.key];
        if(!text)text="";
        this.$el.html("<label>"+this.model.structure.label+"</label><input type=number class='dynamic-value' value='"+text+"'/>");
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});