<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

class grid_library
{
	public function __construct()
	{
		require_once(dirname(__FILE__)."/classes/bootstrap.php");
	}

	private function getHome()
	{
		return dirname(__FILE__)."/";
	}

	public function getFrontendCSS($absolute=FALSE)
	{
		$home=$this->getHome();
		$path=$home."css/grid-container-slots.css.php";
		if($absolute)
			return $path;
		$path=substr($path, strlen($home));
		return $path;
	}

	//Gets an array of JS files to include on editor view (if absolute is true, absolute paths are returned.
	public function getEditorJS($language="en",$absolute=FALSE, $need_jquery = TRUE)
	{
		$home=$this->getHome();
		$editorfields=glob($home."js/app/views/EditorWidgets/*.js");

		$editorwidgets=array();
		foreach($editorfields as $idx=>$file)
		{
			$path=$file;
			$editorwidgets[]=$path;
		}

		$framework_dir=$home."js/frameworks/";
		$app_dir=$home."js/app/";

		$scripts=array();
		if($need_jquery) $scripts[]=$framework_dir."jquery-1.8.3.min.js";
		$scripts[]=$framework_dir."jquery-ui-1.10.2.custom.js";
		$scripts[]=$framework_dir."jquery.ui.touch-punch.js";
		$scripts[]=$framework_dir."jquery.iframe-transport.js";
		$scripts[]=$framework_dir."jquery.fileupload.js";
		$scripts[]=$framework_dir."mutate.events.js";
		$scripts[]=$framework_dir."mutate.min.js";
		$scripts[]=$framework_dir."underscore.js";
		$scripts[]=$framework_dir."GridBackbone.js";
		$scripts[]=$framework_dir."GridICanHaz.js";
		$scripts[]=$framework_dir."Socket.io.js";
		$scripts[]=$home."js/ckeditor/ckeditor.js";
		$scripts[]=$app_dir."GridViews.js";
		$scripts[]=$app_dir."views/GridContainerEditorView.js";
		$scripts[]=$app_dir."views/GridBoxEditorView.js";
		foreach($editorwidgets as $idx=>$path)
		{
			$scripts[]=$path;
		}
		$scripts[]=$app_dir."views/GridRevisionsView.js";
		$scripts[]=$app_dir."views/GridToolbarView.js";
		$scripts[]=$app_dir."views/GridToolContainersView.js";
		$scripts[]=$app_dir."views/GridToolBoxTypesView.js";
		$scripts[]=$app_dir."views/GridToolBoxBlueprintsView.js";
		$scripts[]=$app_dir."views/GridSlotStyleChangerView.js";
		$scripts[]=$app_dir."views/GridAuthorsView.js";
		$scripts[]=$app_dir."views/GridAuthorView.js";
		$scripts[]=$app_dir."GridModels.js";
		$scripts[]=$app_dir."models/GridBoxBlueprint.js";
		$scripts[]=$app_dir."models/GridRights.js";
		$scripts[]=$app_dir."models/GridAuthor.js";
		$scripts[]=$app_dir."GridCollections.js";
		$scripts[]=$app_dir."collections/GridBoxBlueprints.js";
		$scripts[]=$app_dir."collections/GridAuthors.js";
		$scripts[]=$app_dir."GridSync.js";
		$scripts[]=$app_dir."GridAsync.js";
		$scripts[]=$app_dir."Grid.js";
		if(is_file($home."/js/language/grid-".$language.".js")){
			$scripts[]=$home."/js/language/grid-".$language.".js";
		}
		$scripts[]=$home."/js/language/grid-en.js";

		if($absolute)
		{
			return $scripts;
		}
		$return=array();
		foreach($scripts as $idx=>$script)
		{
			$return[]=substr($script, strlen($home));
		}
		return $return;
	}

	//Gets an array of CSS files to include on editor view
	public function getEditorCSS($rtl=FALSE,$absolute=FALSE)
	{
		$css=array();
		$home=$this->getHome();
		$css[]=$home."css/grid-backend.css";
		if($rtl)
		{
			$css[]=$home."css/rtl.css";
		}
		if($absolute)
		{
			return $css;
		}
		$return=array();
		foreach($css as $idx=>$entry)
		{
			$tmp=substr($entry, strlen($home));
			$return[]=$tmp;
		}
		return $return;
	}
	// renderes css for avaiable container slots
	public function getContainerSlotCSS($container_types){
		// $container_types = db_query("SELECT * FROM {grid_container_type}");
		ob_start();
		require $this->getHome()."css/grid-container-slots.css.php";
		$return = ob_get_contents();
		ob_end_clean();
		return $return;
	}
	private function calculateSpace($space){
		if($space == null || $space == "") return null;
		$calc = explode("d", $space);
		if(count($calc) < 2) return null;
		return ($calc[0]/$calc[1])*100;
	}

	//renders the CKEditor configuration
	public function getCKEditorConfig($styles,$formats, $ckeditor_plugins = array())
	{
		ob_start();
		require($this->getHome()."js/grid_htmlbox_ckeditor_config.js.php");
		$str=ob_get_contents();
		ob_end_clean();
		return $str;
	}
	
	/**
	 * Returns the Editor HTML.
	 * @param $grid_id id of the grid to edit
	 * @param $grid_mode grid or box or container.
	 * @param $pathToCKEditorConfig url which returns the output of renderCKEditorConfig
	 * @param $ajaxendpoint url which connects to the ajax endpoint class
	 * @param $debug_mode true or false
	 * @param $preview_url url to preview the current grid
	 * @param $preview_pattern pattern for previews of certain
	 * @param string $async_service
	 * @param string $async_domain
	 * @param string $async_author
	 * @param string $async_path
	 * @param int $timeout for author grid lock in seconds (default is 5 minutes)
	 * @return string
	 */
	public function getEditorHTML($grid_id, $grid_mode, $pathToCKEditorConfig, $ajaxendpoint, $debug_mode, $preview_url, $preview_pattern, $async_service="", $async_domain="", $async_author="", $async_path="", $async_timeout = 300)
	{
		ob_start();
		require( dirname(__FILE__)."/templates/backend/grid.tpl.php" );
		$str=ob_get_contents();
		ob_end_clean();
		return $str;
	}

	public function getDatabaseSchema()
	{
		return array(
			'grid_grid'=>array(
				'description'=>t('Stores all grids and their revisions.'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'published'=>array(
						'description'=>t('Published Flag'),
						'type'=>'int',
						'size'=>'tiny',
					),
					'next_containerid'=>array(
						'description'=>t('ID for next container'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'next_slotid'=>array(
						'description'=>t('ID for next slot'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'next_boxid'=>array(
						'description'=>t('ID for next box'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'author'=>array(
						'description'=>t('Author of this grid'),
						'type'=>'text',
						'size'=>'normal',
					),
					'revision_date'=>array(
						'description'=>t('timestamp of revision creation'),
						'type'=>'int',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id','revision'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_container'=>array(
				'description'=>t('Stores all container'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('container id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'grid_id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'grid_revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'type'=>array(
						'description'=>t('container type'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'style'=>array(
						'description'=>t('container style'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'title'=>array(
						'description'=>t('title'),
						'type'=>'text',
						'size'=>'normal',
					),
					'title_url'=>array(
						'description'=>t('title url'),
						'type'=>'text',
						'size'=>'normal',
					),
					'prolog'=>array(
						'description'=>t('prolog'),
						'type'=>'text',
						'size'=>'normal',
					),
					'epilog'=>array(
						'description'=>t('epilog'),
						'type'=>'text',
						'size'=>'normal',
					),
					'readmore'=>array(
						'description'=>t('readmore text'),
						'type'=>'text',
						'size'=>'normal',
					),
					'readmore_url'=>array(
						'description'=>t('readmore url'),
						'type'=>'text',
						'size'=>'normal',
					),
					'reuse_containerid'=>array(
						'description'=>t('reuse id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>false,
						'unsigned'=>true,
					),
					'reuse_title'=>array(
						'description'=>t('reuse title'),
						'type'=>'text',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id','grid_id','grid_revision'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_slot'=>array(
				'description'=>t('stores all slots'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('slot id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'grid_id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'grid_revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'style'=>array(
						'description'=>t('slot style'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
				),
				'primary key'=>array('id','grid_id','grid_revision'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_box'=>array(
				'description'=>t('stores all boxes'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('box id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'grid_id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'grid_revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'type'=>array(
						'description'=>t('box type'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'style'=>array(
						'description'=>t('box style'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'title'=>array(
						'description'=>t('title'),
						'type'=>'text',
						'size'=>'normal',
					),
					'title_url'=>array(
						'description'=>t('title url'),
						'type'=>'text',
						'size'=>'normal',
					),
					'prolog'=>array(
						'description'=>t('prolog'),
						'type'=>'text',
						'size'=>'normal',
					),
					'epilog'=>array(
						'description'=>t('epilog'),
						'type'=>'text',
						'size'=>'normal',
					),
					'readmore'=>array(
						'description'=>t('readmore text'),
						'type'=>'text',
						'size'=>'normal',
					),
					'readmore_url'=>array(
						'description'=>t('readmore url'),
						'type'=>'text',
						'size'=>'normal',
					),
					'content'=>array(
						'description'=>t('content'),
						'type'=>'text',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id','grid_id','grid_revision'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_grid2container'=>array(
				'description'=>t('links grid to container'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'grid_id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'grid_revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'container_id'=>array(
						'description'=>t('referenced container'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'weight'=>array(
						'description'=>t('weight within grid'),
						'type'=>'int',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_container2slot'=>array(
				'description'=>t('links container to slot'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'container_id'=>array(
						'description'=>t('referenced container'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'grid_id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'grid_revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'slot_id'=>array(
						'description'=>t('referenced slot'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'weight'=>array(
						'description'=>t('weight within grid'),
						'type'=>'int',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_slot2box'=>array(
				'description'=>t('links box to slot'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'slot_id'=>array(
						'description'=>t('referenced slot'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'grid_id'=>array(
						'description'=>t('grid id'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>false,
					),
					'grid_revision'=>array(
						'description'=>t('grid revision'),
						'type'=>'int',
						'size'=>'normal',
						'not null'=>true,
					),
					'box_id'=>array(
						'description'=>t('referenced box'),
						'type'=>'int',
						'size'=>'normal',
						'unsigned'=>true,
					),
					'weight'=>array(
						'description'=>t('weight within grid'),
						'type'=>'int',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_box_style'=>array(
				'description'=> t('Box Styles'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('style id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'style'=>array(
						'description'=>t('style'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
					'slug'=>array(
						'description'=>t('slug'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>100,
					),
				),
				'primary key'=>array('id'),
				'unique keys' =>array(
					"slug" => array( 'slug' ),
				),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_box_type'=>array(
				'description'=>t('Box types'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('type id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'type'=>array(
						'description'=>t('type'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
				),
				'primary key'=>array('id'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_container_style'=>array(
				'description'=>t('Container Styles'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('style id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'style'=>array(
						'description'=>t('style'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
					'slug'=>array(
						'description'=>t('slug'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>100,
					),
				),
				'primary key'=>array('id'),
				'unique keys' =>array(
					"slug" => array( 'slug' ),
				),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_container_type'=>array(
				'description'=>t('Container Types'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('type id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'type'=>array(
						'description'=>t('type of container'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
					'space_to_right'=>array(
						'description'=>t('space to right'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
					'space_to_left'=>array(
						'description'=>t('space to left'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
					'numslots'=>array(
						'description'=>t('number of slots this container has'),
						'type'=>'int',
						'size'=>'normal',
					),
				),
				'primary key'=>array('id'),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_slot_style'=>array(
				'description'=>t('slot styles'),
				'fields'=>array(
					'id'=>array(
						'description'=>t('style id'),
						'type'=>'serial',
						'size'=>'normal',
						'not null'=>true,
						'unsigned'=>true,
					),
					'style'=>array(
						'description'=>t('style'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>255,
					),
					'slug'=>array(
						'description'=>t('slug'),
						'type'=>'varchar',
						'size'=>'normal',
						'length'=>100,
					),
				),
				'primary key'=>array('id'),
				'unique keys' =>array(
					"slug" => array( 'slug' ),
				),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
			'grid_schema'=>array(
				'description'=>t('global schema info'),
				'fields'=>array(
					'propkey'=>array(
						'type'=>'varchar',
						'length'=>255,
						'size'=>'normal',
					),
					'value'=>array(
						'type'=>'varchar',
						'length'=>255,
						'size'=>'normal',
					),
				),
				'mysql_engine'=>'InnoDB',
				'mysql_character_set'=>'utf8mb4',
			),
		);
	}

	public function install()
	{
		db_query("alter table {grid_box} add constraint {fk_box_type} foreign key (type) references {grid_box_type} (id) on update cascade on delete cascade");
		db_query("alter table {grid_box} add constraint {fk_box_style} foreign key (style) references {grid_box_style} (id) on update cascade on delete cascade");
		db_query("alter table {grid_container} add constraint {fk_container_type} foreign key (type) references {grid_container_type} (id) on update cascade on delete cascade");
		db_query("alter table {grid_container} add constraint {fk_container_style} foreign key (style) references {grid_container_style} (id) on update cascade on delete cascade");
		db_query("alter table {grid_container2slot} add constraint {fk_container_container} foreign key (container_id,grid_id,grid_revision) references {grid_container} (id,grid_id,grid_revision) on update cascade on delete cascade");
		db_query("alter table {grid_container2slot} add constraint {fk_container_slot} foreign key (slot_id,grid_id,grid_revision) references {grid_slot} (id,grid_id,grid_revision) on update cascade on delete cascade");
		db_query("alter table {grid_grid2container} add constraint {fk_grid_grid} foreign key (grid_id,grid_revision) references {grid_grid} (id,revision) on update cascade on delete cascade");
		db_query("alter table {grid_grid2container} add constraint {fk_grid_container} foreign key (container_id,grid_id,grid_revision) references {grid_container} (id, grid_id, grid_revision) on update cascade on delete cascade");
		db_query("alter table {grid_slot} add constraint {fk_slot_style} foreign key (style) references {grid_slot_style} (id) on update cascade on delete cascade");
		db_query("alter table {grid_slot2box} add constraint {fk_slot_slot} foreign key (slot_id,grid_id,grid_revision) references {grid_slot} (id,grid_id,grid_revision) on update cascade on delete cascade");
		db_query("alter table {grid_slot2box} add constraint {fk_slot_box} foreign key (box_id,grid_id,grid_revision) references {grid_box} (id,grid_id,grid_revision) on update cascade on delete cascade");

		db_query("insert into {grid_container_type} (type,numslots) values ('i-0',0) ON DUPLICATE KEY UPDATE type=type;");

		db_query("insert into {grid_container_type} (type, numslots) values ('c-1d1',1) ON DUPLICATE KEY UPDATE type=type;");

		db_query("insert into {grid_container_type} (type,numslots) values ('c-1d3-1d3-1d3',3) ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots) values ('c-2d3-1d3',2) ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots) values ('c-1d3-2d3',2) ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots) values ('c-1d6-1d6-1d6-1d6-1d6-1d6',6) ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots) values ('c-1d4-1d4-1d4-1d4',4) ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots) values ('c-1d2-1d2',2) ON DUPLICATE KEY UPDATE type=type;");

		db_query("insert into {grid_container_type} (type,numslots, space_to_right) values ('s-1d3-0',1,'2d3') ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots, space_to_left) values ('s-0-1d3',1,'2d3') ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots) values ('sc-1d3',1) ON DUPLICATE KEY UPDATE type=type;");

		db_query("insert into {grid_container_type} (type,numslots,space_to_left) values ('c-0-1d3-1d3',2,'1d3') ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots,space_to_right) values ('c-1d3-1d3-0',2,'1d3') ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots,space_to_left) values ('c-0-2d3',1,'1d3') ON DUPLICATE KEY UPDATE type=type;");
		db_query("insert into {grid_container_type} (type,numslots,space_to_right) values ('c-2d3-0',1,'1d3') ON DUPLICATE KEY UPDATE type=type;");

		$this->getUpdater()->install();
	}

	public function uninstall()
	{
		db_query("alter table {grid_box} drop foreign key {fk_box_type}");
		db_query("alter table {grid_box} drop foreign key {fk_box_style}");
		db_query("alter table {grid_container} drop foreign key {fk_container_type}");
		db_query("alter table {grid_container} drop foreign key {fk_container_style}");
		db_query("alter table {grid_container2slot} drop foreign key {fk_container_container}");
		db_query("alter table {grid_container2slot} drop foreign key {fk_container_slot}");
		db_query("alter table {grid_grid2container} drop foreign key {fk_grid_grid}");
		db_query("alter table {grid_grid2container} drop foreign key {fk_grid_container}");
		db_query("alter table {grid_slot} drop foreign key {fk_slot_style}");
		db_query("alter table {grid_slot2box} drop foreign key {fk_slot_slot}");
		db_query("alter table {grid_slot2box} drop foreign key {fk_slot_box}");
	}

	public function getStyleEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_style_editor.php");
		return new grid_style_editor();
	}

	public function getReuseContainerEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_reuse_container_editor.php");
		return new grid_reuse_container_editor();
	}

	public function getReuseBoxEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_reuse_box_editor.php");
		return new grid_reuse_box_editor();
	}

	public function getContainerEditor()
	{
		require_once(dirname(__FILE__)."/classes/grid_container_editor.php");
		return new grid_container_editor();
	}

	private function getUpdater()
	{
		require_once(dirname(__FILE__)."/classes/grid_update.php");
		return new grid_update();
	}

	public function update()
	{
		$update=$this->getUpdater();
		$update->performUpdates();
	}
}
