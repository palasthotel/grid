import React, {Component, PropTypes} from 'react';


class Revision extends Component{
	render(){
		let draft = "";
		if(this.props.isDraft){
			draft = (
			  <button role="delete" class="grid-revision-button grid-revision-delete-button">
				  <i class="icon-trash" />Delete
			  </button>
			);
		}
		let dep = "";
		if(this.props.isDeprecated){
			dep = (
			    <button role="revert" class="grid-revision-button grid-revision-revert-button">
					<i class="icon-revert" />Revert
				</button>
			);
		}
		return (
		  <div className={`grid-revision grid-revision-state-${this.props.state}`}>
			  <div className="grid-revision-description">
				  <p className="grid-revision-date">{this.props.readable_date}</p>
				  <p className="grid-revision-editor">{this.props.editor}</p>
			  </div>
			  <div className="grid-revision-controls">
				  <button role="preview" className="grid-revision-button grid-revision-preview-button">
					  <i className="icon-preview" />Preview
				  </button>
				  {draft}
				  {dep}
			  </div>
		  </div>
		);
	}
}

export default class Revisions extends Component{
	constructor(props) {
		super(props);
	}
	renderRevision(revision){
		return (
		  <Revision
		    key={revision.revision}
		    {...revision}
			  />
		)
	}
	render(){
		return (
		  <div className="grid-revisions">
			  {this.props.list.map(this.renderRevision.bind(this))}
		  </div>
		);
	}
}

Revisions.propTypes = {
	list: PropTypes.array.isRequired
};