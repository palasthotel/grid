/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['input']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-input",
    initialize:function(){

    },
    render:function(){
        const val = this.model.container[this.model.structure.key];
        this.$el.html(`
            <label>${this.model.structure.label}</label>
            <input type='${this.model.structure.inputType}' 
                class='dynamic-value' 
                value='${(typeof val === typeof undefined)? "": val}'
            />
        `);
        this.$el.addClass("grid-editor-widget-input__"+this.model.structure.inputType);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});