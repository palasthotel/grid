<?php

namespace Palasthotel\Grid\Tests;

use Palasthotel\Grid\API;
use Palasthotel\Grid\Endpoint;
use PHPUnit\Framework\TestCase;

class ApiTest extends TestCase {

	private function api() {
		$api = ( new \ReflectionClass( API::class ) )->newInstanceWithoutConstructor();
		$property = new \ReflectionProperty( API::class, 'endpoint' );
		$property->setAccessible( true );
		$property->setValue( $api, new Endpoint() );
		return $api;
	}

	public function test_public_endpoint_methods_resolve() {
		$this->assertNotNull( $this->api()->resolveAjaxMethod( 'loadGrid' ) );
		// PHP method names are case-insensitive and the editor relies on it
		$this->assertNotNull( $this->api()->resolveAjaxMethod( 'getcontainerStyles' ) );
	}

	public function test_other_methods_do_not_resolve() {
		$api = $this->api();
		foreach ( array( '__construct', '__destruct', 'encodeBox', 'doesNotExist', '', null, array( 'loadGrid' ) ) as $method ) {
			$this->assertNull( $api->resolveAjaxMethod( $method ), var_export( $method, true ) );
		}
	}

	public function test_only_json_requests_are_accepted() {
		$_SERVER['CONTENT_TYPE'] = 'application/json; charset=utf-8';
		$this->assertTrue( API::isJsonRequest() );

		foreach ( array( 'text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data', '' ) as $type ) {
			$_SERVER['CONTENT_TYPE'] = $type;
			$this->assertFalse( API::isJsonRequest(), $type );
		}
		unset( $_SERVER['CONTENT_TYPE'] );
	}
}
