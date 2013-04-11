
$(function() {
	// Warnung beim verlassen ohne Speichern
	/*
	var saved = true;
	window.onbeforeunload = function(){
		if(!saved) return "Es wurden noch nicht alle Änderungen gespeichert!";
	}
	*/
	// ----------------
	// init Methode
	// ---------------
	var ID;
	function init() {
		ID = 42;
		loadGrid();
	}
	$(document).ready(init);
	// --------------------
	// Grid laden
	// -------------------
	function loadGrid(){	
		json = {};
		json["method"] = "loadGrid";
		json["params"] = [ID];
		sendAjax(
			"loadGrid", 
			[ID],
			function(data){
				console.log("loadGrid:");
				console.log(data);
				$grid.empty();
				var result = data.result;
				if(result.isDraft == true){
					$stateDisplay.text("Entwurf...");
				} else {
					$stateDisplay.text("Aktuell!");
				}
				var container_arr = result.container;
				buildContainer(container_arr).appendTo( $grid );
				console.log(container_arr);
				refreshBoxSortable()
			}
		);
	}
		
	// ---------------------------
	// Allgemeine Elemente und konstanten
	// --------------------------
	var $stateDisplay = $(".state-display");
	var CSS_GRID_ID = "#grid";
	var $grid = $(CSS_GRID_ID);
	
	var CONTAINER_DROP_AREA_CLASS = "container-drop-area";
	var CSS_CONTAINER_DROP_AREA_CLASS = ".container-drop-area";
	
	var BOX_DROP_AREA_CLASS = "box-drop-area";
	var CSS_BOX_DROP_AREA_CLASS = ".box-drop-area";
	
	var $toolbar = $("#toolbar");
	var $gridTools = $(".grid-tools");
	var $toolContainer = $gridTools.children(".g-container");
	var $toolBox = $gridTools.children(".g-box");
	
	var $toolBoxList = $(".g-box .box-list");
	
	// ---------------------------------
	// Handler für die Werkzeuge
	// ---------------------------------
	$toolbar.on("click","button",function(e){
		$this = $(this);
		switch($this.attr("role")){
			case "load":
				loadGrid();
				break;
			case "save":
				saveGrid();
				break;
			case "publish":
				console.log("Veröffentlichen");
			case "add_container":
				$gridTools.children().hide();
				$toolContainer.show();
				break;
			case "add_box":
				showBoxTools();
				break;
			case "hide_boxes":
				toggleBoxes();
				break;
			default:
				console.log("Role unbekannt: "+$this.attr("role"));
				break;
		}
	});
	// ----------------------------
	// container funktionen
	// --------------------------
	
	$grid.sortable({
		handle: ".c-sort-handle",
		//axis: "y",
		//cursor: "row-resize",
		items:".container",
		placeholder: "c-sort-placeholder",
		start: function( event, ui ){
			//$(".box").slideUp(100);
		},
		stop: function(event, ui){
			//$(".box").slideDown(100);
		},
		update: function( event, ui ){
			params = [ID, ui.item.data("id"), ui.item.index()];
			sendAjax("moveContainer",params,
			function(data){
				if(data.result != true){
					console.log("Fehler! Element muss an originalposition zurück");
				}
			});
		}
	});
	$("#container-dragger").draggable({ 
		helper: "clone", 
		zIndex: 99, 
		//connectToSortable: GRID_SORTABLE,
		start: function(event, ui){
			$grid.children().before("<div class='"+CONTAINER_DROP_AREA_CLASS+"'>Drop Area</div>");
			$grid.append("<div class='"+CONTAINER_DROP_AREA_CLASS+"'>Drop Area</div>");
			$grid.children(CSS_CONTAINER_DROP_AREA_CLASS).droppable({ 
				accept: ".new-container",
				drop: function( event, ui ) {
					containerType =  $("select[name=container-type]").val();
					$temp = buildContainer( 
							[{ 	"type": containerType, 
								"id" : "new",
								"prolog": "prolog",
								"epilog": "epilog" }] )
							.insertBefore( $(this) );
					
					$grid.children().remove(CSS_CONTAINER_DROP_AREA_CLASS);
					params = [ID, containerType, $temp.index()];
					sendAjax("addContainer",params,
					function(data){
						console.log(data);
						$temp.data("id", data.result.id);
						$slots_wrapper = $temp.find(".slots-wrapper");
						$.each( data.result.slots, function(index,value){
							console.log(index+" "+value);
							buildSlot([{"id" : value }]).appendTo( $slots_wrapper );
						});
					});
				}
			});
		},
		stop: function( event, ui ){
			$grid.children().remove(CSS_CONTAINER_DROP_AREA_CLASS);
		}
	});
	$grid.on("click",".c-tools > .c-tool", function(e){
		$this = $(this);
		$container = $this.parents(".container");
		switch($this.attr("role")){
			case "edit":
				showContainerEditor($container);
				break;
			case "ok":
				saveContainer($container);
				break;
			case "revert":
				revertContainerChanges($container);
				break;
			case "trash":
				deleteContainer($container);
				break;
			default:
				console.log($this.attr("role"));
		}
	});
	function deleteContainer($container){
		params = [ID, $container.data("id")];
		sendAjax("deleteContainer",params,function(data){
			if(data.result != true){
				alert("fehler beim Löschen!");
				return;
			}
			$container.slideUp(300,function(){
				$container.remove();
			});
		});
	}
	var revert_data;
	var styles;
	function showContainerEditor($container){
		params = {
					id:$container.data("id"), 
					title: $container.find(".c-title").text(),
					titleurl: $container.find(".c-titleurl").text(),
					type: $container.data("type"),
					prolog: $container.find(".c-prolog").html(),
					epilog: $container.find(".c-epilog").html(),
					readmore: $container.find(".c-readmore").text(),
					readmoreurl: $container.find(".c-readmoreurl").text()
				};
				console.log(params);
		revert_data = {};
		revert_data = params;
		$newContainer = buildContainerEditor(params).insertAfter( $container );
		$newContainer.find(".slots-wrapper").replaceWith($container.find(".slots-wrapper"));
		$container.remove();
	}
	function saveContainer($editContainer){
		var style = $editContainer.find(".f-c-style").val();
		if( style == "") style = null;
		templateParams = {
					id:$editContainer.data("id"), 
					title: $editContainer.find("#f-c-title").val(),
					titleurl: $editContainer.find("#f-c-titleurl").val(),
					type: $editContainer.data("type"),
					prolog: $editContainer.find("#f-c-prolog").val(),
					epilog: $editContainer.find("#f-c-epilog").val(),
					readmore: $editContainer.find("#f-c-readmore").val(),
					readmoreurl: $editContainer.find("#f-c-readmoreurl").val(),
					style: style
				};
		params =[ID, templateParams.id,{
			style: templateParams.style,
			title: templateParams.title,
			titleurl: templateParams.titleurl,
			readmore: templateParams.readmore,
			readmoreurl: templateParams.readmoreurl,
			prolog: templateParams.prolog,
			epilog: templateParams.epilog,
			style: style
			}];
		sendAjax("updateContainer",params,
		function(data){
			if(data.result == true){
				$newContainer = buildContainer( templateParams ).insertAfter( $editContainer );
				$newContainer.find(".slots-wrapper").replaceWith($editContainer.find(".slots-wrapper"));
				$editContainer.remove();
			} else {
				alert("Konnte die Änderungen nicht speichern.");
			}
		});
	}
	function revertContainerChanges($container){
		$oldContainer =	buildContainer(revert_data );
		$oldContainer.find(".slots-wrapper").replaceWith($container.find(".slots-wrapper"));
		$container.after($oldContainer);
		$container.remove();
	}
	function buildContainer(templateParams){
		return $.tmpl( "containerTemplate", templateParams );
	}
	function buildContainerEditor(templateParams){
		return $.tmpl( "containerEditorTemplate", templateParams );
	}
	// ---------------------
	// slot funktionen
	// ----------------------
	function buildSlot(templateParams){
		return $.tmpl( "slotTemplate", templateParams );
	}
	
	// --------------------
	// Box Funktionen
	// -------------------
	function showBoxTools(){
		sendAjax("searchBox",[""],function(data){
			console.log(data);
			$toolBoxList.empty();
			$.each(data.result,function(index, value){
				console.log(value);
				$toolBoxList.append(buildBoxDraggable({id: value.id, title: value.title}));
			});
			$gridTools.children().hide();
			$toolBox.show();
			refreshBoxDraggables();
		});
	}
	function refreshBoxSortable(){
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
	}
	function refreshBoxDraggables(){
		console.log("refresh Dragger");
		$(".box-dragger").draggable({ 
			helper: "clone", 
			zIndex: 199, 
			//connectToSortable: GRID_SORTABLE,
			start: function(event, ui){
				$slots = $grid.find(".slot");
				$slots.children(".box").before("<div class='"+BOX_DROP_AREA_CLASS+"'>Drop Box</div>");
				$slots.append("<div class='"+BOX_DROP_AREA_CLASS+"'>Drop Box</div>");
				$slots.children(CSS_BOX_DROP_AREA_CLASS).droppable({ 
					accept: ".box-dragger",
					hoverClass: "hover",
					drop: function( event, ui ) {
						$this_box = $(ui.draggable);
						$this_drop = $(this);
						$this_slot = $this_drop.parents(".slot");
						$this_container = $this_slot.parents(".container");
						$temp = buildBox( 
								[{ 	id : $this_box.data("id"), content: $this_box.text() }] )
								.insertBefore( $this_drop );
						$slots.find(CSS_BOX_DROP_AREA_CLASS).remove();
						
						params = [ID, $this_container.data("id"),$this_slot.data("id"),$this_box.data("id"), $temp.index()];
						console.log(params);
						sendAjax("addBox",params,
						function(data){
							if(data.result == false){
								alert("Konnte die Box nicht hinzufügen");
								$this_box.remove();
							}
						});
					}
				});
			},
			stop: function( event, ui ){
				$grid.find(CSS_BOX_DROP_AREA_CLASS).remove();
			}
		});
	}
	function buildBox(templateParams){
		return $.tmpl( "boxTemplate", templateParams );
	}
	function buildBoxDraggable(templateParams){
		return $.tmpl( "boxDraggableTemplate", templateParams );
	}
	
	// --------------------
	// GUI manipulation
	// -------------------
	var box_toggling = false;
	function toggleBoxes(){
		if(box_toggling) return;
		toggling = true;
		$(".c-edit, .c-ok, .c-revert").toggle();
		$(".box, .c-before, .c-after").slideToggle(200,function(){
			box_toggling = false;
		});
	}
	// --------------------
	// Serverkommunikation
	// -------------------
	var SERVER = "http://emma-dev.ia-code.ws/grid/core/index.php?path=/ajax";
	function sendAjax(method, params_array, success, error){
		json = {};
		json["method"] = method;
		json["params"] = params_array;
		if(error == null){
			error = function(jqXHR, textStatus, error){
				console.log(jqXHR);
				console.log(textStatus);
				console.log(error);
			};
		}
		$.ajax({
		   url: SERVER,
		   dataType:"json",
		   type:'POST',
		   data: JSON.stringify(json),
		   success: success,
		   error: error
		 });
	}
});


