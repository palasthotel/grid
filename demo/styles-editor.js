import React from 'react';
import ReactDOM from 'react-dom';
import StylesEditor from '../src/component/styles-editor.js';

const container_styles = [{"title":"container-style1","slug":"c-slug1"},{"title":"container-style2","slug":"c-slug2"}];
const slot_styles = [{"title":"slot-style1","slug":"s-slug1"},{"title":"slot-style2","slug":"s-slug2"}];
const box_styles = [{"title":"box-style1","slug":"b-slug1"},{"title":"box-style2","slug":"b-slug2"}];

const styles = {
    container: {
        name: "Container Styles",
        styles: container_styles,
    },
    slot: {
        name: "Slot Styles",
        styles: slot_styles
    },
    box: {
        name: "Box Styles",
        styles: box_styles
    }
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