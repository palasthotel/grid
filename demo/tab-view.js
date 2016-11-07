import React from 'react';
import ReactDOM from 'react-dom';

import TabView from '../src/component/the-grid/sidebar/tab-view.js';
import ContainerTypes from '../src/component/the-grid/sidebar/container-types.js';


/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
var container_types = require('./dummy-data/container_types');
var box_types = require('./dummy-data/box_types');

/**
 * append app to grid app root
 */
ReactDOM.render(
	<TabView
		titles={["Container", "Box"]}
	>
		<ContainerTypes
			container_types={container_types}
		/>
		<div>Zwei</div>
	</TabView>,
	document.getElementById("demo")
);