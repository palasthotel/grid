<?php

use Palasthotel\Grid\WordPress\Plugin;

/**
 * Class grid_plugin
 * @deprecated use Palasthotel\Grid\WordPress\Plugin instead
 */
class grid_plugin extends Plugin{}

global $grid_plugin;
/**
 * @var Plugin $grid_plugin
 * @deprecated use Plugin::instance() instead
 */
$grid_plugin = Plugin::instance();