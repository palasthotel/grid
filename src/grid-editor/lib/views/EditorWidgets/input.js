/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

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