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
    	var val = this.model.container[this.model.structure.key];
    	var $upload_form_item = jQuery("<div class='form-item file-upload'>");
		$upload_form_item.append("<label>"+this.model.structure.label+"</label>");

		this.$preview = jQuery("<div></div>").addClass("file-upload-preview");
		$upload_form_item.append(this.$preview);

		var $file_input = jQuery("<input type='file' data-path='"+this.model.parentpath+this.model.structure.key+"' class='form-file' />");
		$upload_form_item.append($file_input);

		var fid = this.model.container[this.model.structure.key];

		this.$key_field = jQuery("<input type='hidden' data-key='"+this.model.structure.key+"' "+
			"value='"+((typeof fid !== typeof undefined)? fid: '')+"' class='dynamic-value' />");
		$upload_form_item.append(this.$key_field);


		this.$progress_display = jQuery("<p>").addClass("progress");
		this.$progress_bar_wrapper = jQuery("<div class='progress-bar-wrapper'><div class='bar'></div>");
		this.$progress_bar_status = this.$progress_bar_wrapper.children(".bar");
		if(this.model.container[this.model.structure.key] === "" || this.model.container[this.model.structure.key] === undefined){
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
	        	self.loadPreview();
	        },
	        progressall: function(e, data){
	        	self.progressall(e, data);
	        },
	        always: function(e, data){
	        	console.log(e, data);
	        }
	    }).bind('fileuploadsubmit', { self: self }, this.getFormData);

		this.$el.append($upload_form_item);

		this.loadPreview();

		return this;

    },
	loadPreview: function(){

		this.$preview.empty();

    	var fileid = this.$key_field.val();
    	var path = this.model.parentpath+this.model.structure.key;
		if(typeof fileid === typeof undefined || fileid === "") return;



		var self = this;
		var box=this.model.box;
		var params = [box.getGrid().get("id"),box.getContainer().get("id"),box.getSlot().get("id"),box.getIndex(),path,fileid];
		console.log("getFileInfo", params);
		GridAjax("getFileInfo",params,{
			success_fn:function(data)
			{

				console.log(data.result.src);
				self.$preview.append(
					jQuery("<img>")
					.css('max-width', '200px')
						.attr("src", data.result.src)
				);

			}
		});
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
    	var result = data.result;
    	this.$key_field.val(result.result);
        this.$progress_display.text("OK!");
        this.$progress_bar_status.addClass("done");
    },
    fetchValue:function(){
        return this.$key_field.val();
    }
});
