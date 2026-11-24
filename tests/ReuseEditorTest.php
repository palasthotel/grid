<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\API;
use Palasthotel\Grid\Editor;
use Palasthotel\Grid\ReuseBoxEditor;
use Palasthotel\Grid\ReuseContainerEditor;
use Palasthotel\Grid\Storage;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../components/grid_grid.php';
require_once __DIR__ . '/../components/grid_container.php';
require_once __DIR__ . '/../components/grid_slot.php';

class ReuseEditorTest extends TestCase {

	/** @var \Palasthotel\Grid\iTemplate */
	private $previousTemplate;

	/** @var string */
	private $templateFile;

	/** @var string */
	private $emptyFile;

	protected function setUp(): void {
		$property = new \ReflectionProperty( API::class, 'template' );
		$this->previousTemplate = $property->getValue();
		// a grid template that prints the epilog of every container, one per line
		$this->templateFile = tempnam( sys_get_temp_dir(), 'grid-tpl' );
		file_put_contents( $this->templateFile, '<?php foreach ( $this->container as $c ) { echo "[", $c->epilog, "]"; }' );
		$this->emptyFile = tempnam( sys_get_temp_dir(), 'grid-tpl' );
		$property->setValue( null, new class( $this->templateFile, $this->emptyFile ) implements \Palasthotel\Grid\iTemplate {
			private $file;
			private $empty;
			public function __construct( $file, $empty ) { $this->file = $file; $this->empty = $empty; }
			public function getPath( string $filename ) { return false; }
			public function grid( \grid_grid $grid ): string { return $this->file; }
			public function container( \grid_container $container ): string { return $this->empty; }
			public function slot( \grid_slot $slot ): string { return $this->empty; }
			public function box( \grid_box $box, bool $editmode ): string { return $this->empty; }
		} );
	}

	protected function tearDown(): void {
		( new \ReflectionProperty( API::class, 'template' ) )->setValue( null, $this->previousTemplate );
		unlink( $this->templateFile );
		unlink( $this->emptyFile );
	}

	private function boxStorage(): Storage {
		$box = $this->createMock( \grid_box::class );
		$box->boxid = 5;
		$box->reusetitle = 'Reusable';
		$storage = $this->createMock( Storage::class );
		$storage->method( 'getReuseableBoxIds' )->willReturn( array( 5 ) );
		$storage->method( 'getReusedBoxIds' )->willReturn( array( 5 ) );
		$storage->method( 'fireHookAlter' )->willReturnArgument( 1 );
		$storage->method( 'loadReuseBox' )->willReturn( $box );
		return $storage;
	}

	private function containerStorage( array $used ): Storage {
		$container = new \grid_container();
		$container->reusetitle = 'Reusable';
		$container->type = 'c-1d1';
		$storage = $this->createMock( Storage::class );
		$container->storage = $storage;
		$storage->method( 'getReuseContainerIds' )->willReturn( array( 7 ) );
		$storage->method( 'getReusedContainerIds' )->willReturn( $used );
		$storage->method( 'fireHookAlter' )->willReturnArgument( 1 );
		$storage->method( 'loadReuseContainer' )->willReturn( $container );
		return $storage;
	}

	private function boxEditor( Storage $storage ): ReuseBoxEditor {
		return new ReuseBoxEditor( new Editor( $storage, '', new NullHook() ) );
	}

	private function containerEditor( Storage $storage ): ReuseContainerEditor {
		return new ReuseContainerEditor( new Editor( $storage, '', new NullHook() ) );
	}

	public function test_box_list_has_no_trash_link_by_default() {
		$html = $this->boxEditor( $this->boxStorage() )->run(
			function ( $id ) { return "/edit/$id"; },
			function ( $id ) { return "/delete/$id"; }
		);
		// the box is in use: neither delete nor trash is offered
		$this->assertStringContainsString( '[]', $html );
		$this->assertStringNotContainsString( 'trash', $html );
	}

	public function test_box_list_offers_the_trash_link_even_for_used_boxes() {
		$html = $this->boxEditor( $this->boxStorage() )->run(
			function ( $id ) { return "/edit/$id"; },
			function ( $id ) { return "/delete/$id"; },
			function ( $id ) { return "/trash/$id?a=1&b=\"2\""; }
		);
		$this->assertStringContainsString( '<a href="/trash/5?a=1&amp;b=&quot;2&quot;">put to trash</a>', $html );
		$this->assertStringNotContainsString( '>delete<', $html );
	}

	public function test_container_list_has_no_trash_link_by_default() {
		$html = $this->containerEditor( $this->containerStorage( array() ) )->run(
			$this->containerStorage( array() ),
			function ( $id ) { return "/edit/$id"; },
			function ( $id ) { return "/delete/$id"; }
		);
		$this->assertStringContainsString( '>delete</a>', $html );
		$this->assertStringNotContainsString( 'trash', $html );
	}

	public function test_container_list_joins_delete_and_trash_link() {
		$storage = $this->containerStorage( array() );
		$html = $this->containerEditor( $storage )->run(
			$storage,
			function ( $id ) { return "/edit/$id"; },
			function ( $id ) { return "/delete/$id"; },
			function ( $id ) { return "/trash/$id"; }
		);
		$this->assertStringContainsString( '>delete</a> | <a class=\'btn-trash\' href="/trash/7">put to trash</a>', $html );
	}

	public function test_container_list_offers_only_trash_for_used_containers() {
		$storage = $this->containerStorage( array( 7 ) );
		$html = $this->containerEditor( $storage )->run(
			$storage,
			function ( $id ) { return "/edit/$id"; },
			function ( $id ) { return "/delete/$id"; },
			function ( $id ) { return "/trash/$id"; }
		);
		$this->assertStringContainsString( 'put to trash', $html );
		$this->assertStringNotContainsString( '>delete<', $html );
	}
}
