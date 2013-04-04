
$(function() {
	// Elemente
	$stateDisplay = $(".state-display");
	// Warnung beim verlassen ohne Speichern
	var saved = true;
	window.onbeforeunload = function(){
		if(!saved) return "Es wurden noch nicht alle Änderungen gespeichert!";
	}
	// Handler für die Toolbar Buttons
	$("#toolbar").on("click","button",function(e){
		$this = $(this);
		switch($this.attr("role")){
			case "load":
				loadGrid();
				console.log("Container laden");
				break;
			case "save":
				saveGrid();
				console.log("Container speichern");
				break;
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
	var GRID_SORTABLE = "#grid";
	var $grid = $( GRID_SORTABLE).sortable({
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
	var CONTAINER_DROP_AREA_CLASS = "container-drop-area";
	$("#container-dragger").draggable({ 
		helper: "clone", 
		zIndex: 99, 
		//connectToSortable: GRID_SORTABLE,
		start: function(event, ui){
			$grid.children().before("<div class='"+CONTAINER_DROP_AREA_CLASS+"'>Drop Area</div>");
			$grid.append("<div class='"+CONTAINER_DROP_AREA_CLASS+"'>Drop Area</div>");
			$grid.children("."+CONTAINER_DROP_AREA_CLASS).droppable({ 
				accept: ".new-container",
				drop: function( event, ui ) {
					containerType =  $("select[name=container-type]").val();
					$.tmpl( "containerTemplate", [{"type": containerType, "containerid" : 1 }] ).insertBefore( $(this) );
					console.log("ok?");
				}
			});
		},
		stop: function( event, ui ){
			$grid.children().remove("."+CONTAINER_DROP_AREA_CLASS)
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
	// Grid AJAX functions
	function loadGrid(){	
		json = {};
		json["method"] = "loadGrid";
		json["params"] = [ID];	
		sendAjax(
			"loadGrid", 
			[ID], 
			function(data){
				$grid.empty();
				var result = data.result;
				if(result.isDraft == true){
					$stateDisplay.text("Entwurf...");
				} else {
					$stateDisplay.text("Aktuell!");
				}
				var container_arr = result.container;
				$.tmpl( "containerTemplate", container_arr ).appendTo( $grid );
				console.log(container_arr);
			}, 
			function(jqXHR, textStatus, error){
				console.log(error);
			}
		);
	}
	function saveGrid(){
		json = {};
		json["method"] = "saveGrid";
		params = {};
		// container auslesen
			// solots auslesen
				// Boxen auslesen
		$.post(
			SERVER,
			{
				"method": "saveGrid",
				"param" : JSON.stringify(param)
			},function(data){
				console.log(data);
			}, 
			"json");
	}
	// Grid AJAX function ENDE
	var box_toggling = false;
	function toggleBoxes(){
		if(box_toggling) return;
		toggling = true;
		$(".box").slideToggle(200,function(){
			box_toggling = false;
		});
	}
	// Serverkommunikation
	var SERVER = "http://emma-dev.ia-code.ws/grid/core/index.php?path=/ajax";
	var ID = 43;
	function sendAjax(method, params_array, success, error){
		json = {};
		json["method"] = method;
		json["params"] = params_array;
		$.ajax({
		   url: SERVER,
		   dataType:"json",
		   type:'POST',
		   data: JSON.stringify(json),
		   success: success,
		   error: error
		 });
		 /*	
		 $.ajax({
		   url: SERVER,
		   dataType:"json",
		   type:'POST',
		   data: JSON.stringify(json),
		   success:function(data){
				   console.log(data);
				   // container auslesen
						// solots auslesen
							// Boxen auslesen
		   },
		   error:function(jqXHR,textStatus,error){
				   console.log(jqXHR);console.log(textStatus);console.log(error);
		   }
		 });
		 */
	}
});


