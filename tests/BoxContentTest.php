<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\Storage;
use PHPUnit\Framework\TestCase;

class BoxContentTest extends TestCase {

	public function test_missing_fields_keep_their_defaults() {
		$box = new \grid_test_box();
		$box->setContent( (object) array( 'title' => 'given' ) );

		$this->assertSame( 'given', $box->content->title );
		$this->assertSame( 3, $box->content->count );
	}

	public function test_empty_content_falls_back_to_the_defaults() {
		foreach ( array( null, '', array(), new \stdClass() ) as $content ) {
			$box = new \grid_test_box();
			$box->setContent( $content );
			$this->assertSame( 'default', $box->content->title );
			$this->assertSame( 3, $box->content->count );
		}
	}

	public function test_stored_content_is_merged_over_the_defaults() {
		$query = new RecordingQuery();
		$query->rows = array( '/grid_box\.id=/' => array( array(
			'box_id' => 3, 'box_type' => 'test', 'box_content' => '{"title":"stored"}',
			'box_style' => '', 'box_style_label' => '', 'box_reusetitle' => '', 'box_title' => '',
			'box_titleurl' => '', 'box_titleurltarget' => '', 'box_prolog' => '', 'box_epilog' => '',
			'box_readmore' => '', 'box_readmoreurl' => '', 'box_readmoreurltarget' => '',
		) ) );

		$box = ( new Storage( $query, new NullHook(), 'test' ) )->loadReuseBox( 3 );

		$this->assertSame( 'stored', $box->content->title );
		$this->assertSame( 3, $box->content->count );
	}

	public function test_a_missing_reuse_box_loads_as_error_box() {
		$box = ( new Storage( new RecordingQuery(), new NullHook(), 'test' ) )->loadReuseBox( 99 );

		$this->assertInstanceOf( \grid_error_box::class, $box );
	}
}
