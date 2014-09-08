<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid-WordPress
 */

class grid_twitter_box extends grid_static_base_box {
	
	public function __construct() {
		$this->content = new Stdclass();
		$this->content->limit = 5;
		$this->content->user = '';
		$this->content->retweet = 'timeline';
	}
	
	public function type() {
		return 'twitter';
	}
	
	protected function prebuild() {
		if ( $this->content->user == '' ) {
			return '';
		}
		return NULL;
	}
	
	protected function fetch( $connection ) {
		if ( $this->content->retweet == 'retweets' ) {
			$result = $connection->get( 'https://api.twitter.com:443/1.1/search/tweets.json?src=typd&q='.$this->content->user );
			$result = $result->statuses;
		} else {
			$result = $connection->get( 'https://api.twitter.com:443/1.1/statuses/user_timeline.json', array( 'screen_name' => $this->content->user ) );
		}
		
		return $result;
	}

	public function build( $editmode ) {
		if( $editmode ) {
			return 'Twitter Box';
		} else {
			$prebuild = $this->prebuild();
			if ( $prebuild != NULL ) {
				return $prebuild;
			} else {
				$token = get_option( 'grid_twitterbox_accesstoken' );
				if( ! isset( $token['oauth_token'] ) || ! isset( $token['oauth_token_secret'] ) ) {
					return '';
				}
				$connection = new TwitterOAuth( get_option( 'grid_twitterbox_consumer_key', '' ), get_option( 'grid_twitterbox_consumer_secret', '' ), $token['oauth_token'], $token['oauth_token_secret'] );
				$result = $this->fetch( $connection );
				if ( count( $result ) > $this->content->limit ) {
					$result = array_slice( $result, 0, $this->content->limit );
				}
				ob_start();
				$content = $result;
				if ( file_exists( $this->storage->templatesPath.'/grid_twitterbox.tpl.php' ) ) {
					require ( $this->storage->templatesPath.'/grid_twitterbox.tpl.php' );
				} else {
					require ( 'grid_twitterbox.tpl.php' );
				}
				$result=ob_get_clean();
				return $result;
			}
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key' => 'limit',
				'type' => 'number',
				'label' => 'Anzahl der Einträge'
			),
			array(
				'key' => 'user',
				'type' => 'text',
				'label' => 'User'
			),
			array(
				'key' => 'retweet',
				'type' => 'select',
				'label' => t('Type'),
				'selections' => array(
					array(
						'key' => 'timeline',
						'text' => 'Timeline',
					),
					array(
						'key' => 'retweets',
						'text' => 'Retweets',
					),
				)
			),
		);
	}
	
	public function metaSearch( $criteria, $query ) {
		if ( get_option( 'grid_twitterbox_consumer_key', '' ) == '' || get_option( 'grid_twitterbox_consumer_secret', '' ) == '' || get_option( 'grid_twitterbox_accesstoken', '' ) == '' ) {
			return array();
		}
		return array( $this );
	}

}

class grid_twitter_hashtag_box extends grid_twitter_box {
	
	public function __construct() {
		$this->content = new Stdclass();
		$this->content->limit = 5;
		$this->content->hashtag = '';
	}

	public function type() {
		return 'twitter_hashtag';
	}
	
	public function fetch( $connection ) {
		$output = $connection->get( 'https://api.twitter.com:443/1.1/search/tweets.json', array( 'q' => $this->content->hashtag ) );
		if ( isset( $output->statuses ) ) {
			$result = $output->statuses;
		} else {
			$result = array();
		}
		return $result;
	}
	
	protected function prebuild() {
		if ( $this->content->hashtag == '' ) {
			return '';
		}
		return NULL;
	}
	
	public function build( $editmode ) {
		if( $editmode ) {
			return 'Twitter Hashtag Box';
		} else {
			return parent::build( $editmode );
		}
	}
	
	public function contentStructure () {
		return array(
			array(
				'key' => 'limit',
				'label' => 'Limit',
				'type' => 'number',
			),
			array(
				'key' => 'hashtag',
				'label' => 'Hashtag',
				'type' => 'text',
			),
		);
	}
}