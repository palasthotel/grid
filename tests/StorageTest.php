<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\Storage;
use PHPUnit\Framework\TestCase;

class StorageTest extends TestCase {

	private function storage( RecordingQuery $query ) {
		return new Storage( $query, new NullHook(), 'test' );
	}

	private function boxRow() {
		$row = array( 'box_id' => 3, 'box_type' => 'test', 'box_content' => '{}' );
		foreach ( array( 'style', 'style_label', 'reusetitle', 'title', 'titleurl', 'titleurltarget', 'prolog', 'epilog', 'readmore', 'readmoreurl', 'readmoreurltarget' ) as $key ) {
			$row[ 'box_' . $key ] = '';
		}
		return $row;
	}

	private function containerRow() {
		$row = array( 'container_id' => 3, 'slot_id' => 1, 'slot_style' => '', 'box_type' => null );
		foreach ( array( 'reuse_title', 'style', 'style_label', 'type', 'type_id', 'space_to_left', 'space_to_right', 'title', 'titleurl', 'titleurltarget', 'prolog', 'epilog', 'readmore', 'readmoreurl', 'readmoreurltarget' ) as $key ) {
			$row[ 'container_' . $key ] = '';
		}
		return $row;
	}

	public function test_grid_ids_are_used_as_integers() {
		$query = new RecordingQuery();
		$query->rows = array(
			'/max\(revision\)/' => array( array( 'revision' => 1 ) ),
			'/select published/' => array( array( 'published' => 0 ) ),
		);

		$this->storage( $query )->loadGrid( '7 OR SLEEP(3)' );

		$this->assertNotEmpty( $query->statements );
		foreach ( $query->statements as $sql ) {
			$this->assertStringNotContainsString( 'SLEEP', $sql );
		}
		$this->assertStringContainsString( 'where id=7 and published=1', $query->statements[0] );
	}

	public function test_reuse_ids_are_used_as_integers() {
		foreach ( array( 'box:3 OR 1=1', 'container:3 OR 1=1' ) as $id ) {
			$query = new RecordingQuery();
			$query->rows = array(
				'/grid_box\.id=/' => array( $this->boxRow() ),
				'/grid_container\.id=/' => array( $this->containerRow() ),
			);
			$this->storage( $query )->loadGrid( $id );
			foreach ( $query->statements as $sql ) {
				$this->assertStringNotContainsString( 'OR 1=1', $sql, $id );
			}
		}
	}

	public function test_style_values_are_escaped() {
		$query = new RecordingQuery();
		$this->storage( $query )->createBoxStyle( "x' OR '1'='1", 'label\\' );

		$this->assertSame(
			"insert into wp_grid_box_style (slug,style) values ('x\\' OR \\'1\\'=\\'1','label\\\\')",
			$query->statements[0]
		);
	}

	public function test_style_ids_are_used_as_integers() {
		$query = new RecordingQuery();
		$storage = $this->storage( $query );
		$storage->deleteBoxStyle( '3 OR 1=1' );
		$storage->updateContainerStyle( '4 OR 1=1', 'slug', 'Style' );

		$this->assertStringEndsWith( 'where id=3', $query->statements[0] );
		$this->assertStringEndsWith( 'where id=4', $query->statements[1] );
	}

	public function test_revision_paging_uses_integers() {
		$query = new RecordingQuery();
		$this->storage( $query )->fetchGridRevisions( '5 OR 1=1', '2 OR 1=1' );

		$this->assertStringEndsWith( 'WHERE id = 5 ORDER BY revision DESC LIMIT 20 OFFSET 40', $query->statements[0] );
	}

	public function test_unknown_container_type_is_rejected() {
		$query = new RecordingQuery();
		$grid = new \Palasthotel\Grid\Model\Grid();
		$grid->gridid = 1;
		$grid->gridrevision = 0;

		$this->expectException( \Exception::class );
		try {
			$this->storage( $query )->createContainer( $grid, "c-1d1' OR '1'='1" );
		} finally {
			$this->assertStringContainsString( "type='c-1d1\\' OR \\'1\\'=\\'1'", $query->statements[0] );
		}
	}
}
