/**
*	IE JS console fix
*/
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
*	Grid controller.
*	@autor Edward Bock
*/
(function($){
$(function() {

	/** --------------------------------
	DEBUGGING enable = true or disable = false
	** -------------------------------**/
	DEBUGGING = false;
	DEBUGGING = document.grid_debug_mode;

	/** --------------------------------
	* generel elements and variables
	---------------------------------- */
	
	var arr_container_style_titles = Array();
	var $slot_styles;
	var $stateDisplay = $(".state-display");
	
	var $body = $("body");
	var $grid_wrapper = $("#grid-wrapper");
	var $grid = $grid_wrapper.find("#grid");
	var $box_editor = $grid_wrapper.find("#box-editor");
	var $toolbar = $grid_wrapper.find("#grid-toolbar");
	var $gridTools = $grid_wrapper.find(".grid-tools");
	var $toolContainer = $gridTools.children(".g-container");
	var $toolContainerTypeTabs = $toolContainer.find(".container-type-tabs");
	var $containerTypeChooser = $toolContainer.find(".container-type-chooser");
	var $toolReusableElements = $toolContainer.find(".reusable-elements");
	var $toolContainerElementLists = $toolContainer.find(".element-list");
	var $toolBox = $gridTools.children(".g-box");
	var $toolBoxTypeTabs = $toolBox.children(".box-type-tabs");
	var $search_bar = $toolBox.find(".search-bar");
	var $search_box = $toolBox.find("input");
	
	var $toolBoxList = $gridTools.find(".g-box .box-list");
	
	/** --------------------------
	*	Grid gets initiated
	------------------------------ */
	// Fallback for drupal
	var SERVER = "/grid_ajax_endpoint";
	if( typeof document.gridajax != "undefined" && 
		document.gridajax != null && 
		document.gridajax != ""){
		SERVER = document.gridajax;
	}
	console.log("SERVER:"+SERVER);

	// fallback for drupal
	var PREVIEW_URL = window.location.pathname+'/preview';
	PREVIEW_URL = PREVIEW_URL.replace("//","/");
	if( typeof document.previewurl != "undefined" && 
		document.previewurl != null && 
		document.previewurl != ""){
		PREVIEW_URL = document.previewurl;
	}
	console.log("PREVIEW_URL:"+PREVIEW_URL);

	// fallback for drupal
	var PREVIEW_PATTERN = window.location.pathname+'/{REV}/preview';
	if( typeof document.previewpattern != "undefined" && 
		document.previewpattern != null && 
		document.previewpattern != ""){
		PREVIEW_PATTERN = document.previewpattern;
	}
	console.log("PREVIEW_PATTERN: "+PREVIEW_PATTERN);

	// grid ID
	var ID = document.ID;
	// grid, container, box
	var GRIDMODE = document.gridmode;
	// gets changed in loadGrid if is sidebar
	var IS_SIDEBAR = false;
	var CKEDITOR_config_path = document.PathToConfig;
	function init() {
		console.log("Grid ID: "+ID);
		console.log("Grid MODE: "+GRIDMODE);
		console.log("detect browser");
		browsercheck();
		console.log("Set interface language");
		setInterfaceLanguage();
		console.log("load container types");
		loadContainerTypes();
		console.log("load box types");
		loadBoxTypes();
		console.log("load styles");
		loadStyles();
		console.log("load grid");
		loadGrid();
		console.log("load revisions");
		loadRevisions();
		$grid_wrapper.attr("data-mode",GRIDMODE);
		// scrollable toolbar
		$(window).scroll(needFixedToolbar);
		// hide WP admin sidebar
		initWP();
		
	}
	$(document).ready(init);
	/** WP specific init **/
	function initWP(){
		console.log("WP INIT--------");
		var $admin_wrap = $("#adminmenuwrap");
		if($admin_wrap.width() < 40) return;
		var $btn = $("#collapse-button").trigger("click");
		var $hint =  $("<div class='fixed-hint'>"+lang_values["info-wp-hide-adminbar"]+"</div>");
		$hint.css("top", ($btn.offset().top+25) );
		$hint.css("left", $btn.offset().left);
		$body.append($hint);
		var removeHint = setTimeout(function(){
			$hint.fadeOut(1000,function(){
				$hint.remove();
			});
		},6000);
		$hint.click(function(event) {
			$hint.remove();
			clearTimeout(removeHint);
		});
	}

	/** ------------------------------
	** Checks whitelist of browsers
	* -------------------------------- */
	var browser_whitelist ;
	function browsercheck(){
		console.log($.browser);
	}
	/** --------------------------------
	*	load available box types
	*
	*	@array arr_box_types
	*
	------------------------------------ */
	var arr_box_types = [], arr_box_search_results;
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
					$temp_li = $("<li></li>").attr("data-index",index).attr("title", value.title).attr("data-type", value.type);
					$toolBoxTypeTabs.append($temp_li);
				});
			},null,false);
	}
	/** --------------------------------
	*	values to load before grid
	*
	*	@array arr_container_styles
	*	@array arr_slot_styles
	*	@array arr_box_styles
	*
	------------------------------------ */
	var arr_container_styles = [], arr_slot_styles = [], arr_box_styles = [];
	function loadStyles(){
		sendAjax(
			"getContainerStyles",
			[],
			function(data){
				arr_container_styles = data.result;
				$.each(arr_container_styles,function(index, s){
					arr_container_style_titles[s["slug"]] = s["title"];
				});
				console.log("container styles loaded");
				console.log(arr_container_styles);
				console.log(arr_container_style_titles);
			},null,false);
		sendAjax(
			"getSlotStyles",
			[],
			function(data){
				arr_slot_styles = data.result;
				console.log("slot styles loaded");
				console.log(arr_slot_styles);
				$slot_styles = $("<ul class='choose-style'></div>");
				$slot_styles.append("<li class='slot-style' data-style=''>"+lang_values["default-style"]+"</li>");
				$.each(arr_slot_styles, function(index,value){
					$slot_styles.append("<li class='slot-style' data-style='"+value.slug+"'>"+value.title+"</li>");
				});
			},null,false);
		sendAjax(
			"getBoxStyles",
			[],
			function(data){
				arr_box_styles = data.result;
				console.log("Box styles loaded");
				console.log(arr_box_styles);
			},null,false);
	}
	/** --------------------------------
	*	load the grid from database
	*
	------------------------------------ */
	function loadGrid(){
		console.log("Grid_id: "+ID+" document:"+document.ID);
		sendAjax(
			"loadGrid", 
			[ID],
			function(data){
				console.log(data);
				IS_SIDEBAR = data.result.isSidebar;
				if(IS_SIDEBAR) $grid.addClass('sidebar-grid');
				fillGrid(data.result);
				if(data.result.isSidebar == true){
					console.log("is Sidebar");
					$(".hide-from-sidebar").remove();
				}
				$.each($(".container[data-reused=false] .slot .style-changer"), function(index, style_changer){
					refreshSlotStyles($(style_changer));
				});
				doAfterImageLoad(function(){
					$grid.trigger('structureChange');
				});
				// to fix source map issue
				setTimeout(function(){
					$grid.trigger('structureChange');
					console.log("GO!");
				}, 1500);
			}
		);
	}
	/** -------------------------------
	*	Language support
	*
	*	elements need lang-id for identifier
	*	if element has lang-dynamic=true the text will be set in another function by dynamic values
	*/
	var lang_values = null;
	function setInterfaceLanguage(){
		// TODO: ajax for values
		lang_values = document.lang_values;
		// texts
		$.each($("[lang-type=text]"), function(index, val) {
			var $element = $(val);
			$element.text(lang_values[$element.attr("lang-id")]);
		});
		// placeholder
		$.each($("[lang-type=placeholder]"), function(index, val) {
			var $element = $(val);
			$element.attr("placeholder", lang_values[$element.attr("lang-id")] );
		});
		// titles
		$.each($("[lang-type=title]"), function(index, val) {
			var $element = $(val);
			$element.attr("title", lang_values[$element.attr("lang-id")] );
		});
	}

	/** --------------------------------
	*	fills the grid with database information
	*
	*	@param result from loadGrid Request
	*
	------------------------------------ */
	function fillGrid(result){
		$grid.empty();
		changeIsDraftDisplay(result.isDraft);
		var container_arr = result.container;
		buildContainer(container_arr).appendTo($grid);
		console.log("fillGrid()-----------");
		console.log(container_arr);
		refreshBoxSortable();
		$grid.trigger("structureChange");
	}
	/**
	*	Changes status from draft to published.
	*/
	function publishGrid(){
		sendAjax(
			"publishDraft", 
			[ID],
			function(data){
				console.log(data);
				loadRevisions();
				if( data.result != true){
					throwError(lang_values["err_publish"]);
				}
			}
		);
	}
	
	/** ---------------------------------
	* Click handler for main toolbar
	 --------------------------------- */
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
				window.open(PREVIEW_URL, "_blank");
				break;
			case "revert":
				revertGrid();
				break;
			case "revisions":
				toggleRevisions();
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
			case "revision-preview":
				console.log("Preview an explecite Revision");
				revisionPreview($this);
				break;
			case "revision-use":
				console.log("Uses an old Revision as new draft.");
				revisionUse($this);
				break;
			default:
				console.log("Role unbekannt: "+$this.attr("role"));
				break;
		}
	});
	/* ------------------------------
	* Revision Tools
	* ------------------------------ */
	function revertGrid(){
		if(!confirm(lang_values["confirm-grid-revert"])) return;
		$grid.fadeOut('fast');
		sendAjax(
			"revertDraft", 
			[ID],
			function(data){
				console.log(data);
				$grid.show();
				if(data.result != false && data.result != null){
					$grid.empty();
					fillGrid(data.result);
					$grid.trigger("structureChange");
					loadRevisions();
				} else {
					throwError(lang_values["err_revert"]);
				}
			}
		);
	}
	var $revisions = $("#grid-revisions");
	var revisions = Array();
	function loadRevisions(){
		sendAjax(
			"getGridRevisions", 
			[ID],
			function(data){
				console.log("Revisions");
				console.log(data);
				revisions = data.result;
				$revisions.find("table").empty();
				if(revisions.length <= 0){
					console.log("hide Revision button");
					$toolbar.find('button[role=revisions]').hide();
				} else {
					$toolbar.find('button[role=revisions]').show();
					$.each(revisions, function(index, revision) {
						revision["readable_date"] = "--.--.----";
						if(typeof revision["date"] != "undefined" && revision["date"] != "" && revision["date"] != null){
							var date = new Date(parseInt(revision["date"])*1000);
							revision["readable_date"] = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
						}
						if(typeof revision["editor"] == "undefined" || revision["editor"] == "" || revision["editor"] == null){
							revision["editor"] = "unknown";
						}
					});
					$revisions.find("table").append($.tmpl( "revisionTableTemplate", revisions ));
					// clickhander from $toolbar !
				}
			}
		);		
	}
	function toggleRevisions(){
		if($revisions.css("display") == "none"){
			showRevisions();
		} else {
			hideRevisions();
		}
	}
	function showRevisions(){
		$revisions.show();
		$(document).on("mousedown",function(e){
			console.log("click");
		   if($(e.target).closest($revisions.parent()).length != 0) return;
		   hideRevisions();
		});
	}
	function hideRevisions(){
		$(document).off("mousedown");
		$revisions.hide();
	}

	function revisionPreview($revision){
		var revision = $revision.parents("tr").data("revision");
		console.log(revision);
		var location =  PREVIEW_PATTERN.replace("{REV}", revision);
		window.open(location,"_blank");
	}
	/*
	function revisionPreview($revision){
		var revision = $revision.parents("tr").data("revision");
		console.log("Revision number: "+revision);
		var location = window.location.pathname+'/'+revision+'/preview';
		window.open(location.replace("//","/"),"_blank");
		//http://grid-dev.palasthotel.de/node/17/grid/3/preview
	}*/
	function revisionUse($revision){
		$grid.fadeOut('fast');
		var revision = $revision.parents("tr").data("revision");
		console.log("Revision number: "+revision);
		sendAjax(
			"setToRevision",
			[ID, revision],
			function(data){
				console.log(data);
				fillGrid(data.result);
				$grid.show();
				loadRevisions();
				$body.trigger('structureChange');
			});
	}

	/* ------------------------------
	* Container Tools
	* ----------------------------- */
	var arr_container_types = [];
	function loadContainerTypes(){
		sendAjax(
			"getContainerTypes",
			[],
			function(data){
				arr_container_types = data.result;
				console.log("container types loaded:");
				console.log(arr_container_types);
				var $ul_list = $toolContainerTypeTabs.siblings("[ref=show-containers]");
				$.each(arr_container_types, function(index, type) {
					// hide all internal in general
					if( type.type.indexOf("I" )>-1) return true;
					// hide C and S from Sidebar-Grid
					if( ( type.type.indexOf("C-") == 0 || type.type.indexOf("S-") == 0 ) 
						&& IS_SIDEBAR) return true;
					// hide SidebarContainer from normal Grid
					if(type.type.indexOf("SC-") == 0 && !IS_SIDEBAR) return true;

					var $li = $("<li>")
								.addClass('container-dragger new-container clearfix')
								.addClass(type.type)
								.attr("data-type", type.type);
					for(i = 0; i < type.numslots; i++){
						$li.append("<div class='slot'>");
					}
					 $ul_list.append($li);
				});
				$sidebars = $ul_list.children('[data-type*=S]');
				if($sidebars.length > 0){
					$sidebars.hide();
				} else {
					$toolContainerTypeTabs.children('[role=show-containers][scope=sidebars]').hide();
				}
				reloadContainerDraggables($ul_list.children());
			},null,false);
	}

	$toolContainerTypeTabs.on("click","li:not(.active)",function(e){
		$toolContainerTypeTabs.children().removeClass("active");
		$this = $(this).addClass("active");
		$toolContainerTypeTabs.siblings().hide();
		var $target = $toolContainerTypeTabs.siblings("[ref="+$this.attr("role")+"]").show();
		$target.children().hide();
		switch($this.attr("scope")){
			case "containers":
				$target.children('[data-type*=C]').show();
				break;
			case "sidebars":
				$target.children('[data-type*=S]').show();
				break;
			case "reuse":
				loadReusableElements();
				$target.children().show();
				break;
			default:
				console.log("no such container type");
				break;
		}
	});
	function loadReusableElements(){
		$toolReusableElements.empty();
		var $c_t_loading = $toolContainer.find(".loading").show();
		$toolReusableElements.empty();
		sendAjax("getReusableContainers",[],function(data){
			console.log(data);
			$.each(data.result, function(index,e){
				$toolReusableElements.append(buildReuseContainer(e));
			});
			reloadContainerDraggables($toolReusableElements.children());
			$c_t_loading.hide();
		});
	}
	function buildReuseContainer(templateParams){
		return $.tmpl( "containerReusableTemplate", templateParams );
	}
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
		items:".container:not(.SC-4)",
		placeholder: "c-sort-placeholder",
		pullPlaceholder: true,
		appendTo: $grid_wrapper ,
		refreshPositions: true,
		helper: function(event, element){
				return $("<div class='c-sort-helper'></div>");
		},
		cursorAt: { left: 30, bottom: 30 },
		start: function( event, ui ){
			//$(".box").slideUp(100);
			//ui.placeholder.outerHeight(ui.outerHeight);
			$(this).sortable('refreshPositions');
			$grid_wrapper.find('.c-sort-placeholder').attr("data-type","c-sort-placeholder");
			offset_top = parseInt(ui.item.css("margin-top"));
			console.log(offset_top);
			console.log(ui.helper);
			//$(ui.helper).css("top", 30+offset_top);
			//$(ui.helper).css("margin-left", event.clientX - $(event.target).offset().left);
		},
		stop: function(event, ui){
			//$(".box").slideDown(100);
		},
		update: function( event, ui ){
			params = [ID, ui.item.data("id"), ui.item.index()];
			sendAjax("moveContainer",params,
			function(data){
				if(data.result != true){
					throwError(lang_values["err_move_container"]);
					setTimeout(function(){
						window.location.reload();
					},1000);
				}
				$grid.trigger("structureChange");
				scrollToContainer(params[1]);
			});
		}
	});
	function reloadContainerDraggables($draggables){
		$draggables.draggable({ 
			helper: function(event, element){
				return $("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			zIndex: 99,
			appendTo: $grid_wrapper,
			scroll: true,
			start: function(event, ui){
				$grid.children().before( $(document.createElement("div"))
								.addClass("container-drop-area-wrapper")
								.attr("data-type","container-drop-area-wrapper"));
				$grid.append($(document.createElement("div")).addClass("container-drop-area-wrapper"));
				$grid.find(".container-drop-area-wrapper").append($(document.createElement("div")).addClass("container-drop-area"));

				$grid.find(".container-drop-area").droppable({ 
					accept: ".new-container",
					hoverClass: "hover",
					drop: function( event, ui ) {
						var $draggable = $(ui.draggable);
						var containerReusable = $draggable.data("reusable"); 
						var containerType =  $draggable.data("type");
						var $this = $(this);
						if(containerReusable == "reusable"){
							$working_placeholder = $("<div class='working-placeholder'>").insertBefore($this.parent());
							$grid.children().remove(".container-drop-area-wrapper");
							//reused container
							sendAjax(
								"addReuseContainer",
								[ID, $working_placeholder.index(), $draggable.data("id")],
								function(data){
									$working_placeholder.replaceWith(buildContainer(data.result));
									$grid.trigger("structureChange");
									scrollToContainer(data.result.id);
							});
						} else {
							// new container
							$temp = buildContainer([{ 	"type": containerType, 
									"id" : "new",
									"prolog": "",
									"epilog": "" }] )
								.insertBefore( $(this).parent() );
						
							$grid.children().remove(".container-drop-area-wrapper");
							params = [ID, containerType, $temp.index()];
							sendAjax("addContainer",params,
							function(data){
								$temp.attr("data-id", data.result.id);
								$slots_wrapper = $temp.find(".slots-wrapper");
								$.each( data.result.slots, function(index,value){
									buildSlot([value]).appendTo( $slots_wrapper );
								});
								refreshBoxSortable();
								$grid.trigger("structureChange");
								scrollToContainer(data.result.id);
							});
						}
						
					}
				});
			},
			stop: function( event, ui ){
				$grid.children().remove(".container-drop-area-wrapper");
			}
		});
	}
	reloadContainerDraggables($(".container-dragger"));
	$grid.on("click",".c-tools > .c-tool", function(e){
		$this = $(this);
		$container = $this.parents(".container");
		switch($this.attr("role")){
			case "edit":
				if($grid.children(".editor").length > 0){
					throwError(lang_values["warn_container_edited"]);
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
			case "reuse":
				reuseContainer($container);
				break;
			default:
				console.log($this.attr("role"));
		}
	});
	function reuseContainer($container){
		var $c_reuse = $container.find(".c-reuse");
		if($container.data("reused") == true) return;
		if($c_reuse.hasClass('loading')) return;
		$c_reuse.addClass('loading rotate');
		var adminTitle = prompt(lang_values["prom_container_reuse_title"]);
		if(adminTitle == null || adminTitle == ""){
			throwError(lang_values["warn_container_reuse_need_title"]);
			$c_reuse.removeClass('loading rotate');
			return;
		}
  		var params =[ID,$container.data("id"),adminTitle];
		sendAjax("reuseContainer",params,function(data){
			if(data.result != true){
				$c_reuse.removeClass('loading rotate');
				throwError(lang_values["err_container_reuse"]);
				return;
			}
			window.location.reload();
		});
	}
	function deleteContainer($container){
		var $c_trash = $container.find(".c-trash");
		if($c_trash.hasClass('loading')) return;
		var $c_trash = $container.find(".c-trash").addClass('loading rotate');
		var params = [ID, $container.data("id")];		
		sendAjax("deleteContainer",params,function(data){
			if(data.result != true){
				throwError(lang_values["err_container_delete"]);
				$c_trash.removeClass('loading rotate');
				return;
			}
			$container.slideUp(300,function(){
				var $next = $container.next();
				var $prev = $container.prev();
				var target_c_id = null;
				if($next.length>0){
					target_c_id = $next.data("id");
				} else if($prev.length > 0){
					target_c_id = $prev.data("id");
				}
				$container.remove();
				$grid.trigger("structureChange");
				if(target_c_id != null){
					scrollToContainer(target_c_id);	
				}
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
		revert_data = {};
		revert_data = params;
		$newContainer = buildContainerEditor(params).insertAfter( $container );
		$newContainer.find(".slots-wrapper").replaceWith($container.find(".slots-wrapper"));
		$newContainer.find(".box").hide();
		if(arr_container_styles.length < 1){ $newContainer.find(".fieldset-c-style").hide();}
		$container.remove();

		CKEDITOR.replace(
			"f-c-prolog",{
				customConfig : document.PathToConfig
			}
		);
		CKEDITOR.replace(
			"f-c-epilog",{
				customConfig : document.PathToConfig
			}
		);
	}
	function saveContainer($editContainer){
		var $c_ok = $editContainer.find(".c-ok");
		if($c_ok.hasClass('loading')) return;
		$c_ok.addClass('loading rotate');
		var style = $editContainer.find("#f-c-style").val();
		if( style == "") style = null;
		templateParams = {
					id:$editContainer.data("id"), 
					title: $editContainer.find("#f-c-title").val(),
					titleurl: $editContainer.find("#f-c-titleurl").val(),
					type: $editContainer.data("type"),
					prolog: CKEDITOR.instances["f-c-prolog"].getData(),
					epilog: CKEDITOR.instances["f-c-epilog"].getData(),
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
				destroyCKEDITORs();
				$newContainer = buildContainer( templateParams ).insertAfter( $editContainer );
				$newContainer.find(".slots-wrapper").replaceWith($editContainer.find(".slots-wrapper"));
				$newContainer.find(".box").show();
				$editContainer.remove();
				isDraft();
				$grid.trigger("structureChange");
			} else {
				throwError(lang_values["err_container_save"]);
				$c_ok.removeClass('loading rotate');
			}
		});
	}
	function revertContainerChanges($container){
		$oldContainer =	buildContainer(revert_data );
		$oldContainer.find(".slots-wrapper").replaceWith($container.find(".slots-wrapper"));
		$oldContainer.find(".box").show();
		$container.after($oldContainer);
		$container.remove();
		$grid.trigger("structureChange");
	}
	function buildContainer(templateParams){
		console.log("Container params:");
		console.log(templateParams);
		if(templateParams["id"] == undefined || templateParams["id"] == null){
			// if container array
			console.log("is container array");
			$.each(templateParams, function(index, container) {
				addContainerParams(container);
			});
		} else {
			// if single container
			console.log("is single container");
			addContainerParams(templateParams);			
		}
		console.log(templateParams);
		return $.tmpl( "containerTemplate", templateParams );
	}
	function addContainerParams(container){
		container["styleTitle"] = arr_container_style_titles[container["style"]];
		container["is_sidebar"] = false;
		if(container["type"].indexOf("S") > -1){
			container["is_sidebar"] = true;
		} 
	}
	function buildContainerEditor(templateParams){
		return $.tmpl( "containerEditorTemplate", templateParams );
	}
	// ---------------------
	// slot funktionen
	// ----------------------
	$grid.on("mouseover",".container[data-reused=false] .slot > .style-changer",function(e){
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
			$style_changer.children("span").text(lang_values["default-style"]);
		} else {
			$style_changer.children("span").text($active_child.text());
		}
		if(arr_slot_styles.length < 1){
			$style_changer.hide();
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
				throwError(lang_values["err_slot_style"]);
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
		$(".container[data-reused=false][data-type*=C-] .boxes-wrapper").sortable({
			items: ".box",
			cancel: "span.edit",
			connectWith: ".container[data-reused=false] .boxes-wrapper, .c-box-trash",
			placeholder: "b-sort-placeholder",
			forcePlaceholderSize: true,
			distance: 10,
			refreshPositions: true,
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
			change: function(e,ui){
				$grid.trigger("structureChange");
			},
			stop: function(e, ui){
				hideBoxTrash();
				if(boxDeleted){
					boxDeleted = false;
					console.log("trash!!!!");
					return;
				}
				var new_container_id = ui.item.parents(".container").data("id");
				var new_slot_id = ui.item.parents(".slot").data("id");
				var new_box_index = ui.item.index();
				if(old_container_id == new_container_id &&
					old_slot_id == new_slot_id &&
					old_box_index == new_box_index){
					return;
				}
				sendAjax(
					"moveBox",
					[
						ID,
						old_container_id,old_slot_id,old_box_index,
						new_container_id,new_slot_id,new_box_index
					],
					function(data){
						console.log("Box moved");
						$grid.trigger("structureChange");
						if(data.result != true){
							// TODO: Rückmeldung geben und Box zurück sortieren!!!
							console.log(data);
							throwError(lang_values["err-move-box"]);
						}
						scrollToBox(ui.item.data("id"));
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
						throwError(lang_values["err_box_trash"]);
						return;
					}
					ui.draggable.remove();
					hideBoxTrash();
					$grid.trigger('structureChange');
				});
			}
		});
	}
	var $box_draggables = $;
	function refreshBoxDraggables(){
		$box_draggables = $(".box-dragger").draggable({ 
			helper: function(event, element){
				return $("<div class='dragger-helper'></div>");
			},
			cursorAt: { left: 30, top:30 },
			zIndex: 199,
			appendTo: $grid,
			addClass: true,
			//connectToSortable: GRID_SORTABLE,
			start: function(event, ui){
				$slots = $grid.find(".container[data-reused=false][data-type*=C-] .slot .boxes-wrapper");
				// drop place template
				var $toggle_btn = $toolbar.find("[role=hide_boxes]");
				if($toggle_btn.attr("data-hidden") != "true"){
					$slots.children(".box").before($( document.createElement('div'))
									.addClass("box-drop-area-wrapper"));
					$slots.append($( document.createElement('div'))
									.addClass("box-drop-area-wrapper"));
					$slots.find(".box-drop-area-wrapper").append($( document.createElement('div'))
									.addClass("box-drop-area"));
				}
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
							$grid.trigger("structureChange");
							scrollToBox(data.result.id);
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
	function getBoxEditorIDs(){
		var $data = $box_editor_content.find(".box-editor");
		return{ 
			ID:ID, 
			c_id: $data.data("c-id"), 
			s_id: $data.data("s-id"),
			b_idx: $data.data("b-index"),
			b_id: $data.data("id")
		};
	}
	$box_editor.on("click",".controls button",function(){
		$this = $(this);
		switch ($this.attr("role")){
			case "cancle":
				showGrid($box_editor_content.children().data("id"));
				break;
			case "save":
				updateBox();
				break;
			case "reusable":
				console.log($box_editor_content.children().data("type"));
				if($box_editor_content.children().data("type") == "sidebar"){
					alert(lang_values["err-box-reuse-sidebar"]);
					return;
				}
				if(!confirm(lang_values["confirm-box-reuse"])) return;
				makeBoxReusable();
				break;
		}
	});
	function makeBoxReusable(){
		var params = getBoxEditorIDs();
		updateBox(function(){
			sendAjax(
				"reuseBox",
				[params["ID"], params["c_id"], params["s_id"], params["b_idx"]],
				function(data){
					console.log(data);
					$grid.find(".container[data-reused=false] .box[data-id="+params["b_id"]+"]").replaceWith(buildBox(data.result));
					showGrid(data.result.id);
					destroyCKEDITORs();
				},
				function(){
					throwError(lang_values["err-box-reusable"]);
				}
			);
		});
	}
	function updateBox(afterSuccess){
		setBoxEditorLoading(true);
		$data = $box_editor_content.find(".box-editor");
		style = $data.find("[name=f-b-style]").val();
		if(style == "") style = null;
		// make content array
		content = collectBoxEditorData($data, 0);
		console.log(content);
		box_content = {
				id: $data.data("id"),
				type: $data.data("type"),
				title: $data.find("input[name=f-b-title]").val(),
				titleurl: $data.find("input[name=f-b-titleurl]").val(),
				prolog: CKEDITOR.instances["f-b-prolog"].getData(),
				epilog: CKEDITOR.instances["f-b-epilog"].getData(),
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
				if(afterSuccess != null){
					afterSuccess();
					return;
				}
				$grid.find(".container[data-reused=false] .box[data-id="+$data.data("id")+"]").replaceWith(buildBox(data.result));
				showGrid($data.data("id"));
				destroyCKEDITORs();
				isDraft();
				setBoxEditorLoading(true);
			},
			function(){
				throwError(lang_values["err-box-save"]);
			});
	}

	function collectBoxEditorData($data, lvl){
		var content = {};
		$.each($data.find("[lvl="+lvl+"] > .dynamic-field"), function(index, element){
			$element = $(element);
			switch($element.data("type")){
				case "html":
					content[$element.data("key")] = CKEDITOR.instances[$element.find(".dynamic-value").attr("name")].getData();
					break;
				case "checkbox":
					$e_value = $element.find(".dynamic-value");
					if($e_value.prop("checked")){
						content[$e_value.data("key")] = 1;
					} else {
						content[$e_value.data("key")] = 0;
					}
					break;
				case "list":
					var new_lvl = lvl+1;
					var values = new Array();
					var key = $element.data("key");
					$.each($element.find("[lvl="+new_lvl+"].fields"), function(indx, entry){
						values.push(collectBoxEditorData($(entry).parent(), new_lvl));
					});
					content[key] = values;
					break;
				case "autocomplete":
				case "autocomplete-with-links":
					content[$element.data("key")] = $element.find("input").data("value-key");
					break;
				case "wp-mediaselect":
				console.log($element.find(".dynamic-value").data("key"));
				console.log($element.find(".dynamic-value").val());
					content[$element.find(".dynamic-value").data("key")] = JSON.parse($element.find(".dynamic-value").val());
					break;
				default:
					content[$element.find(".dynamic-value").data("key")] = $element.find(".dynamic-value").val();
					break;
			}
		});
		return content;
	}
	$grid.on("click", ".box > .edit",function(data){
		$this = $(this);
		c_id = $this.parents(".container").data("id");
		s_id = $this.parents(".slot").data("id");
		b_index = $this.parents(".box").index();
		console.log("edit!-------------------");
		showBoxEditor();
		setBoxEditorLoading(true);
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
				if(arr_box_styles.length < 1){ $box_editor_content.find(".box-styles-wrapper").hide();}
				var $dynamic_fields = $box_editor_content.find(".dynamic-fields .field-wrapper");					
				var $fields = makeDynamicFields(result.contentstructure, result.content, 0, "");
				$dynamic_fields.append($fields);
				$.each($box_editor_content.find(".form-html"), function(index, element) {
					 CKEDITOR.replace(
							element,{
								customConfig : document.PathToConfig
							}
						);
				});
				setBoxEditorLoading(false);
			});
	});
	function makeDynamicFields(contentstructure, content, lvl, cs_path){
		var $dynamic_fields = $("<div>").addClass("fields").attr("lvl", lvl);
		$.each(contentstructure,function(index,element){
			var c_val = content[element.key];
			console.log("key:");
			console.log(element.key);
			console.log("contentvalue:");
			console.log(c_val);
			console.log("contentstructure path");
			console.log(cs_path);
			if(c_val === undefined){
				c_val = "";
			}
			var $dynamic_field = $("<div>")
				.addClass("dynamic-field")
				.attr("data-key", element.key)
				.attr("data-path", cs_path)
				.attr("data-index", index)
				.attr("data-type", element.type);
			switch(element.type){
				case "textarea":
					$dynamic_field.append("<label>"+element.label+"</label>");
					$dynamic_field.append(
						"<textarea class='dynamic-value form-textarea' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"' name='key-"+index+"'>"+
						c_val+
						"</textarea>");
					break;
				case "html":
					$dynamic_field.append("<label>"+element.label+"</label>");
					var $html_area = $("<textarea class='dynamic-value form-html' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"' name='"+element.key+"'>"+
						c_val+
						"</textarea>");
					$dynamic_field.append($html_area);
					break;
				case "number":
					$dynamic_field.append("<label>"+element.label+"</label>");
					$dynamic_field.append(
						"<input type='number' class='dynamic-value form-text' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"' value='"+c_val+"' />");
					break;
				case "text":
					$dynamic_field.append("<label>"+element.label+"</label>");
					$dynamic_field.append(
						"<input type='text' class='dynamic-value form-text' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"' value='"+c_val+"' />");
					break;
				case "select":
					$dynamic_field.append("<label>"+element.label+"</label>");
					var $select = $("<select class='dynamic-value form-select' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"'></select>");
					$.each(element.selections,function(i,sel){
						selected = "";
						if(content[element.key] == sel.key) selected = "selected='selected' ";
						$select.append("<option "+selected+"value='"+sel.key+"'>"+sel.text+"</option");
					});
					$dynamic_field.append($select);
					break;
				case "autocomplete":
					$dynamic_field.append("<label>"+element.label+"</label>");
					$dynamic_field.append($.tmpl( "inBoxAutocompleteTemplate", {
						// need to load label
						label: element.valuekey,
						val: c_val,
						key: element.key,
						type: element.type,
						path: cs_path+element.key
					} ));
					if(c_val != "" || c_val === 0){
						getReadableAutocompleteValue($dynamic_field.find(".i-autocomplete"));
					}
					break;
				case "autocomplete-with-links":
					$dynamic_field.append("<label>"+element.label+"</label>");
					$dynamic_field.append($.tmpl( "inBoxAutocompleteTemplate", {
						label: c_val,
						val: c_val,
						key: element.key,
						type: element.type,
						urlraw: element.url,
						url: element.url.replace("%",content[element.key]),
						emptyurlraw: element.emptyurl,
						emptyurl: element.emptyurl.replace("%",content[element.key]),
						linktext: element.linktext,
						emptylinktext: element.emptylinktext,
						path: cs_path+element.key
					}));
					if(c_val != "" || c_val === 0){
						getReadableAutocompleteValue($dynamic_field.find(".i-autocomplete"));
					}
					break;
				case "multiple-autocomplete":
					// TODO: Boell #715
					break;
				case "wp-mediaselect":
						
						var $upload_btn = $("<button class='upload_image_button'>"+lang_values["btn-wp-media"]+"</button>");
						$dynamic_field.append("<label>"+element.label+"</label>");
						$dynamic_field.append($upload_btn);

						console.log(c_val);
						var $input = $("<input />")
									.attr('value', JSON.stringify(c_val))
									.attr('type', 'hidden')
									.addClass('dynamic-value form-json')
									.attr("data-path",cs_path+element.key)
									.attr('data-key', element.key);
						$dynamic_field.append($input);

						$upload_btn.click(function(){
							$button = $(this);
							var frame = wp.media({
		                        //title : lang_values['title-wp-media'],
		                        multiple : false,
		                        library : { type : 'image'},
		                        button : { text : lang_values["btn-wp-media"] },
		                    });
		                    frame.on('open',function() {
		                        var selection = frame.state().get('selection');
		                        console.log("open");
		                        val = JSON.parse($button.siblings(".dynamic-value").val());
		                        attachment = wp.media.attachment(val.id);
		                        selection.add( attachment ? [ attachment ] : [] );	                        
		                    });
		                    frame.on('close',function() {
		                    	console.log("close");
		                        // get selections and save to hidden input plus other AJAX stuff etc.
		                        var selection = frame.state().get('selection');
		                        $.each(frame.state().get('selection')._byId, function(id, val) {
		                    		var r_json = {
							    		"id": val.id,
							    		"size": "full",
							    		"sizes": val.attributes.sizes
							    	};
							    	console.log(r_json);
							    	$button.siblings('.dynamic-value').val(JSON.stringify(r_json));
							    	wp_buildImageSizeSelect(r_json, $button.siblings('.dynamic-value'));
		                    		return false;
		                    	});
		                    });
		                    frame.open();
	                    	return false;
	                    	
	                    });
						$select_image_size = $("<select class='image-sizes'></select>");
						$dynamic_field.append($select_image_size);
						wp_buildImageSizeSelect(c_val, $input);
					    $select_image_size.on("change",function(){
							$this =	$(this);
							json = JSON.parse($this.siblings('.dynamic-value').val());
							json.size = $this.val();
							$this.siblings('.dynamic-value').val(JSON.stringify(json));
						});
					break;
				case "hidden":
					$dynamic_field.append(
						"<input type='hidden' class='dynamic-value' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"' value='"+c_val+"' />");
					break;
				case "checkbox":
					checked = "";
					if(c_val== 1){
						checked = "checked='checked'";
					}
					$dynamic_field.append("<div class='form-item'><input type='checkbox' "+checked+" class='dynamic-value form-checkbox' "+
						"data-path='"+cs_path+element.key+"' "+
						"data-key='"+element.key+"' value='1' /> <label class='option'>"+element.label+"</label></div>");
					break;
				case "file":
					var $upload_form_item = $("<div class='form-item file-upload'>");
					$upload_form_item.append("<label>"+element.label+"</label>");
					var $file_input = $("<input type='file' data-path='"+cs_path+element.key+"' class='form-file' />");
					$upload_form_item.append($file_input);
					var $key_field = $("<input type='hidden' data-key='"+element.key+"' value='"+c_val+"' class='dynamic-value' />");
					$upload_form_item.append($key_field);
					var $progress_display = $("<p>").addClass("progress");
					var $progress_bar_wrapper = $("<div class='progress-bar-wrapper'><div class='bar'></div>");
					var $progress_bar_status = $progress_bar_wrapper.children(".bar");
					if(content[element.key] == "" || content[element.key] == undefined){
						$progress_display.text("Please choose a picture...");
					} else {
						$progress_display.text("Choose another picture to override the old one.");
						$progress_bar_status.addClass("done");
					}
					$upload_form_item.append($progress_display).append($progress_bar_wrapper);
					$file_input.fileupload({
				        url: element.uploadpath,
				        dataType: 'json',
				        paramName: "file",
				        done: function (e, data) {
				        	result  = data.result;
				        	console.log("DONE: ");
				        	console.log(data.result);
				            $(this).siblings('[data-key='+element.key+']').val(result.result);
				            $progress_display.text("OK!");
				            $progress_bar_status.addClass("done");
				        },
				        progressall: function (e, data) {
				        	var percent = (data.loaded/data.total)*100;
				        	console.log(percent);
				        	$progress_display.text(Math.round(percent)+"%");
				        	$progress_bar_status.css("width", percent+"%");
				        },
				        always: function(e, data){
				        	console.log(data);
				        }
				    }).bind('fileuploadsubmit', function (e, data) {
				    	console.log("-------- FILE upload submit");
					    // The example input, doesn't have to be part of the upload form:
					    $data = $box_editor_content.find(".box-editor");
					    var element_key = element.key;
					    data.formData = {
					    		"gridid" : ID, 
					    		container: $data.data("c-id"), 
					    		slot : $data.data("s-id"), 
					    		box : $data.data("b-index"), 
					    		key: $(this).data("path")
					    	};
					   	console.log(data);
					    $progress_bar_status.removeClass("done");					    
					}).bind('fileuploadcompleted', function (e, data) {
						console.log("FILE upload completed:");
						console.log(data);
					}).bind('fileuploadfinished', function (e, data) {
						console.log("FILE upload finished");
						console.log(data);
					});
				    $dynamic_field.append($upload_form_item);
					break;
				case "list":
					$dynamic_field.append("<label>"+element.label+"</label>");
					var new_cs_path = cs_path+element.key+".";
					var $sub_fields = renderListData(element.contentstructure, c_val, lvl, new_cs_path);
					$dynamic_field
					.addClass("dynamic-list")
					.addClass("form-list")
					.addClass("dynamic-value")
					.attr("data-key", element.key)
					.append($sub_fields);
					$("<button>NEW Entry</button>").on(
						"click",{
							structure: element.contentstructure, 
							field_list: $dynamic_field.children(".list-fields"),
							lvl: lvl+1
						}, function(e){
						var $new_li = renderListEntry(e.data.structure,{}, e.data.lvl, new_cs_path);
						//$new_li.find("input").val("");
						e.data.field_list.append($new_li);
						$.each($new_li.find(".form-html"),function(i,e){
							CKEDITOR.replace(e);
						});
					}).appendTo($dynamic_field);
					break;
				case "info":
					$dynamic_field.append('<label>'+element.label+'</label>');
					$dynamic_field.append('<p class="info">'+element.text+'</p>');
					console.log("INFO ADDED");
					break;
				default:
					console.log("unbekannter typ: "+element.type);
			}
			if(element.info != null && element.info != ""){
				$dynamic_field.append('<p class="info">'+element.info+'</p>');
			}
			$dynamic_fields.append($dynamic_field);
		});
		return $dynamic_fields;
	}
	function wp_buildImageSizeSelect(json, $dynamic_input){
		$select_image_size = $dynamic_input.siblings('.image-sizes');
		if(typeof json.sizes != "object"){
			$select_image_size.hide();
			return;
		}
		$.each(json.sizes, function(index, size) {
			 selected = "";
			 if(json.size == index){
			 	selected = "selected='selected'";
			 }
			 $("<option "+selected+" >"+index+"</option>").attr('value', index).appendTo($select_image_size);
		});
		if($select_image_size.children().length > 0){ 
			$select_image_size.show();
		} else {
			$select_image_size.hide();
		}
	}
	function getReadableAutocompleteValue($input){
		var $data = $box_editor_content.find(".box-editor");
		var path = $input.attr("data-path");
		console.log("AUTOCOMPLETE PATH:"+path);
		console.log([
					ID,
					$data.data("c-id"),
					$data.data("s-id"),
					$data.data("b-index"),
					path,
					$input.val()
				]);
		sendAjax("typeAheadGetText",
				[
					ID,
					$data.data("c-id"),
					$data.data("s-id"),
					$data.data("b-index"),
					path,
					$input.val()
				],
				function(data){
					console.log("---- ReadableAutocomplete");
					console.log(data);
					$input.val(data.result);
				});
	}
	function renderListData(contentstructure, listdata, lvl, cs_path){
		var $dynamic_fields = $("<ul>").addClass("list-fields");
		lvl++;
		if(!$.isArray(listdata)){
			return $("");
		}
		$.each(listdata, function(index, content){
			$dynamic_fields.append(renderListEntry(contentstructure, content,lvl, cs_path));
		});
		return $dynamic_fields;
	}
	function renderListEntry(contentstructure, content, lvl, cs_path){
		return $("<li>")
			.append(makeDynamicFields(contentstructure, content,lvl, cs_path))
			.append( $("<button>X</button>").addClass("delete-item"));
	}
	$box_editor_content.on("click","button.delete-item",function(e){
		$(this).closest("li").remove();
	});
	var old_search_string = "";
	$box_editor_content.on("keyup", "input.i-autocomplete",function(e){
		$this = $(this);
		if(e.which == 13){
			$autocomplete_items = $this.siblings(".suggestion-list").children();
			if($autocomplete_items.size() == 1){
				pickAutocompleteItem($autocomplete_items.first());
			}
			return;
		}
		if($this.val() == old_search_string) return;
		$this.siblings(".loading").show();
		boxAutocompleteSearch($this);
	});
	var boxAutocompleteTimeout;	
	function boxAutocompleteSearch($input){
		clearTimeout(boxAutocompleteTimeout);
		if($input.val() == ""){
			old_search_string = $input.val();
			$input.siblings('.loading').hide();
			$input.siblings(".suggestion-list").empty();
			return;
		}
		boxAutocompleteTimeout = setTimeout(function(){
			$data = $box_editor_content.find(".box-editor");
			sendAjax(
					"typeAheadSearch",
					[ID,$data.data("c-id"),$data.data("s-id"),$data.data("b-index"),calculateListPath($input)["key-path"],$input.val()] ,
					function(data){
						old_search_string = $input.val();
						$input.siblings(".loading").hide();
						$autocompleteList = $input.siblings(".suggestion-list");
						$autocompleteList.empty();
						if(data.result.length < 1){
							console.log("no match found");
							return;
						}
						$.each(data.result,function(index, value){
							$autocompleteList.append($("<li>"+value.value+"</li>").attr("data-key",value.key));
						});
					});
		},500);
	}
	$box_editor_content.on("click",".suggestion-list li",function(e){
		pickAutocompleteItem($(this));
	});
	function pickAutocompleteItem($li){
		$wrapper = $li.parents(".autocomplete-wrapper")
					.addClass("locked");
		$wrapper.find("input")
			.val($li.text())
			.attr("disabled", "disabled")
			.data("value-key", $li.data("key"));

		var $emptyurl = $wrapper.find("a.empty");
		var $url = $wrapper.find("a.full");
		if($emptyurl.length > 0) $emptyurl.attr("href",$emptyurl.data("raw").replace("%",$li.data("key")));
		if($url.length > 0) $url.attr("href",$url.data("raw").replace("%",$li.data("key")));
		$li.parent().empty();
	}
	function calculateListPath($key_element){
		var $path_search = $key_element.parents(".dynamic-list");
		console.log($path_search);
		var key_path = "";
		var arr_path = [];
		while($path_search.length > 0){
			arr_path.push($path_search.data("key"));
			key_path = $path_search.data("key")+".";
			$path_search = $path_search.parents(".dynamic-list");
		}
		return {"key-path": key_path+$key_element.data("key"),"arr-path":arr_path}; 
	}
	$box_editor_content.on("click", ".autocomplete-wrapper .cancle",function(e){
		$this = $(this);
		$wrapper = $this.parents(".autocomplete-wrapper").removeClass("locked");
		$wrapper.find("input")
			.removeAttr("disabled")
			.val("")
			.data("value-key", "");
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
			if(GRIDMODE != "box"){
				$toolbar.slideDown(200,function(){
					if(box_id == null) return;
					$grid.trigger('structureChange');
					scrollToBox(box_id);
				});
				
			}
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
			window.scrollTo(0, 0);
		},50);
	}
	function setBoxEditorLoading(is_loading){
		if(is_loading){
			$box_editor_content.prepend('<div class="loading">');
		} else {
			$box_editor_content.children('.loading').remove();
		}
	}
	$box_editor_content.on("click","legend",function(ev){
		$(this).siblings(".field-wrapper").slideToggle(300);
	});
	function scrollToContainer(container_id){
		var $the_container = $(".container[data-id="+container_id+"]");
		if(isOnScreen($the_container))return;
		$('html, body').animate({
			 scrollTop: ($(".container[data-id="+container_id+"]").offset().top-160)
		 }, 200);
	}
	function scrollToBox(box_id){
		var $the_box = $(".container[data-reused=false] .box[data-id="+box_id+"]");
		if(isOnScreen($the_box)) return;
		$('html, body').animate({
			 scrollTop: ($the_box.offset().top-160)
		 }, 200);
	}
	function isOnScreen($elem){
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();

	    var elemTop = $elem.offset().top;
	    var elemBottom = elemTop + $elem.height();

	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
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
	/**
	*	Toggles boxes in slots for better container sorting.
	*/
	var box_toggling = false;
	function toggleBoxes(){
		if($grid.find(".container.editor").length > 0){
			throwError(lang_values["warn_toggle_boxes_container_edited"]);
			return;
		}
		if(box_toggling) return;
		toggling = true;
		var $toggle_btn = $toolbar.find("[role=hide_boxes]");
		if($toggle_btn.attr("data-hidden") == "true"){
			refreshBoxDraggables();
			$(".c-edit, .c-ok, .c-revert").show();
			$(".box, .c-before, .c-after").slideDown(200,function(){
				box_toggling = false;
				$toggle_btn.attr("data-hidden", false);
				$grid.trigger("structureChange");	
			});

		} else{
			$(".c-edit, .c-ok, .c-revert").hide();
			$(".box, .c-before, .c-after").slideUp(200,function(){
				box_toggling = false;
				$toggle_btn.attr("data-hidden", true);
				$grid.trigger("structureChange");	
				window.scrollTo(0, 0);
			});
		}

	}
	
	/**
	*	Eventhandler for an structureChange event
	*	called when sidebars could need a collision recalculation
		$body.on('structureChange'
	*/
	$grid.on("DOMSubtreeModified, structureChange", function(e, eventInfo) { 
		if(IS_SIDEBAR) return;
		// reset offsets
		$grid.children(".container").css("margin-top", "0px");
		$grid.find(".container[data-type*=S] .slot")
		.css("padding-bottom", 
			parseInt(
				$grid
				.find(".container[data-type*=C]:first-child .slot")
				.css("padding-bottom")
			)
		);
		// add new offsets
		$.each($grid.children('[class*=S]'), function(index, sidebar) {
			makeSidebarPuffer($(sidebar));
		});
	});
	/**
	*	builds the margins to prevent that the sidebar overlays an container
	*	@param $sidebar
	*	the sidebar container
	*/
	function makeSidebarPuffer($sidebar){
		var permissionsList = getFloatablePermissions($sidebar);
		var c_height = calculateSidebarableContainerHeight($sidebar.prev(), permissionsList);
		var $sidebar_slot = $sidebar.children(".slots-wrapper").children('.slot');
		var sidebar_margin_bottom = parseInt($sidebar.css("margin-bottom"));
		if(c_height < $sidebar_slot.outerHeight(true)){
			// if sidebar is taller than containers make puffer margin top
			var needed_margin_top = $sidebar_slot.outerHeight()+sidebar_margin_bottom;
			needed_margin_top -= c_height;
			$sidebar.css("margin-top", needed_margin_top);
		} else if(c_height > $sidebar_slot.outerHeight(true)){
			// if sidebar is smaller than containers expend sidebar slot
			var need_bottom_offset = c_height-$sidebar_slot.outerHeight();
			need_bottom_offset += sidebar_margin_bottom;
			$sidebar_slot.css("padding-bottom",need_bottom_offset);
		}
	}
	
	/**
	*	Calculates the hight of the elements that can float next to the sidebar and returns the element that eventually needs a margin-bottom
	*	
	*	@param $container
	*	the first container after the sidebar element
	*	@param $floatingTypes
	*	an array with the element types that can float next to the sidebar element
	*/
	function calculateSidebarableContainerHeight($container, floatablePermissionList){

		var c_height = 0;
		while($container.length > 0 && floatablePermissionList[$container.data('type')] ){
			c_height += $container.outerHeight(true);
			$container = $container.prev();
		}
		return c_height;
	}
	/**
	*	Gets the whitelists for elements that can be next to a sidebartype
	*
	*	@param $sidebar
	*	the sidebar
	*/
	function getFloatablePermissions($sidebar){
		switch($sidebar.data("type")){
			case "S-0-4":
				return {"C-8-0":true,"C-4-4-0":true, 
						"S-4-0":true, "C-0-4-0":true,
						"c-sort-placeholder": true, "container-drop-area-wrapper": true};
				break;
			case "S-4-0":
				return {"C-0-8":true,"C-0-4-4":true, 
						"S-0-4":true, "C-0-4-0":true, 
						"c-sort-placeholder": true, "container-drop-area-wrapper": true};
				break;
			case "S-0-6":
				return {"C-12-0":true, "C-4-4-4-0":true, "C-6-6-0":true, "C-3-3-3-3-0":true,
						"c-sort-placeholder": true, "container-drop-area-wrapper": true };
				break;
		}
		return {};
	}

	/*
	*	When Images are loaded this funciton can execute a function afterwards.
	*	@param fn
	*	Function to be executed
	*/
	function doAfterImageLoad(fn){
		$("img").one('load', fn).each(function() {
		  if(this.complete) $(this).load();
		});
	}

	//--------------------------
	// CKEditor
	// ------------------------
	function destroyCKEDITORs(){
		for(name in CKEDITOR.instances){
		    CKEDITOR.instances[name].destroy();
		}
	}

	// ---------------------
	// Window change
	// --------------------
	$(window).resize(function(e){
		resizeGridTools();
	});
	function resizeGridTools(){
		var tool_height = $(window).height();
		if(!$body.hasClass("fixed")){
			tool_height = tool_height - $grid_wrapper.offset().top + $(window).scrollTop();
		}
		$gridTools.css("height",tool_height);
		$toolBoxList.css("height", $gridTools.outerHeight()- 120);
		$toolContainerElementLists.css( "height", $gridTools.outerHeight()-120);
	}
	resizeGridTools();

	/**
	*	Calculates and sets the fixed toolbar on top.
	*/
	var top = $toolbar.offset().top;;
	function needFixedToolbar(){
		if( $(this).scrollTop() > (top) ) {
			$grid.css("margin-top",$toolbar.outerHeight(true));
		  	$body.addClass('fixed');
		} else {
			$grid.css("margin-top",0);
		  	$body.removeClass('fixed');
		}
		resizeGridTools();
	}

	/**
	*	Displays the status of the grid
	*	@param isDraft
	*	boolean if published (false) or draft (true)
	*/
	$btn_publish = $toolbar.find("button[role=publish]");
	$btn_revert = $toolbar.find("button[role=revert]");
	function changeIsDraftDisplay(isDraft){
		$stateDisplay.children('[role=indicator]').removeClass('loading');
		if(isDraft == true){
			$stateDisplay.addClass("draft");
			$stateDisplay.children('[role=text]').text(lang_values[$stateDisplay.attr("lang-id")]["draft"]);
			$btn_publish.removeAttr("disabled");
			$btn_revert.removeAttr("disabled");
		} else {			
			$stateDisplay.removeClass("draft");
			$stateDisplay.children('[role=text]').text( lang_values[$stateDisplay.attr("lang-id")]["published"]);
			$btn_publish.attr("disabled","disabled");
			$btn_revert.attr("disabled","disabled");
		}
	}
	/** TODO: buggy because every backspace is tracked
	$body.keydown(function(event) {
		if (event.keyCode == 8){
			if(!confirm(lang_values["confirm-leave-page"])){
				return false;
			}
		}
	});
	*/
	/**
	* 	Errors stack
	*	@param $error_text
	*	the text to discribe the error
	*/
	var $g_errors = $toolbar.find("[role=g-errors]");
	var error_stack = Array();
	function throwError($error_text, render_html){
		var $tag = null;
		if(render_html == true){
			$tag = $("<div></div>");
			$tag.text($error_text);
		} else {
			$tag = $("<p></p>");
			$tag.html($error_text);
		}
		error_stack.push( $tag.appendTo($g_errors).slideDown('slow') );
		setTimeout(function(){
			error_stack.shift().slideUp("slow",function(){
				$(this).remove();
			});
		},15000);
	}

	/**
	*	Loading animation to block grid
	*/
	function setGridLoading(){
		console.log("Grid loading animation");
	}
	// --------------------
	// Hash navigation
	// -------------------
	/*
	function setLocationHash(hash){
		window.history.pushState({data:"test"},'Title', hash+".html");
		//window.location.hash = hash;
	}
	$(window).on('popstate', function () {
       console.log( "popstate "+location.pathname);
       console.log("length "+window.history.length);
       console.log(location.state);
            
    });
*/

	// --------------------
	// Serverkommunikation
	// -------------------
	
	function sendAjax(method, params_array, success, error, async){
		json = {};
		json["method"] = method;
		json["params"] = params_array;
		/*
		if(error == null){
			error = function(jqXHR, textStatus, error){
				console.log(jqXHR);
				console.log(textStatus);
				console.log(error);
			};
		}
		*/
		var error_fn = null;
		if(error != null){
			error_fn = error;
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
		   		if(DEBUGGING){
		   			console.log("Method: "+method);
		   			console.log("Params");
		   			console.log(params_array);
		   			console.log(data);
		   		}
			   success(data);
			   isDraft();
			},
		   error: function(jqXHR, textStatus, error){
		   		if(DEBUGGING){
		   			console.log("Method: "+method);
					console.log(textStatus);
					console.log(jqXHR);
					console.log(error);
					throwError(
						"Method: "+method+"<br>"+
						"Status: ("+jqXHR.status+") -> "+textStatus+
						"ResponseText: [Next Box]"
					);
					throwError(
						jqXHR.responseText,
						true
					);
		   			
		   		}
				if(error_fn != null){
					error(jqXHR, textStatus, error);
				}
		   },
		   async:async
		 });
	}
	function isDraft(){
		json = {};
		json["method"] = "checkDraftStatus";
		json["params"] = [ID];
		//$stateDisplay.removeClass('draft');
		//$stateDisplay.children('[role=indicator]').addClass('loading');
		$.ajax({
		   url: SERVER,
		   dataType:"json",
		   type:'POST',
		   data: JSON.stringify(json),
		   success: function(data){
		   		if(data.result == true && !$stateDisplay.hasClass('draft')){
		   			loadRevisions();
		   		}
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


