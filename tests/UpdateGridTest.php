<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\UpdateGrid;
use PHPUnit\Framework\TestCase;

class UpdateGridTest extends TestCase {

	public function test_update_9_removes_duplicates_before_adding_each_unique_key() {
		$query = new RecordingQuery();
		( new UpdateGrid( $query ) )->update_9();

		$this->assertCount( 6, $query->statements );
		foreach ( array( 'grid_grid2container' => 'container_id', 'grid_container2slot' => 'slot_id', 'grid_slot2box' => 'box_id' ) as $table => $column ) {
			$delete = array_keys( preg_grep( '/^DELETE newer FROM \{' . $table . '\}.*newer\.' . $column . '=older\.' . $column . ' AND newer\.id>older\.id;$/', $query->statements ) );
			$alter  = array_keys( preg_grep( '/^ALTER TABLE \{' . $table . '\} ADD UNIQUE KEY \w+ \(grid_id, grid_revision, ' . $column . '\);$/', $query->statements ) );
			$this->assertCount( 1, $delete, $table );
			$this->assertCount( 1, $alter, $table );
			$this->assertLessThan( $alter[0], $delete[0], $table );
		}
	}

	public function test_fresh_installs_get_the_same_unique_keys() {
		$core = ( new \ReflectionClass( \Palasthotel\Grid\Core::class ) )->newInstanceWithoutConstructor();
		$schema = $core->getDatabaseSchema();

		$this->assertSame( array( 'grid_id', 'grid_revision', 'container_id' ), $schema['grid_grid2container']['unique keys']['container_once'] );
		$this->assertSame( array( 'grid_id', 'grid_revision', 'slot_id' ), $schema['grid_container2slot']['unique keys']['slot_once'] );
		$this->assertSame( array( 'grid_id', 'grid_revision', 'box_id' ), $schema['grid_slot2box']['unique keys']['box_once'] );
	}
}
