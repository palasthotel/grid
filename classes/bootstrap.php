<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid
 */
/**
* Initializes Grid boxes
*/
include dirname(__FILE__).'/constants/hook.php';
include dirname(__FILE__).'/grid_base.php';
include dirname(__FILE__).'/grid_box.php';

include dirname(__FILE__).'/grid_error_box.php';

include dirname(__FILE__).'/grid_static_box.php';
include dirname(__FILE__).'/grid_html_box.php';
include dirname(__FILE__).'/grid_video_box.php';
include dirname(__FILE__).'/grid_soundcloud_box.php';
include dirname(__FILE__).'/grid_plaintext_box.php';

include dirname(__FILE__).'/grid_list_box.php';
include dirname(__FILE__).'/grid_rss_box.php';

include dirname(__FILE__).'/grid_reference_box.php';

include dirname(__FILE__).'/grid_grid.php';
include dirname(__FILE__).'/grid_slot.php';
include dirname(__FILE__).'/grid_container.php';
include dirname(__FILE__).'/grid_db.php';

include dirname(__FILE__).'/ajax/grid_ajax_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_test_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_document_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_styles_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_container_editing_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_box_editing_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_permissions_component.php';
include dirname(__FILE__).'/ajax/grid_ajax_typeahead_component.php';

include dirname(__FILE__).'/grid_ajaxendpoint.php';

