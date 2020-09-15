/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

import GridBackbone from 'backbone'

boxEditorControls['input']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-input",
    initialize:function(){

    },
    render:function(){
        this.$el.empty();
        const val = this.model.container[this.model.structure.key];

        this.$el.append(jQuery("<label />").text(this.model.structure.label));
        this.$el.append(
            jQuery("<input />")
                .addClass("dynamic-value")
                .attr("type", this.model.structure.inputType)
                .val((typeof val === typeof undefined)? "": val)
        );
        this.$el.addClass("grid-editor-widget-input__"+this.model.structure.inputType);
        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});