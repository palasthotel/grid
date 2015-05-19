/**
* @author Palasthotel <rezeption@palasthotel.de>
* @copyright Copyright (c) 2014, Palasthotel
* @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
* @package Palasthotel\Grid
*/

var GridRevisionsView = GridBackbone.View.extend({
	tagName: 'div',
	className: 'grid-revisions',
	events:{
		'click [role=preview]':'onPreview',
		'click [role=delete]':'onDelete',
		'click [role=revert]':'onRevert'
	},
	initialize:function(){
		this.listenTo(this.collection, 'add',this.render);
		this.$list = jQuery("<div class='grid-revisions-list'></ul>");
		this.$el.append(this.$list);
		this.interval = setInterval(this.onRevisionsScroll.bind(this),1000);
	},
	render:function(){
		var revisions=this.collection.toJSON();
		_.each(revisions,function(elem){
			elem.isDraft=false;
			elem.isPublished=false;
			elem.isDeprecated=false;
			if(elem.state=="published")
			{
				elem.isPublished=true;
			}
			else if(elem.state=="draft")
			{
				elem.isDraft=true;
			}
			else if(elem.state=="deprecated")
			{
				elem.isDeprecated=true;
			}
			elem["readable_date"] = "--.--.----";
			if(typeof elem["date"] != "undefined" && elem["date"] != "" && elem["date"] != null){
				var date = new Date(parseInt(elem["date"])*1000);
				elem["readable_date"] = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()+" &bull; "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			}
			if(typeof elem["editor"] == "undefined" || elem["editor"] == "" || elem["editor"] == null){
				elem["editor"] = "unknown";
			}
		});
		this.$list.html(ich.tpl_revisions({revisions:revisions,lang_values:document.lang_values}));
		var child_count = this.$list.children().length;
		var list_width = child_count * this.$list.children().last().outerWidth(true);
		this.$list.css("width", list_width);

		return this;
	},
	onRevisionsScroll: function(){
		if(this.collection.nextpage == -1) return;
		if(!this.$el.is(":visible")) return;
		var diff = this.$list.outerWidth(true)-Math.abs(this.$list.position().left);
		diff = diff - this.$el.outerWidth(true);
		if(diff < 300 ){
			this.collection.fetch({page:this.collection.nextpage});
		}
	},
	onPreview:function(e){
		var $revision = jQuery(e.target).parents(".grid-revision");
		var location =  GRID.PREVIEW_PATTERN.replace("{REV}", $revision.data("revision"));
		window.open(location,"_blank");
		this.$el.parents(".rev-wrapper").toggle();
	},
	onDelete:function(e){
		if(!GRID.getRights().get("revert")){
            alert("You have no rights for that...");
            return false;
        }
		GRID.revert();
	},
	onRevert:function(e){
		if(!GRID.getRights().get("revert")){
            alert("You have no rights for that...");
            return false;
        }
		var revision=jQuery(e.srcElement).parents(".grid-revision").data("revision");
		GRID.setToRevision(revision);
	},
});