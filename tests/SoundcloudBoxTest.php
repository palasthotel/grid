<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\API;
use Palasthotel\Grid\iHook;
use Palasthotel\Grid\Storage;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../components/grid_static_box.php';
require_once __DIR__ . '/../components/grid_soundcloud_box.php';

class SoundcloudBoxTest extends TestCase {

	public function test_requests_identify_as_grid_by_default() {
		$box = new \grid_soundcloud_box();
		$this->assertStringContainsString( 'grid/3', $box->userAgent() );

		$box->storage = new Storage( new RecordingQuery(), new NullHook(), 'test' );
		$this->assertStringStartsWith( 'Mozilla/5.0 (compatible; grid/3;', $box->userAgent() );
	}

	public function test_projects_can_change_the_user_agent() {
		$hook = new class implements iHook {
			public $seen = array();
			public function fire( $name, $arguments ) {
			}
			public function alter( $name, $value, $arguments ) {
				$this->seen[] = $name;
				return $name === API::ALTER_SOUNDCLOUD_USER_AGENT ? 'Project/1.0' : $value;
			}
		};
		$box = new \grid_soundcloud_box();
		$box->storage = new Storage( new RecordingQuery(), $hook, 'test' );

		$this->assertSame( 'Project/1.0', $box->userAgent() );
		$this->assertSame( array( 'soundcloud_user_agent' ), $hook->seen );
	}
}
