<?php

class grid_update
{
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
		db_query("update {grid_schema} set value=".$schema." where propkey='schema_version'");
	}
	
	public function getCurrentSchemaVersion()
	{
		try
		{
			$result=db_query("select value from {grid_schema} where propkey='schema_version'");
			foreach($result as $entry)
			{
				return $entry->value;
			}
		}
		catch(Exception $ex)
		{
			return 0;
		}
	}
	
	public function update_1()
	{
		db_query("create table {grid_schema} (propkey varchar(255),value varchar(255));");
		db_query("insert into {grid_schema} (propkey) values ('schema_version')");
	}

	public function update_2(){
		db_query("ALTER TABLE {grid_container_type} ADD dimension varchar(255) DEFAULT NULL AFTER `type`;");
		db_query("ALTER TABLE {grid_container_type} ADD space_to_right varchar(255) DEFAULT NULL AFTER `dimension`;");
		db_query("ALTER TABLE {grid_container_type} ADD space_to_left varchar(255) DEFAULT NULL AFTER `dimension`;");

		$result = db_query("SELECT * FROM {grid_container_type};");

		foreach ($result as $record) {
			$type = split("-", $recored->type);
			for($i = 1; $i < count($type); $i++){
				
			}
		}

		// c-12 c-18
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d1',1);");

		// c-4-4-4 c-6-6-6
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d3-1d3-1d3',3);");

		// c-8-4 c-4-8 c-6-12 c-12-6
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d3-2d3',2);");
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','2d3-1d3',2);");

		// c-2-2-2-2-2-2 c-3-3-3-3-3-3
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d6-1d6-1d6-1d6-1d6-1d6',6);");

		//c-3-3-3-3
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d4-1d4-1d4-1d4',4);");

		// c-6-6 c-8-8
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d2-1d2',2);");

		// sc-4 sc-6
		db_query("insert into {grid_container_type} (type, dimension, numslots) values ('c','1d1',1);");

		// c-0-4-4 c-0-6-6 && c-4-4-0 c-6-6-0
		db_query("insert into {grid_container_type} (type, dimension, space_to_left, numslots) values ('c','1d3-1d3', '1d3',2);");
		db_query("insert into {grid_container_type} (type, dimension, space_to_right, numslots) values ('c','1d3-1d3', '1d3',2);");

		// c-0-8 c-0-12 && c-8-0 c-12-0
		db_query("insert into {grid_container_type} (type, dimension, space_to_left, numslots) values ('c','2d3', '1d3',1);");
		db_query("insert into {grid_container_type} (type, dimension, space_to_right, numslots) values ('c','2d3', '1d3',1);");

		// s-4-0 s-0-4 && s-6-0 s-0-6
		db_query("insert into {grid_container_type} (type, dimension, space_to_left, numslots) values ('s','1d3', '2d3',1);");
		db_query("insert into {grid_container_type} (type, dimension, space_to_right, numslots) values ('s','1d3', '2d3',1);");

		// I-0
		db_query("insert into {grid_container_type} (type, numslots) values ('i','0', 0);");

	}

}