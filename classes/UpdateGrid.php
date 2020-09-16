<?php

namespace Palasthotel\Grid;

/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */


class UpdateGrid extends UpdateBase
{

	public function update_1()
	{
		$this->query->prefixAndExecute("create table if not exists {grid_schema} (propkey varchar(255),value varchar(255), PRIMARY KEY (`propkey`) );");
		$this->query->prefixAndExecute("insert into {grid_schema} (propkey) values ('schema_version') ON DUPLICATE KEY UPDATE propkey = 'schema_version';");
	}

	public function update_2(){
		$this->query->prefixAndExecute("ALTER TABLE {grid_container_type} ADD space_to_right varchar(255) DEFAULT NULL AFTER `type`;");
		$this->query->prefixAndExecute("ALTER TABLE {grid_container_type} ADD space_to_left varchar(255) DEFAULT NULL AFTER `type`;");

		// c-12 c-18
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d1' WHERE type = 'C-12' OR type = 'C-18';");

		// c-4-4-4 c-6-6-6
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d3-1d3-1d3' ".
					" WHERE type = 'C-4-4-4' OR type = 'C-6-6-6';");

		// c-8-4 c-4-8 c-6-12 c-12-6
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-2d3-1d3' ".
					" WHERE type = 'C-8-4' OR type = 'C-12-6';");

		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d3-2d3' ".
					" WHERE type = 'C-4-8' OR type = 'C-6-12';");

		// c-2-2-2-2-2-2 c-3-3-3-3-3-3
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d6-1d6-1d6-1d6-1d6-1d6' ".
					" WHERE type = 'C-2-2-2-2-2-2' OR type = 'C-3-3-3-3-3-3';");

		//c-3-3-3-3
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d4-1d4-1d4-1d4' ".
					" WHERE type = 'C-3-3-3-3';");

		// c-6-6 c-8-8
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d2-1d2' ".
					" WHERE type = 'C-6-6' OR type = 'C-8-8';");

		// sc-4 sc-6
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='sc-1d3' ".
					" WHERE type = 'SC-4' OR type = 'SC-6';");

		// c-0-4-4 c-0-6-6 && c-4-4-0 c-6-6-0
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-0-1d3-1d3', space_to_left='1d3' ".
					" WHERE type = 'C-0-4-4' OR type = 'C-0-6-6';");
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d3-1d3-0', space_to_right='1d3' ".
					" WHERE type = 'C-4-4-0' OR type = 'C-6-6-0';");

		// c-0-8 c-0-12 && c-8-0 c-12-0
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-2d3-0', space_to_right='1d3' ".
					" WHERE type = 'C-8-0' OR type = 'C-12-0';");
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-0-2d3', space_to_left='1d3' ".
					" WHERE type = 'C-0-8' OR type = 'C-0-12';");

		// c-2-2-2-2-0 c-3-3-3-3-0 and revers
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d6-1d6-1d6-1d6-0', space_to_right='1d3' ".
					" WHERE type = 'C-2-2-2-2-0' OR type = 'C-3-3-3-3-0';");
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-0-1d6-1d6-1d6-1d6', space_to_left='1d3' ".
					" WHERE type = 'C-0-2-2-2-2' OR type = 'C-0-3-3-3-3';");

		// c-0-4-0 c-0-6-0
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-0-1d3-0', space_to_left='1d3', space_to_right='1d3' ".
					" WHERE type = 'C-0-4-0' OR type = 'C-0-6-0';");

		// c-2-2-4-0 c-3-3-6-0
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-1d6-1d6-2d6-0', space_to_right='1d3' ".
					" WHERE type = 'C-2-2-4-0' OR type = 'C-3-3-6-0';");

		// c-4-2-2-0 c-6-3-3-0
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='c-2d6-1d6-1d6-0', space_to_right='1d3' ".
					" WHERE type = 'C-4-2-2-0' OR type = 'C-6-3-3-0';");

		// s-4-0 s-0-4 && s-6-0 s-0-6
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='s-0-1d3', space_to_left='2d3' ".
					" WHERE type = 'S-0-4' OR type = 'S-0-6';");
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='s-1d3-0', space_to_right='2d3' ".
					" WHERE type = 'S-4-0' OR type = 'S-6-0';");

		// I-0
		$this->query->prefixAndExecute("UPDATE {grid_container_type} SET type='i-0' ".
					" WHERE type = 'I-0';");

	}

	public function update_3() {
		$this->query->prefixAndExecute("alter table {grid_grid2container} drop foreign key fk_grid_container");
		$this->query->prefixAndExecute("alter table {grid_grid2container} add constraint {fk_grid_container} foreign key (container_id,grid_id,grid_revision) references {grid_container} (id, grid_id, grid_revision) on update cascade on delete cascade");
	}

	public function update_4(){
		$this->query->prefixAndExecute("alter table {grid_box_style} MODIFY slug VARCHAR(100) unique key");
		$this->query->prefixAndExecute("alter table {grid_slot_style} MODIFY slug VARCHAR(100) unique key");
		$this->query->prefixAndExecute("alter table {grid_container_style} MODIFY slug VARCHAR(100) unique key");
	}

	public function update_5(){
		$this->query->prefixAndExecute("alter table {grid_container} drop foreign key {fk_container_style}");
		$this->query->prefixAndExecute("alter table {grid_container} add constraint {fk_container_style} foreign key (style) references {grid_container_style} (id) on update cascade ON DELETE SET NULL");

		$this->query->prefixAndExecute("alter table {grid_slot} drop foreign key {fk_slot_style}");
		$this->query->prefixAndExecute("alter table {grid_slot} add constraint {fk_slot_style} foreign key (style) references {grid_slot_style} (id) on update cascade ON DELETE SET NULL");

		$this->query->prefixAndExecute("alter table {grid_box} drop foreign key {fk_box_style}");
		$this->query->prefixAndExecute("alter table {grid_box} add constraint {fk_box_style} foreign key (style) references {grid_box_style} (id) on update cascade ON DELETE SET NULL");

		$this->query->prefixAndExecute("alter table {grid_box} drop foreign key {fk_box_type}");
		$this->query->prefixAndExecute("alter table {grid_box} add constraint {fk_box_type} foreign key (type) references {grid_box_type} (id) on update cascade ON DELETE SET NULL");

	}

	public function update_6(){
		$this->query->prefixAndExecute("alter table {grid_container_style} MODIFY COLUMN slug VARCHAR(190) NOT NULL");
		$this->query->prefixAndExecute("alter table {grid_slot_style} MODIFY COLUMN slug VARCHAR(190) NOT NULL");
		$this->query->prefixAndExecute("alter table {grid_box_style} MODIFY COLUMN slug VARCHAR(190) NOT NULL");

		$this->query->prefixAndExecute("alter table {grid_container_style} MODIFY COLUMN style TEXT NOT NULL");
		$this->query->prefixAndExecute("alter table {grid_slot_style} MODIFY COLUMN style TEXT NOT NULL");
		$this->query->prefixAndExecute("alter table {grid_box_style} MODIFY COLUMN style TEXT NOT NULL");

		$this->query->prefixAndExecute("alter table {grid_container} MODIFY COLUMN title text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_container} MODIFY COLUMN prolog text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_container} MODIFY COLUMN epilog text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_container} MODIFY COLUMN readmore text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_container} MODIFY COLUMN reuse_title text COLLATE utf8mb4_unicode_ci");

		$this->query->prefixAndExecute("alter table {grid_box} MODIFY COLUMN title text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_box} MODIFY COLUMN prolog text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_box} MODIFY COLUMN epilog text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_box} MODIFY COLUMN content text COLLATE utf8mb4_unicode_ci");
		$this->query->prefixAndExecute("alter table {grid_box} MODIFY COLUMN readmore text COLLATE utf8mb4_unicode_ci");

	}

}
