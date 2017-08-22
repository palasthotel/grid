<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */

if(!function_exists("grid_query"))
{
	function grid_query($querystring)
	{
		return db_query($querystring);
	}
}

class base_update
{
	/**
	 * shema key for update shema identification
	 */
	public $schemakey = "";

	public function performUpdates()
	{
		$current_schema=$this->getCurrentSchemaVersion();
		$needed_schema=$this->getNeededSchemaVersion();
		if($current_schema==$needed_schema)
			return;
		$methods=$this->getUpdateMethods();
		for($i=$current_schema+1;$i<=$needed_schema;$i++)
		{
			$method=$methods[$i];
			$this->$method();
		}
		$this->markAsUpdated();
	}

	public function getUpdateMethods()
	{
		$methods=get_class_methods($this);
		$updates=array();
		foreach($methods as $method)
		{
			if(strpos($method, "update_")===0)
			{
				$id=explode("_", $method);
				$id=$id[1];
				$updates[$id]=$method;
			}
		}
		return $updates;
	}

	public function getNeededSchemaVersion()
	{
		$methods=$this->getUpdateMethods();
		$i=0;
		foreach($methods as $idx=>$method)
		{
			if($idx>$i)
				$i=$idx;
		}
		return $i;
	}

	public function markAsUpdated()
	{
		//we assume that all updates have been applied during installation, so we're searching for the highest one and save that.
		$schema=$this->getNeededSchemaVersion();
		db_query("update {grid_schema} set value=".$schema." where propkey='schema_version".$this->schemakey."'");
	}

	public function getCurrentSchemaVersion()
	{
		try
		{
			$result=grid_query("select value from {grid_schema} where propkey='schema_version".$this->schemakey."'");
			foreach($result as $entry)
			{
				return $entry->value;
			}
		}
		catch(Exception $ex){}
    return 0;
	}

	public function install(){
		db_query("insert into {grid_schema} (propkey) values ('schema_version') ON DUPLICATE KEY UPDATE propkey = 'schema_version';");
		$this->markAsUpdated();
	}

}

class grid_update extends base_update
{
	/**
	 * shema key for update shema identification
	 * Grid lib
	 */
	public $schemakey = "";

	public function update_1()
	{
		db_query("create table if not exists {grid_schema} (propkey varchar(255),value varchar(255), PRIMARY KEY (`propkey`) );");
		db_query("insert into {grid_schema} (propkey) values ('schema_version') ON DUPLICATE KEY UPDATE propkey = 'schema_version';");
	}

	public function update_2(){
		db_query("ALTER TABLE {grid_container_type} ADD space_to_right varchar(255) DEFAULT NULL AFTER `type`;");
		db_query("ALTER TABLE {grid_container_type} ADD space_to_left varchar(255) DEFAULT NULL AFTER `type`;");

		// c-12 c-18
		db_query("UPDATE {grid_container_type} SET type='c-1d1' WHERE type = 'C-12' OR type = 'C-18';");

		// c-4-4-4 c-6-6-6
		db_query("UPDATE {grid_container_type} SET type='c-1d3-1d3-1d3' ".
					" WHERE type = 'C-4-4-4' OR type = 'C-6-6-6';");

		// c-8-4 c-4-8 c-6-12 c-12-6
		db_query("UPDATE {grid_container_type} SET type='c-2d3-1d3' ".
					" WHERE type = 'C-8-4' OR type = 'C-12-6';");

		db_query("UPDATE {grid_container_type} SET type='c-1d3-2d3' ".
					" WHERE type = 'C-4-8' OR type = 'C-6-12';");

		// c-2-2-2-2-2-2 c-3-3-3-3-3-3
		db_query("UPDATE {grid_container_type} SET type='c-1d6-1d6-1d6-1d6-1d6-1d6' ".
					" WHERE type = 'C-2-2-2-2-2-2' OR type = 'C-3-3-3-3-3-3';");

		//c-3-3-3-3
		db_query("UPDATE {grid_container_type} SET type='c-1d4-1d4-1d4-1d4' ".
					" WHERE type = 'C-3-3-3-3';");

		// c-6-6 c-8-8
		db_query("UPDATE {grid_container_type} SET type='c-1d2-1d2' ".
					" WHERE type = 'C-6-6' OR type = 'C-8-8';");

		// sc-4 sc-6
		db_query("UPDATE {grid_container_type} SET type='sc-1d3' ".
					" WHERE type = 'SC-4' OR type = 'SC-6';");

		// c-0-4-4 c-0-6-6 && c-4-4-0 c-6-6-0
		db_query("UPDATE {grid_container_type} SET type='c-0-1d3-1d3', space_to_left='1d3' ".
					" WHERE type = 'C-0-4-4' OR type = 'C-0-6-6';");
		db_query("UPDATE {grid_container_type} SET type='c-1d3-1d3-0', space_to_right='1d3' ".
					" WHERE type = 'C-4-4-0' OR type = 'C-6-6-0';");

		// c-0-8 c-0-12 && c-8-0 c-12-0
		db_query("UPDATE {grid_container_type} SET type='c-2d3-0', space_to_right='1d3' ".
					" WHERE type = 'C-8-0' OR type = 'C-12-0';");
		db_query("UPDATE {grid_container_type} SET type='c-0-2d3', space_to_left='1d3' ".
					" WHERE type = 'C-0-8' OR type = 'C-0-12';");

		// c-2-2-2-2-0 c-3-3-3-3-0 and revers
		db_query("UPDATE {grid_container_type} SET type='c-1d6-1d6-1d6-1d6-0', space_to_right='1d3' ".
					" WHERE type = 'C-2-2-2-2-0' OR type = 'C-3-3-3-3-0';");
		db_query("UPDATE {grid_container_type} SET type='c-0-1d6-1d6-1d6-1d6', space_to_left='1d3' ".
					" WHERE type = 'C-0-2-2-2-2' OR type = 'C-0-3-3-3-3';");

		// c-0-4-0 c-0-6-0
		db_query("UPDATE {grid_container_type} SET type='c-0-1d3-0', space_to_left='1d3', space_to_right='1d3' ".
					" WHERE type = 'C-0-4-0' OR type = 'C-0-6-0';");

		// c-2-2-4-0 c-3-3-6-0
		db_query("UPDATE {grid_container_type} SET type='c-1d6-1d6-2d6-0', space_to_right='1d3' ".
					" WHERE type = 'C-2-2-4-0' OR type = 'C-3-3-6-0';");

		// c-4-2-2-0 c-6-3-3-0
		db_query("UPDATE {grid_container_type} SET type='c-2d6-1d6-1d6-0', space_to_right='1d3' ".
					" WHERE type = 'C-4-2-2-0' OR type = 'C-6-3-3-0';");

		// s-4-0 s-0-4 && s-6-0 s-0-6
		db_query("UPDATE {grid_container_type} SET type='s-0-1d3', space_to_left='2d3' ".
					" WHERE type = 'S-0-4' OR type = 'S-0-6';");
		db_query("UPDATE {grid_container_type} SET type='s-1d3-0', space_to_right='2d3' ".
					" WHERE type = 'S-4-0' OR type = 'S-6-0';");

		// I-0
		db_query("UPDATE {grid_container_type} SET type='i-0' ".
					" WHERE type = 'I-0';");

	}

	public function update_3() {
		db_query("alter table {grid_grid2container} drop foreign key fk_grid_container");
		db_query("alter table {grid_grid2container} add constraint {fk_grid_container} foreign key (container_id,grid_id,grid_revision) references {grid_container} (id, grid_id, grid_revision) on update cascade on delete cascade");
	}

	public function update_4(){
		db_query("alter table {grid_box_style} MODIFY slug VARCHAR(100) unique key");
		db_query("alter table {grid_slot_style} MODIFY slug VARCHAR(100) unique key");
		db_query("alter table {grid_container_style} MODIFY slug VARCHAR(100) unique key");
	}

}
