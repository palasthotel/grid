/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/


boxEditorControls['hidden']=GridBackbone.View.extend({
	className: "grid-editor-widget grid-editor-widget-hidden",
    initialize:function(){

    },
    render:function(){
        return this;
    },
    fetchValue:function(){
        return this.model.container[this.model.structure.key];
    }
});