<?php

namespace Palasthotel\Grid\Tests {

use Palasthotel\Grid\iHook;
use Palasthotel\Grid\iQuery;

/**
 * Records every statement instead of talking to a database.
 */
class RecordingQuery implements iQuery {

	/** @var string[] */
	public $statements = array();

	/** @var array<string, array> first matching pattern wins */
	public $rows = array();

	public function prefix() {
		return 'wp_';
	}

	public function execute( $sql ) {
		$this->statements[] = $sql;
		foreach ( $this->rows as $pattern => $rows ) {
			if ( preg_match( $pattern, $sql ) ) {
				return new FakeResult( $rows );
			}
		}
		return new FakeResult( array() );
	}

	public function prefixAndExecute( $sql ) {
		return $this->execute( $sql );
	}

	public function real_escape_string( $str ) {
		return addslashes( $str );
	}
}

class FakeResult {

	private $rows;

	public function __construct( array $rows ) {
		$this->rows = $rows;
	}

	public function fetch_assoc() {
		return array_shift( $this->rows );
	}

	public function fetch_object() {
		$row = array_shift( $this->rows );
		return $row === null ? null : (object) $row;
	}
}

class NullHook implements iHook {

	public function fire( $name, $arguments ) {
	}

	public function alter( $name, $value, $arguments ) {
		return $value;
	}
}

}

namespace {

	/**
	 * Smallest box Storage::parseBox() can build, so reuse boxes load without the components.
	 */
	#[\AllowDynamicProperties]
	class grid_test_box {

		public function type() {
			return 'test';
		}
	}
}
