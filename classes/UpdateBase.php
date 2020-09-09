<?php


namespace Palasthotel\Grid;


use Exception;

/**
 * @property iQuery query
 */
class UpdateBase {
	/**
	 * shema key for update shema identification
	 */
	var $schemaKey = "";

	/**
	 * UpdateBase constructor.
	 *
	 * @param iQuery $query
	 * @param string $schemaKey
	 */
	public function __construct(iQuery $query, $schemaKey = ""){
		$this->query     = $query;
		$this->schemaKey = $schemaKey;
	}

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
		$this->query->execute("update {grid_schema} set value=".$schema." where propkey='schema_version".$this->schemaKey . "'");
	}

	public function getCurrentSchemaVersion()
	{
		try
		{
			$result=$this->query->execute("select value from {grid_schema} where propkey='schema_version".$this->schemaKey . "'");
			$row = $result->fetch_object();
			return $row->value;
		}
		catch(Exception $ex){}
		return 0;
	}

	public function install(){
		$this->query->execute("insert into {grid_schema} (propkey) values ('schema_version".$this->schemaKey . "') ON DUPLICATE KEY UPDATE propkey = 'schema_version';");
		$this->markAsUpdated();
	}

}