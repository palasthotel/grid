/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license GPL-3.0-or-later https://www.gnu.org/licenses/gpl-3.0.html
* @package Palasthotel\Grid
*/

boxEditorControls['checkbox']=GridBackbone.View.extend({
    className: "grid-editor-widget grid-editor-widget-checkbox",
    render:function(){
        const value=this.model.container[this.model.structure.key];
        let checked= (value) ? 'checked=checked' : '';
        const html="<label><input type='checkbox' "+checked+" /> "+this.model.structure.label+"</label>";
        this.$el.html(html);
        return this;
    },
    fetchValue:function(){
        return this.$el.find("input[type=checkbox]").is(":checked");
    }
});