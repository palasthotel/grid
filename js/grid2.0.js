debug_json = {
	"container": [
		{
			"id": 1,
			"title": "Bild header",
			"type":"12",
			"style": "",
			"slots": [
				{ "id": 1, "boxes": [] }
			]
		},
		{
			"id": 2,
			"title": "Artikel und Twitterbox",
			"type": "8-4",
			"slots": [
				{ "id": 2, "boxes": [
					{
						"id": 10,
						"title":"",
						"type": "",
						"style": "",
						"prolog":"",
						"epilog":"",
						"read-more-text":"",
						"read-more-link":"",
						"content":""
					}, {
						"id": 12,
						"title":"",
						"type": "",
						"style": "",
						"prolog":"",
						"epilog":"",
						"read-more-text":"",
						"read-more-link":"",
						"content":""
					}
				] },
				{ "id": 3, "boxes": [] }
			]
		},
		{
			"id": 3,
			"title": "Artikel und Twitterbox",
			"type": "4-8",
			"slots": [
				{ "id": 4, "boxes": [] },
				{ "id": 5, "boxes": [] }
			]
		}
	]
}

$(function() {
	// Warnung beim verlassen ohne Speichern
	saved = true;
	window.onbeforeunload = function(){
		if(!saved) return "Es wurden noch nicht alle Änderungen gespeichert!";
	}
	
	// Handler für die Toolbar Buttons
	$("#toolbar").on("click","button",function(e){
		$this = $(this);
		switch($this.attr("role")){
			case "add_container":
				console.log("Container hinzufügen");
				break;
			case "add_box":
				console.log("Box hinzufügen");
				break;
			case "hide_boxes":
				toggleBoxes();
				console.log("Boxen ausblenden");
				break;
			default:
				console.log("Role unbekannt: "+$this.attr("role"));
				break;
		}
	});
	// container funktionen
	$( "#grid" ).sortable({
		handle: ".c-sort-handle",
		//axis: "y",
		//cursor: "row-resize",
		items:".container",
		placeholder: "c-sort-placeholder",
		start: function( event, ui ){
			//$(".box").slideUp(100);
			console.log("started sorting container");
		},
		stop: function(event, ui){
			//$(".box").slideDown(100);
			console.log("stopped sorting container");
		}
	});
	// slot funktionen
	// Box funktionen
	$(".slot").sortable({
		items: ".box",
		connectWith: ".slot",
		placeholder: "b-sort-placeholder",
		forcePlaceholderSize: true,
		helper: function(event, element){
			return $("<div class='b-sort-helper'></div>");
		},
		start: function(e, ui){
			ui.placeholder.height(ui.item.height());
		},
		cursorAt: { left: 30, top:30 }
	});
	box_toggling = false;
	function toggleBoxes(){
		if(box_toggling) return;
		toggling = true;
		$(".box").slideToggle(200,function(){
			box_toggling = false;
		});
	}
});