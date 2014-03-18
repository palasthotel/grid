<script type="text/javascript" src="/<?php echo $ckeditor_path; ?>"></script>
<div id="new-grid-wrapper"></div>

<div id="grid-wrapper" class="clearfix">
	<div id="grid-toolbar" class="clearfix">
        <div class="clearfix" role="g-controls">
        	<ul role="data">
                <li>
                    <div class="state-display" lang-id="state-display">
                        <span role="indicator"></span>
                        <span lang-id="state-display" role="text"></span>
                    </div>
                </li>
                <li><button role="publish" lang-id="btn-publish" lang-type="text"><i class="icon-back"></i>Publish</button></li>
                <li><button role="preview" lang-id="btn-preview" lang-type="text">Preview</button></li>  
                <li><button role="revert" lang-id="btn-revert" lang-type="text">Revert</button></li>
                <li>
                    <button role="revisions" lang-id="btn-revisions" lang-type="text">Revisions</button>
                    <!-- revisions -->
                    <div id="grid-revisions" class="rev-wrapper">
                        <div class="scroll_wrapper">
                            <table>
                            </table>   
                        </div>
                    </div>
                     <!-- revisions END -->
                </li>         
            </ul>
            <ul role="gui">
                <li class="hide-from-sidebar">
                    <button data-hidden="false" role="hide_boxes" lang-id="btn-toggle-boxes" lang-type="text">Toggle boxes</button>
                </li>
                <li class="hide-from-sidebar">
                    <button role="add_container" lang-id="btn-add-container" lang-type="text">Add container</button>
                </li>
                <li><button role="add_box" lang-id="btn-add-box" lang-type="text">Add box</button></li>
            </ul>
            
            <div class="grid-tools">
            	<!-- Tools für Container hinzufügen -->
            	<div class="g-tool g-container clearfix">
                    <div class="loading rotate"></div>
                    <ul class="clearfix element-type-tabs container-type-tabs">
                        <li role="show-containers" scope="containers" class="active" 
                        lang-id="title-tab-containers" lang-type="title" title="Empty container">C</li>

                        <li role="show-containers" scope="sidebars" 
                        lang-id="title-tab-sidebars" lang-type="title" title="Sidebars">S</li>

                        <li role="show-reusable" scope="reuse"
                        lang-id="title-tab-reuse-container" lang-type="title" title="Reusable container">R</li>
                    </ul>
                    <ul class="container-type-chooser element-list" ref="show-containers">
                    </ul>
                    <ul class="reusable-elements element-list" ref="show-reusable">
                    </ul>
                </div>
                <!-- Tools für Box hinzufügen -->
                <div class="g-tool g-box">
                	<div class="loading rotate"></div>
                	<ul class="box-type-tabs element-type-tabs clearfix"></ul>
                	<div class="search-bar">
                    	<input name="box-search" type="text" class="form-text" placeholder="Search" 
                        lang-id="placeholder-search-box" lang-type="placeholder" />
                    </div>
                	<ul class="box-list clearfix"></ul>
                </div>
            </div>
        </div>
        
        <div role="g-errors">
            <!--[if lte IE 8]>
                <p><?= t("Your browser is too old. Please use an up-to-date browser version."); ?>.</p>
            <![endif]-->
        </div> 
    </div>
    
    <!-- grid display -->
    <div id="grid">
     </div>
     <!-- grid display END -->
     
     <!-- box editor -->
     <div id="box-editor">
     	<div class="content">
        </div>
        <div class="controls">
        	<button role="cancle" lang-id="btn-cancle" lang-type="text">Cancel</button>
            <button role="save" lang-id="btn-save" lang-type="text">Save</button>
            <button role="reusable" lang-id="btn-make-reusable" lang-type="text">Make reusable</button>
        </div>
     </div>
     <!-- box editor END -->
</div>
