/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

boxEditorControls['file']=GridBackbone.View.extend({
	className: "grid-editor-widget grid-editor-widget-file",
    initialize:function(){

    },
    render:function(){
    	var $ = jQuery;
    	var val = this.model.container[this.model.structure.key]
        var $upload_form_item = $("<div class='form-item file-upload'>");
		$upload_form_item.append("<label>"+this.model.structure.label+"</label>");

		var $file_input = $("<input type='file' data-path='"+this.model.parentpath+this.model.structure.key+"' class='form-file' />");
		$upload_form_item.append($file_input);

		this.$key_field = $("<input type='hidden' data-key='"+this.model.structure.key+"' "+
			"value='"+this.model.container[this.model.structure.key]+"' class='dynamic-value' />");
		$upload_form_item.append(this.$key_field);


		this.$progress_display = $("<p>").addClass("progress");
		this.$progress_bar_wrapper = $("<div class='progress-bar-wrapper'><div class='bar'></div>");
		this.$progress_bar_status = this.$progress_bar_wrapper.children(".bar");
		if(this.model.container[this.model.structure.key] == "" || this.model.container[this.model.structure.key] == undefined){
			this.$progress_display.text("Please choose a picture...");
		} else {
			this.$progress_display.text("Choose another picture to override the old one.");
			this.$progress_bar_status.addClass("done");
		}
		$upload_form_item.append(this.$progress_display).append(this.$progress_bar_wrapper);
		var self = this;

		
		$file_input.fileupload({
	        url: this.model.structure.uploadpath,
	        dataType: 'json',
	        paramName: "file",
	        done: function(e, data){
	        	self.uploadDone(e, data);
	        },
	        progressall: function(e, data){
	        	self.progressall(e, data);
	        },
	        always: function(e, data){
	        	console.log(e, data);
	        }
	    }).bind('fileuploadsubmit', { self: self }, this.getFormData);

		this.$el.append($upload_form_item);
		return this;

    },
    getFormData: function(e, data){
	    var self = e.data.self;
	    var element_key = self.model.parentpath+self.model.structure.key;
	    var box = self.model.box;
	    data.formData = {
	    		gridid : GRID.ID, 
	    		container: box.getContainer().get("id"), 
	    		slot : box.getSlot().get("id"), 
	    		box : box.getIndex(), 
	    		key: element_key
	    	};
	    self.$progress_bar_status.removeClass("done");
    },
    progressall: function (e, data) {
    	var percent = (data.loaded/data.total)*100;
    	this.$progress_display.text(Math.round(percent)+"%");
    	this.$progress_bar_status.css("width", percent+"%");
    },
    uploadDone: function(e, data){
    	result  = data.result;
    	this.$key_field.val(result.result);
        this.$progress_display.text("OK!");
        this.$progress_bar_status.addClass("done");
    },
    fetchValue:function(){
        return this.$key_field.val();
    }
});
