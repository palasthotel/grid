/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

boxEditorControls['text']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-text",
    initialize:function(){

    },
    render:function(){
        this.$el.empty();

        this.$el.append( jQuery("<label/>").text(this.model.structure.label) );
        this.$el.append(
            jQuery("<input type=text class='dynamic-value'/>")
            .val(this.model.container[this.model.structure.key] || "")
        );

        return this;
    },
    fetchValue:function(){
        return jQuery(this.$el).find("input").val();
    }
});