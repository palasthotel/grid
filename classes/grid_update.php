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
}