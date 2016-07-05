import React, {Component} from 'react';

export default class Buttons extends Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  <ul className="grid-tool-list grid-toolbar-state" role="data">

			  <li className="grid-tool grid-tool-publish">
				  <button role="publish"><span className="icon-publish" />Publish</button>
			  </li>
			  <li className="grid-tool grid-tool-preview">
				  <button role="preview"><span className="icon-preview" />Preview</button>
			  </li>
			  <li className="grid-tool grid-tool-revert">
				  <button role="revert"><span className="icon-revert" />Revert</button>
			  </li>
			  <li className="grid-tool grid-tool-revisions">
				  <button role="revisions"><span className="icon-revisions" />Revisions</button>
			  </li>
			  <li className="grid-tool grid-tool-authors">
				  <button role="authors"><span className="indicator-authors-count" />Authors</button>
			  </li>

		  </ul>
		);
	}
}