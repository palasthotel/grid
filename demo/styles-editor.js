import React from 'react';
import ReactDOM from 'react-dom';
import StylesEditor from '../src/component/styles-editor.js';

const container_styles = [{"title":"container-style1","slug":"c-slug1"},{"title":"container-style2","slug":"c-slug2"}];
const slot_styles = [{"title":"slot-style1","slug":"s-slug1"},{"title":"slot-style2","slug":"s-slug2"}];
const box_styles = [{"title":"box-style1","slug":"b-slug1"},{"title":"box-style2","slug":"b-slug2"}];

/**
 * append app to grid app root
 */
ReactDOM.render(
  <StylesEditor
    container={container_styles}
    slot={slot_styles}
    box={box_styles}
	/>,
  document.getElementById("styles-editor")
);