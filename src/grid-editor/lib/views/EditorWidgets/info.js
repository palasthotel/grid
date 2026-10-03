/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/


boxEditorControls['info']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-info",
    initialize:function(){

    },
    render:function(){
        if ( null != this.model.structure.label ){
            jQuery(this.el).html("<label>"+this.model.structure.label+"</label><p class='info'>"+this.model.structure.text+"</p>");
        }
        else{
            jQuery(this.el).html("<p class='info'>"+this.model.structure.text+"</p>");
        }
        return this;
    },
    fetchValue:function(){
        return {};
    }
});
