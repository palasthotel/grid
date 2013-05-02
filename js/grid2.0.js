
$(function() {
	// Warnung beim verlassen ohne Speichern
	/*
	var saved = true;
	window.onbeforeunload = function(){
		if(!saved) return "Es wurden noch nicht alle Änderungen gespeichert!";
	}
	*/
	
	// ---------------------------
	// Allgemeine Elemente und konstanten
	// --------------------------
	var arr_box_types, arr_box_search_results;
	var arr_container_styles = [], arr_slot_styles = [], arr_box_styles = [];
	var $slot_styles;
	var $stateDisplay = $(".state-display");
	var CSS_GRID_ID = "#grid";
	var $grid = $(CSS_GRID_ID);
	
	var CONTAINER_DROP_AREA_CLASS = "container-drop-area";
	var CSS_CONTAINER_DROP_AREA_CLASS = ".container-drop-area";
	
	var BOX_DROP_AREA_CLASS = "box-drop-area";
	var CSS_BOX_DROP_AREA_CLASS = ".box-drop-area";
	
	var $body = $("body");
	var $toolbar = $("#toolbar");
	var $gridTools = $(".grid-tools");
	var $toolContainer = $gridTools.children(".g-container");
	var $toolBox = $gridTools.children(".g-box");
	var $toolBoxTypeTabs = $toolBox.children(".box-type-tabs");
	var $search_bar = $toolBox.find(".search-bar");
	var $search_box = $toolBox.find("input");
	
	var $toolBoxList = $(".g-box .box-list");
	var top = 0;
	
	// ----------------
	// init Methode
	// ---------------
	var ID;
	var initFunctionStack = [];
	function init() {
		ID = 42;
		console.log("lade BoxTypes");
		loadBoxTypes();
		console.log("lade Styles");
		loadStyles();
		console.log("lade Grid");
		loadGrid();
		// scrollable toolbar
		top = $toolbar.offset().top;
		$(window).scroll(function() {
			if( $(this).scrollTop() > (top) ) {
				$grid.css("margin-top",$toolbar.height());
			  	$body.addClass('fixed');
			} else {
				$grid.css("margin-top",0);
			  	$body.removeClass('fixed');
			}
		});
	}
	$(document).ready(init);
	// --------------------
	// Werte die vor dem Grid geladen werden müssen
	// --------------------
	function loadBoxTypes(){
		sendAjax(
			"getMetaTypesAndSearchCriteria",
			[],
			function(data){
				arr_box_types = data.result;
				console.log("box types geladen");
				console.log(arr_box_types);
				$toolBoxTypeTabs.empty();
				$.each(arr_box_types,function(index,value){
					$temp_li = $("<li>"+value.title+"</li>").attr("data-index",index).addClass("test");
					$toolBoxTypeTabs.append($temp_li);
				});
			},null,false);
	}
	function loadStyles(){
		sendAjax(
			"getContainerStyles",
			[],
			function(data){
				arr_container_styles = data.result;
				console.log("container styles geladen");
				console.log(arr_container_styles);
			},null,false);
		sendAjax(
			"getSlotStyles",
			[],
			function(data){
				arr_slot_styles = data.result;
				console.log("slot styles geladen");
				console.log(arr_slot_styles);
				$slot_styles = $("<ul class='choose-style'></div>");
				$slot_styles.append("<li class='slot-style' data-style=''>ohne Style</li>");
				$.each(arr_slot_styles, function(index,value){
					$slot_styles.append("<li class='slot-style' data-style='"+value.slug+"'>"+value.title+"</li>");
				});
			},null,false);
		sendAjax(
			"getBoxStyles",
			[],
			function(data){
				arr_box_styles = data.result;
				console.log("Box styles geladen");
				console.log(arr_box_styles);
			},null,false);
	}
	
	
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
				refreshBoxSortable();
				$.each($(".slot .style-changer"), function(index, style_changer){
					refreshSlotStyles($(style_changer));
				});
			}
		);
	}
	
	
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
				break;
			case "add_container":
				toggleContainerTools();
				break;
			case "add_box":
				if($toolBoxTypeTabs.children(".active").length < 1){
					$toolBoxTypeTabs.children().first().addClass("active");
				}
				buildBoxTypeInterface();
				toggleBoxTools();
				break;
			case "hide_boxes":
				toggleBoxes();
				break;
			default:
				console.log("Role unbekannt: "+$this.attr("role"));
				break;
		}
	});
	// ------------------------------
	// Box Tools
	// -----------------------------
	var searchTimeout;
	var $loading_boxes = $(".g-box .loading");
	var active_box_type = null;
	$toolBoxTypeTabs.on("click","li:not(.active)",function(e){
		clearTimeout(searchTimeout);
		$loading_boxes.hide();
		$toolBoxTypeTabs.children().removeClass("active");
		$(this).addClass("active");
		buildBoxTypeInterface();
	});
	function buildBoxTypeInterface(){
		active_box_type = arr_box_types[$toolBoxTypeTabs.children(".active").data("index")];
		if(active_box_type.criteria.length > 0){
			$search_bar.show();
			console.log("suchen bitte");
		} else {
			$search_bar.hide();
			searchBoxes();
		}
		arr_box_search_results = [];
		$toolBoxList.empty();
	}
	$search_box.on("keyup",function(e){
		searchBoxes($(this).val());
	});
	function searchBoxes(searchString){
		$loading_boxes.show();
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(function(){
			sendAjax("Search",[active_box_type.type,searchString,active_box_type.criteria] ,function(data){
					console.log("Search Results:");
					$toolBoxList.empty();
					arr_box_search_results = data.result;
					$.each(data.result,function(index, value){
						console.log(value);
						$toolBoxList.append(buildBoxDraggable(
							{	
								id: value.id, title: value.title, titleurl:value.titleurl, 
								prolog: value.prolog, html: value.html, epilog: value.epilog,
								readmore: value.readmore, readmoreurl: value.readmoreurl, type: value.type, index: index
							}
						));
					});
					refreshBoxDraggables();
					$loading_boxes.hide();
				});
		},500);
	}
	function buildBoxDraggable(templateParams){
		return $.tmpl( "boxDraggableTemplate", templateParams );
	}
	// ----------------------------
	// container funktionen
	// --------------------------
	function toggleContainerTools(){
		if($toolContainer.css("display") == "none"){
			$gridTools.children().hide();
		$toolContainer.show();
		} else {
			$toolContainer.hide();
		}
	}
	
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
		scroll: true,
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
						refreshBoxSortable();
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
				if($grid.children(".editor").length > 0){
					alert("Ein anderer Container wird momentan bearbeitet!");
					return;
				}
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
					readmoreurl: $container.find(".c-readmoreurl").text(),
					style: $container.data("style"),
					styles: arr_container_styles
				};
				console.log(params);
		revert_data = {};
		revert_data = params;
		$newContainer = buildContainerEditor(params).insertAfter( $container );
		$newContainer.find(".slots-wrapper").replaceWith($container.find(".slots-wrapper"));
		$container.remove();
	}
	function saveContainer($editContainer){
		var style = $editContainer.find("#f-c-style").val();
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
	$grid.on("mouseover",".slot > .style-changer",function(e){
		refreshSlotStyles($(this))
	});
	function refreshSlotStyles($style_changer){
		style = $style_changer.parents(".slot").data("style");
		$ul_styles = $style_changer.children(".choose-style");
		if($ul_styles.length == 0 ){
			$ul_styles = $slot_styles.clone();
			$style_changer.append($ul_styles);
		}
		$ul_styles.children().show();
		$active_child = $ul_styles.children("[data-style="+style+"]").hide();
		if(style == ""){
			$style_changer.children("span").text("ohne Style");
		} else {
			$style_changer.children("span").text($active_child.text());
		}
	}
	$grid.delegate("li.slot-style","click",function(e){
		$this = $(this);
		style = $this.data("style");
		$container = $this.parents(".container");
		$slot = $this.parents(".slot");
		$style_changer = $this.parents(".style-changer");
		// commit changes
		params =[ID,$container.data("id"),$slot.data("id"),style];
		sendAjax("updateSlotStyle",params,
		function(data){
			if(data.result == true){
				$slot.data("style", $this.data("style"));
				refreshSlotStyles($style_changer);
				
			} else {
				alert("Konnte Slotstyle nicht änderns.");
			}
		});
	});
	
	function buildSlot(templateParams){
		return $.tmpl( "slotTemplate", templateParams );
	}
	// --------------------
	// Box Funktionen
	// -------------------
	
	var old_slot_id, old_container_id, old_box_index;
	function refreshBoxSortable(){
		$(".boxes-wrapper").sortable({
			items: ".box",
			connectWith: ".boxes-wrapper, .c-box-trash",
			placeholder: "b-sort-placeholder",
			forcePlaceholderSize: true,
			helper: function(event, element){
				return $("<div class='b-sort-helper'></div>");
			},
			start: function(e, ui){
				$(".boxes-wrapper").addClass("min-height");
				ui.placeholder.height(ui.item.height());
				old_box_index = ui.item.index();
				old_slot_id = ui.item.parents(".slot").data("id");
				old_container_id = ui.item.parents(".container").data("id");
				refreshBoxTrashs();
			},
			stop: function(e, ui){
				console.log("STOP sort");
				$(".boxes-wrapper").removeClass("min-height");
				hideBoxTrash();
				if(boxDeleted){
					boxDeleted = false;
					console.log("trash!!!!");
					return;
				}
				sendAjax(
					"moveBox",
					[
						ID,
						old_container_id,old_slot_id,old_box_index,
						ui.item.parents(".container").data("id"),ui.item.parents(".slot").data("id"),ui.item.index()
					],
					function(data){
						if(data.result != true){
							// TODO: Rückmeldung geben und Box zurück sortieren!!!
							console.log(data);
							console.log("Rückmeldung geben und Box zurück sortieren!!!");
						}
				});
			},
			cursorAt: { left: 30, top:30 }
		});
	}
	var boxDeleted = false;
	function refreshBoxTrashs(){
		showBoxTrash();
		$(".c-box-trash").droppable({
			accept: ".slot .box",
			hoverClass: "ui-state-hover",
			drop: function(e, ui) {
				console.log("dropped in trash");
				boxDeleted = true;
				sendAjax("removeBox",[ID,old_container_id,old_slot_id,old_box_index],
				function(data){
					if(data.result == false){
						alert("Konnte die Box nicht entfernen");
						return;
					}
					ui.draggable.remove();
					hideBoxTrash();
				});
			}
		});
	}
	function refreshBoxDraggables(){
		$(".box-dragger").draggable({ 
			helper: "clone", 
			zIndex: 199,
			appendTo: $grid,
			addClass: true,
			//connectToSortable: GRID_SORTABLE,
			start: function(event, ui){
				$slots = $grid.find(".slot .boxes-wrapper");
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
						box_obj = arr_box_search_results[$this_box.data("index")];
						
						$temp = buildBox( 
								[{ 	
									id : box_obj.id, 
									title: box_obj.title, 
									titleurl: box_obj.titleurl,
									prolog: box_obj.prolog,
									html: box_obj.html,
									epilog: box_obj.epilog,
									readmore: box_obj.readmore,
									readmoreurl: box_obj.readmoreurl,
									type: box_obj.type
								}] ).insertBefore( $this_drop );
						$slots.find(CSS_BOX_DROP_AREA_CLASS).remove();
						params = [ID, $this_container.data("id"),$this_slot.data("id"),$temp.index(),box_obj.type,box_obj.content];
						sendAjax("createBox",params,
						function(data){
							$temp.data("id",data.result.id);
							console.log(data);
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
	
	// --------------------
	// GUI manipulation
	// -------------------
	function showBoxTrash(){
		$(".c-box-trash").show();
	}
	function hideBoxTrash(){
		$(".c-box-trash").hide();
	}
	function toggleBoxTools(){
		if($toolBox.css("display") == "none"){
			showBoxTools();
		} else {
			hideBoxTools();
		}
	}
	function hideBoxTools(){
		$toolBox.hide();
	}
	function showBoxTools(){
		$gridTools.children().hide();
		$toolBox.show();
	}
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
	var SERVER = "../core/index.php?path=/ajax"; 
	function sendAjax(method, params_array, success, error, async){
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
		if(async != false){
			async = true;
		}
		$.ajax({
		   url: SERVER,
		   dataType:"json",
		   type:'POST',
		   data: JSON.stringify(json),
		   success: success,
		   error: error,
		   async:async
		 });
	}
});


