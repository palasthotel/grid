import React from 'react';
import ReactDOM from 'react-dom';
import ContainerEditor from '../src/component/container-factory/container-factory.js';
import ContainerTypes from '../src/component/container-factory/container-types.js';

/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
var container_types = require('./dummy-data/container_types');



/**
 * append app to grid app root
 */
ReactDOM.render(
	<div className="grid-container-factory">
		<ContainerEditor />
		<ContainerTypes
			container_types={container_types}
        />
	</div>,
  document.getElementById("container-factory")
);