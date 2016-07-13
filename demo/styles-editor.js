import React from 'react';
import ReactDOM from 'react-dom';
import StylesEditor from '../src/component/styles-editor.js';

const container_styles = [{"style":"container-style1","slug":"c-slug1",name:"Container Style 1"},{"style":"container-style2","slug":"c-slug2",name:"Container Style 2"}];
const slot_styles = [{"style":"slot-style1","slug":"s-slug1",name:"Slot Style 1"},{"style":"slot-style2","slug":"s-slug2",name:"Slot Style 1"}];
const box_styles = [{"style":"box-style1","slug":"b-slug1",name:"Box Style 1"},{"style":"box-style2","slug":"b-slug2",name:"Box Style 2"}];

const styles = {
    container: container_styles,
    slot: slot_styles,
    box: box_styles,
};


/**
 * append app to grid app root
 */
ReactDOM.render(
  <StylesEditor
    styles={styles}
	/>,
  document.getElementById("styles-editor")
);