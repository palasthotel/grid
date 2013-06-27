(function($){
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
	
	var $body = $("body");
	var $grid_wrapper = $("#grid-wrapper");
	var $grid = $grid_wrapper.find("#grid");
	var $box_editor = $grid_wrapper.find("#box-editor");
	var $toolbar = $grid_wrapper.find("#toolbar");
	var $gridTools = $grid_wrapper.find(".grid-tools");
	var $toolContainer = $gridTools.children(".g-container");
	var $toolBox = $gridTools.children(".g-box");
	var $toolBoxTypeTabs = $toolBox.children(".box-type-tabs");
	var $search_bar = $toolBox.find(".search-bar");
	var $search_box = $toolBox.find("input");
	
	var $toolBoxList = $gridTools.find(".g-box .box-list");
	var top = 0;
	
	// ----------------
	// init Methode
	// ---------------
	var ID = document.ID;
	function init() {
		// ID = 42;
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
			resizeGridTools();
		});
	}
	$(document).ready(init);
	// --------------------
	// values to load before grid
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
					$temp_li = $("<li>"+index+"</li>").attr("data-index",index).attr("title", value.title).attr("data-type", value.type);
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
	// load, revert, publish grid
	// -------------------
	function loadGrid(){
		sendAjax(
			"loadGrid", 
			[ID],
			function(data){
				console.log(data);
				fillGrid(data.result);
				$.each($(".slot .style-changer"), function(index, style_changer){
					refreshSlotStyles($(style_changer));
				});
			}
		);
	}
	function fillGrid(result){
		$grid.empty();
		changeIsDraftDisplay(result.isDraft);
		var container_arr = result.container;
		buildContainer(container_arr).appendTo($grid);
		console.log(container_arr);
		refreshBoxSortable();
	}
	function publishGrid(){
		sendAjax(
			"publishDraft", 
			[ID],
			function(data){
				console.log(data);
				if( data.result != true){
					alert("could not publish...");
				}
			}
		);
	}
	function revertGrid(){
		if(!confirm("Alle Änderungen werden verworfen und zum letzten veröffentlichten Stand zurückgesetzt. Fortsetzen?")){
			return;
		}
		sendAjax(
			"revertDraft", 
			[ID],
			function(data){
				console.log(data);
				if(data.result != false && data.result != null){
					$grid.empty();
					fillGrid(data.result);
				} else {
					alert("Could not revert grid...");
				}
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
			case "publish":
				publishGrid();
				break;
			case "preview":
				window.open(window.location.pathname+'/preview',"_blank");
				break;
			case "revert":
				revertGrid();
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
			searchBoxes("");
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
	$grid.sortable({
		handle: ".c-sort-handle",
		//axis: "y",
		//cursor: "row-resize",
		items:".container",
		placeholder: "c-sort-placeholder",
		helper: function(event, element){
				return $("<div class='c-sort-helper'></div>");
		},
		cursorAt: { left: 30, top:30 },
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
	$(".container-dragger").draggable({ 
		helper: function(event, element){
			return $("<div class='dragger-helper'></div>");
		},
		cursorAt: { left: 30, top:30 },
		zIndex: 99,
		appendTo: $("#grid-wrapper"),
		scroll: true,
		start: function(event, ui){
			$grid.children().before($(document.createElement("div")).addClass("container-drop-area-wrapper"));
			$grid.append($(document.createElement("div")).addClass("container-drop-area-wrapper"));
			$grid.find(".container-drop-area-wrapper").append($(document.createElement("div")).addClass("container-drop-area"));

			$grid.find(".container-drop-area").droppable({ 
				accept: ".new-container",
				hoverClass: "hover",
				drop: function( event, ui ) {
					containerType =  $(ui.draggable).data("type");
					$temp = buildContainer( 
							[{ 	"type": containerType, 
								"id" : "new",
								"prolog": "",
								"epilog": "" }] )
							.insertBefore( $(this).parent() );
					
					$grid.children().remove(".container-drop-area-wrapper");
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
			$grid.children().remove(".container-drop-area-wrapper");
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
		$newContainer.find(".box").hide();
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
				$newContainer.find(".box").show();
				$editContainer.remove();
			} else {
				alert("Konnte die Änderungen nicht speichern.");
			}
		});
	}
	function revertContainerChanges($container){
		$oldContainer =	buildContainer(revert_data );
		$oldContainer.find(".slots-wrapper").replaceWith($container.find(".slots-wrapper"));
		$oldContainer.find(".box").show();
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
			cancel: "span.edit",
			connectWith: ".boxes-wrapper, .c-box-trash",
			placeholder: "b-sort-placeholder",
			forcePlaceholderSize: true,
			distance: 10,
			helper: function(event, element){
				return $("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			start: function(e, ui){
				//$(".boxes-wrapper").addClass("min-height");
				//ui.placeholder.height(ui.item.height());
				old_box_index = ui.item.index();
				old_slot_id = ui.item.parents(".slot").data("id");
				old_container_id = ui.item.parents(".container").data("id");
				refreshBoxTrashs();
			},
			stop: function(e, ui){
				console.log("STOP sort");
				//$(".boxes-wrapper").removeClass("min-height");
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
			}
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
			helper: function(event, element){
				return $("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			zIndex: 199,
			appendTo: $grid,
			addClass: true,
			//connectToSortable: GRID_SORTABLE,
			start: function(event, ui){
				$slots = $grid.find(".slot .boxes-wrapper");
				// drop place template
				$slots.children(".box").before($( document.createElement('div'))
								.addClass("box-drop-area-wrapper"));
				$slots.append($( document.createElement('div'))
								.addClass("box-drop-area-wrapper"));
				$slots.find(".box-drop-area-wrapper").append($( document.createElement('div'))
								.addClass("box-drop-area"));

				$slots.find(".box-drop-area").droppable({ 
					accept: ".box-dragger",
					hoverClass: "hover",
					drop: function( event, ui ) {
						console.log("Box dropped on area.");
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
								}] ).insertBefore( $this_drop.parent() );
						$grid.find(".box-drop-area-wrapper").remove();
						params = [ID, $this_container.data("id"), $this_slot.data("id"), $temp.index(), box_obj.type, box_obj.content];
						sendAjax("createBox",params,
						function(data){
							$temp.attr("data-id",data.result.id);
							console.log(data);
						});
					}
				});
			},
			stop: function( event, ui ){
				$grid.find(".box-drop-area-wrapper").remove();
			}
		});
	}
	function buildBox(templateParams){
		return $.tmpl( "boxTemplate", templateParams );
	}
	
	// Box Editor
	var $box_editor_content = $box_editor.children(".content");
	$box_editor.on("click",".controls button",function(){
		$this = $(this);
		switch ($this.attr("role")){
			case "cancle":
				showGrid($box_editor_content.children().data("id"));
				break;
			case "save":
				updateBox();
				break;
		}
	});
	
	function updateBox(){
		$data = $box_editor_content.find(".box-editor");
		style = $data.find("[name=f-b-style]").val();
		if(style == "") style = null;
		// make content array
		content = {};
		$.each($data.find(".dynamic-value"),function(index,element){
			$element = $(element);
			if($element.hasClass("form-checkbox")){
				if($element.prop("checked")){
					content[$element.data("key")] = 1;
				} else {
					content[$element.data("key")] = 0;
				}
			} else {
				content[$element.data("key")] = $element.val();
			}
		});
		box_content = {
				id: $data.data("id"),
				type: $data.data("type"),
				title: $data.find("input[name=f-b-title]").val(),
				titleurl: $data.find("input[name=f-b-titleurl]").val(),
				prolog: $data.find("[name=f-b-prolog]").val(),
				epilog: $data.find("[name=f-b-epilog]").val(),
				readmore: $data.find("input[name=f-b-readmore]").val(),
				readmoreurl: $data.find("input[name=f-b-readmoreurl]").val(),
				style: style,
				content: content
			};
		sendAjax(
			"UpdateBox",
			[ID, $data.data("c-id"), $data.data("s-id"), $data.data("b-index"), box_content],
			function(data){
				console.log(data);
				$grid.find(".box[data-id="+$data.data("id")+"]").replaceWith(buildBox(data.result));
				showGrid($data.data("id"));
			});
	}
	
	$grid.on("click", ".box > .edit",function(data){
		$this = $(this);
		c_id = $this.parents(".container").data("id");
		s_id = $this.parents(".slot").data("id");
		b_index = $this.parents(".box").index();
		console.log("edit!");
		showBoxEditor();
		sendAjax(
			"fetchBox",
			[ID,c_id,s_id,b_index],
			function(data){
				console.log(data);
				result = data.result;
				params = {
					"box":result,
					"b_index":b_index,
					"s_id":s_id,
					"c_id":c_id,
					"styles": arr_box_styles
				};
				$box_editor_content.append(buildBoxEditor(params));
				$dynamic_fields = $box_editor_content.find(".dynamic-fields .field-wrapper");
				$.each(result.contentstructure,function(index,element){						
					switch(element.type){
						case "html":
							$dynamic_fields.append("<label>"+element.key+"</label>");
							$dynamic_fields.append(
								"<textarea class='dynamic-value form-textarea' "+
								"data-key='"+element.key+"' name='key-"+index+"'>"+
								result.content[element.key]+
								"</textarea>");
							break;
						case "number":
							$dynamic_fields.append("<label>"+element.key+"</label>");
							$dynamic_fields.append(
								"<input type='number' class='dynamic-value form-text' "+
								"data-key='"+element.key+"' value='"+result.content[element.key]+"' />");
							break;
						case "text":
							$dynamic_fields.append("<label>"+element.key+"</label>");
							$dynamic_fields.append(
								"<input type='text' class='dynamic-value form-text' "+
								"data-key='"+element.key+"' value='"+result.content[element.key]+"' />");
							break;
						case "select":
							$dynamic_fields.append("<label>"+element.key+"</label>");
							$select = $("<select class='dynamic-value form-select' "+
								"data-key='"+element.key+"'></select>");
							$.each(result.contentstructure[index].selections,function(i,sel){
								selected = "";
								if(result.content[element.key] == sel.key) selected = "selected='selected' ";
								$select.append("<option "+selected+"value='"+sel.key+"'>"+sel.text+"</option");
							});
							$dynamic_fields.append($select);
							break;
						case "hidden":
							$dynamic_fields.append(
								"<input type='hidden' class='dynamic-value' "+
								"data-key='"+element.key+"' value='"+result.content[element.key]+"' />");
							break;
						case "checkbox":
							checked = "";
							if(result.content[element.key] == 1){
								checked = "checked='checked'";
							}
							$dynamic_fields.append("<div class='form-item'><input type='checkbox' "+checked+" class='dynamic-value form-checkbox' "+
								"data-key='"+element.key+"' value='1' /> <label class='option'>"+element.info+"</label></div>");
							break;
						default:
							console.log("unbekannter typ: "+element.type);
					}
				});
			});
	});
	function buildBoxEditor(templateParams){
		return $.tmpl( "boxEditorTemplate", templateParams );
	}
	
	// --------------------
	// GUI manipulation
	// -------------------
	function showGrid(box_id){
		if(box_id == null || typeof box_id == 'undefined'){
			box_id = null;
		}
		console.log("scroll to box: "+box_id);
		$box_editor.animate({
			width:0
		},220,
		function(){
			$box_editor.hide();
			$box_editor_content.empty();
		});
		setTimeout(function(){
			$grid.show();
			$grid.animate({width:"100%"},200);
			$toolbar.slideDown(200,function(){
				console.log("scrollto");
				if(box_id == null) return;
				$('html, body').animate({
					 scrollTop: ($(".box[data-id="+box_id+"]").offset().top-120)
				 }, 200);
			});
		},50);
	}
	function showBoxEditor(){
		hideBoxTools();
		$box_editor_content.empty();
		$toolbar.slideUp(200);
		$grid.animate(
			{	
				width:0
			},
			220,
			function(){
				$grid.hide();			
		});
		setTimeout(function(){
			$box_editor.show();
			$box_editor.animate({width:"100%"},250);
		},50);
	}
	$box_editor_content.on("click","legend",function(ev){
		$(this).siblings(".field-wrapper").slideToggle(300);
	});
	function toggleBoxEditorField(){
	}
	function showBoxTrash(){
		$(".c-box-trash").show();
	}
	function hideBoxTrash(){
		$(".c-box-trash").hide();
	}
	function toggleContainerTools(){
		if($toolContainer.css("display") == "none"){
			$gridTools.children().hide();
		$toolContainer.show();
		} else {
			$toolContainer.hide();
		}
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
		console.log($grid.find(".container.editor").size());
		if($grid.find(".container.editor").length > 0){
			alert("Bitte zuerst den Container fertig bearbeiten.");
			return;
		}
		if(box_toggling) return;
		toggling = true;
		$(".c-edit, .c-ok, .c-revert").toggle();
		$(".box, .c-before, .c-after").slideToggle(200,function(){
			box_toggling = false;
		});
	}
	$btn_publish = $toolbar.find("button[role=publish]");
	$btn_revert = $toolbar.find("button[role=revert]");
	function changeIsDraftDisplay(isDraft){
		if(isDraft == true){
			$stateDisplay.text("Entwurf...");
			$btn_publish.removeAttr("disabled");
			$btn_revert.removeAttr("disabled");
		} else {
			$stateDisplay.text("Veröffentlicht!");
			$btn_publish.attr("disabled","disabled");
			$btn_revert.attr("disabled","disabled");
		}
	}
	
	$(window).resize(function(e){
		resizeGridTools();
	});
	function resizeGridTools(){
		var tool_height = $(window).height();
		if(!$body.hasClass("fixed")){
			tool_height = tool_height - $grid_wrapper.offset().top + $(window).scrollTop();
		}
		$gridTools.css("height",tool_height);
		$toolBoxList.css("height", $gridTools.outerHeight()- 110);
		console.log();
	}
	resizeGridTools();

	// --------------------
	// Serverkommunikation
	// -------------------
	var SERVER = "/grid_ajax_endpoint"; 
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
		   success: function(data){
			   success(data);
			   isDraft();
			},
		   error: error,
		   async:async
		 });
	}
	function isDraft(){
		json = {};
		json["method"] = "checkDraftStatus";
		json["params"] = [ID];
		$.ajax({
		   url: SERVER,
		   dataType:"json",
		   type:'POST',
		   data: JSON.stringify(json),
		   success: function(data){
			   changeIsDraftDisplay(data.result);
			},
		   error: function(jqXHR, textStatus, error){
				console.log(jqXHR);
				console.log(textStatus);
				console.log(error);
			}
		 });
	}
});})(jQuery);


