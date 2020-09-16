<?php

namespace Palasthotel\Grid;

/**
 * Class API

 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2020, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 *
 * @property Storage store
 *
 */
class API {

	/**
	 * @var AbstractQuery
	 */
	private $query;
	/**
	 * @var iHook
	 */
	private $hook;

	/**
	 * @var Endpoint
	 */
	private $endpoint;

	/**
	 * @var UpdateGrid
	 */
	private $update;

	/**
	 * API constructor.
	 *
	 * @param AbstractQuery $query
	 * @param iHook $hook
	 * @param string $author
	 */
	public function __construct(AbstractQuery $query, iHook $hook, $author)
	{
		$this->query = $query;
		$this->hook = $hook;

		$this->requireBoxes();

		$this->update = new UpdateGrid($query);
		$this->store = new Storage($query, $hook, $author);
		$this->endpoint = new Endpoint();
	}

	public function requireBoxes(){
		require_once dirname( __FILE__ ) . '/../boxes/grid_box.php';

		require_once dirname( __FILE__ ) . '/../boxes/grid_error_box.php';

		require_once dirname( __FILE__ ) . '/../boxes/grid_static_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_html_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_video_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_soundcloud_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_plaintext_box.php';

		require_once dirname( __FILE__ ) . '/../boxes/grid_list_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_rss_box.php';

		require_once dirname( __FILE__ ) . '/../boxes/grid_reference_box.php';

		require_once dirname( __FILE__ ) . '/../boxes/grid_structure_configuration_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_container_configuration_box.php';
		require_once dirname( __FILE__ ) . '/../boxes/grid_slot_configuration_box.php';
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
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
				'collate'=> 'utf8mb4_unicode_ci'
			),
		);
	}

	public function install()
	{
		$this->query->prefixAndExecute("alter table {grid_box} add constraint {fk_box_type} foreign key (type) references {grid_box_type} (id) on update cascade ON DELETE SET NULL");
		$this->query->prefixAndExecute("alter table {grid_box} add constraint {fk_box_style} foreign key (style) references {grid_box_style} (id) on update cascade ON DELETE SET NULL");
		$this->query->prefixAndExecute("alter table {grid_container} add constraint {fk_container_type} foreign key (type) references {grid_container_type} (id) on update cascade on delete cascade");
		$this->query->prefixAndExecute("alter table {grid_container} add constraint {fk_container_style} foreign key (style) references {grid_container_style} (id) on update cascade ON DELETE SET NULL");
		$this->query->prefixAndExecute("alter table {grid_container2slot} add constraint {fk_container_container} foreign key (container_id,grid_id,grid_revision) references {grid_container} (id,grid_id,grid_revision) on update cascade on delete cascade");
		$this->query->prefixAndExecute("alter table {grid_container2slot} add constraint {fk_container_slot} foreign key (slot_id,grid_id,grid_revision) references {grid_slot} (id,grid_id,grid_revision) on update cascade on delete cascade");
		$this->query->prefixAndExecute("alter table {grid_grid2container} add constraint {fk_grid_grid} foreign key (grid_id,grid_revision) references {grid_grid} (id,revision) on update cascade on delete cascade");
		$this->query->prefixAndExecute("alter table {grid_grid2container} add constraint {fk_grid_container} foreign key (container_id,grid_id,grid_revision) references {grid_container} (id, grid_id, grid_revision) on update cascade on delete cascade");
		$this->query->prefixAndExecute("alter table {grid_slot} add constraint {fk_slot_style} foreign key (style) references {grid_slot_style} (id) on update cascade ON DELETE SET NULL");
		$this->query->prefixAndExecute("alter table {grid_slot2box} add constraint {fk_slot_slot} foreign key (slot_id,grid_id,grid_revision) references {grid_slot} (id,grid_id,grid_revision) on update cascade on delete cascade");
		$this->query->prefixAndExecute("alter table {grid_slot2box} add constraint {fk_slot_box} foreign key (box_id,grid_id,grid_revision) references {grid_box} (id,grid_id,grid_revision) on update cascade on delete cascade");

		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('i-0',0) ON DUPLICATE KEY UPDATE type=type;");

		$this->query->prefixAndExecute("insert into {grid_container_type} (type, numslots) values ('c-1d1',1) ON DUPLICATE KEY UPDATE type=type;");

		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('c-1d3-1d3-1d3',3) ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('c-2d3-1d3',2) ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('c-1d3-2d3',2) ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('c-1d6-1d6-1d6-1d6-1d6-1d6',6) ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('c-1d4-1d4-1d4-1d4',4) ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('c-1d2-1d2',2) ON DUPLICATE KEY UPDATE type=type;");

		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots, space_to_right) values ('s-1d3-0',1,'2d3') ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots, space_to_left) values ('s-0-1d3',1,'2d3') ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots) values ('sc-1d3',1) ON DUPLICATE KEY UPDATE type=type;");

		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots,space_to_left) values ('c-0-1d3-1d3',2,'1d3') ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots,space_to_right) values ('c-1d3-1d3-0',2,'1d3') ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots,space_to_left) values ('c-0-2d3',1,'1d3') ON DUPLICATE KEY UPDATE type=type;");
		$this->query->prefixAndExecute("insert into {grid_container_type} (type,numslots,space_to_right) values ('c-2d3-0',1,'1d3') ON DUPLICATE KEY UPDATE type=type;");

		$this->update->install();
	}

	public function uninstall()
	{
		$this->query->prefixAndExecute("alter table {grid_box} drop foreign key {fk_box_type}");
		$this->query->prefixAndExecute("alter table {grid_box} drop foreign key {fk_box_style}");
		$this->query->prefixAndExecute("alter table {grid_container} drop foreign key {fk_container_type}");
		$this->query->prefixAndExecute("alter table {grid_container} drop foreign key {fk_container_style}");
		$this->query->prefixAndExecute("alter table {grid_container2slot} drop foreign key {fk_container_container}");
		$this->query->prefixAndExecute("alter table {grid_container2slot} drop foreign key {fk_container_slot}");
		$this->query->prefixAndExecute("alter table {grid_grid2container} drop foreign key {fk_grid_grid}");
		$this->query->prefixAndExecute("alter table {grid_grid2container} drop foreign key {fk_grid_container}");
		$this->query->prefixAndExecute("alter table {grid_slot} drop foreign key {fk_slot_style}");
		$this->query->prefixAndExecute("alter table {grid_slot2box} drop foreign key {fk_slot_slot}");
		$this->query->prefixAndExecute("alter table {grid_slot2box} drop foreign key {fk_slot_box}");
	}

	public function update()
	{
		$this->update->performUpdates();
	}
}
