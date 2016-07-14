import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/app';


/**
 * append app to grid app root
 */
ReactDOM.render(
  <App
    grid={grid}
    revisions={revisions}
    container_types={container_types}
    box_types={box_types}
	/>,
  document.getElementById("grid-app")
);