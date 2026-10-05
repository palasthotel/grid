<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\API;
use Palasthotel\Grid\Core;
use Palasthotel\Grid\Storage;
use PHPUnit\Framework\TestCase;

/**
 * Stands in for Endpoint: one write and one read method, and a record of what ran.
 */
class FakeEndpoint {
	public $storage;
	public $calls = array();

	public function createBox( $gridid ) {
		$this->calls[] = 'createBox';
		return 'created';
	}

	public function loadGrid( $gridid ) {
		$this->calls[] = 'loadGrid';
		return 'loaded';
	}
}

class VersionCheckTest extends TestCase {

	/** @var RecordingQuery */
	private $query;

	/** @var FakeEndpoint */
	private $endpoint;

	private function api( $storedVersion = 5 ) {
		$this->query = new RecordingQuery();
		$this->query->rows = array( '/max\(changed\)/' => array( array( 'changed' => $storedVersion ) ) );
		$this->endpoint = new FakeEndpoint();

		$core = ( new \ReflectionClass( Core::class ) )->newInstanceWithoutConstructor();
		$core->storage = new Storage( $this->query, new NullHook(), 'test' );

		$api = ( new \ReflectionClass( API::class ) )->newInstanceWithoutConstructor();
		foreach ( array( 'core' => $core, 'endpoint' => $this->endpoint ) as $name => $value ) {
			$property = new \ReflectionProperty( API::class, $name );
			$property->setValue( $api, $value );
		}
		return $api;
	}

	private function touched() {
		return count( preg_grep( '/set changed=changed\+1 where id=7$/', $this->query->statements ) );
	}

	public function test_a_write_with_the_current_version_runs_and_counts_up() {
		$response = $this->api( 5 )->dispatch( (object) array( 'method' => 'createBox', 'params' => array( '7' ), 'version' => 5 ) );

		$this->assertSame( 200, $response['status'] );
		$this->assertSame( 'created', $response['body']['result'] );
		$this->assertArrayHasKey( 'version', $response['body'] );
		$this->assertSame( 1, $this->touched() );
	}

	public function test_a_write_with_an_outdated_version_is_rejected() {
		$response = $this->api( 5 )->dispatch( (object) array( 'method' => 'createBox', 'params' => array( '7' ), 'version' => 4 ) );

		$this->assertSame( 409, $response['status'] );
		$this->assertSame( 'conflict', $response['body']['error'] );
		$this->assertSame( 5, $response['body']['version'] );
		$this->assertSame( array(), $this->endpoint->calls );
		$this->assertSame( 0, $this->touched() );
	}

	public function test_a_write_without_version_is_not_checked() {
		$response = $this->api( 5 )->dispatch( (object) array( 'method' => 'CREATEBOX', 'params' => array( 7 ) ) );

		$this->assertSame( 200, $response['status'] );
		$this->assertSame( 1, $this->touched() );
	}

	public function test_reads_are_never_rejected_and_report_the_version() {
		$response = $this->api( 5 )->dispatch( (object) array( 'method' => 'loadGrid', 'params' => array( '7' ), 'version' => 1 ) );

		$this->assertSame( 200, $response['status'] );
		$this->assertSame( 5, $response['body']['version'] );
		$this->assertSame( 0, $this->touched() );
	}

	public function test_reusable_boxes_are_not_version_checked() {
		$response = $this->api( 5 )->dispatch( (object) array( 'method' => 'createBox', 'params' => array( 'box:3' ), 'version' => 1 ) );

		$this->assertSame( 200, $response['status'] );
		$this->assertArrayNotHasKey( 'version', $response['body'] );
		$this->assertSame( array(), preg_grep( '/changed=changed\+1/', $this->query->statements ) );
	}

	public function test_unknown_methods_are_rejected() {
		$response = $this->api()->dispatch( (object) array( 'method' => '__construct', 'params' => array() ) );

		$this->assertSame( 400, $response['status'] );
	}
}
