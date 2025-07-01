<?php


namespace Palasthotel\Grid;

abstract class AbstractQuery implements iQuery {

    public string $prefix;

	public function prepare($sql){
		$sql = str_replace( '{', $this->prefix(), $sql );
		$sql = str_replace( '}', '', $sql );
		return $sql;
	}

	public function prefixAndExecute($sql){
		return $this->execute($this->prepare($sql));
	}

}