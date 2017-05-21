import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Revision extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {editor,date, state} = this.props;
		const readable_date = new Date(parseInt(date)*1000).toDateString();
		
		const controls = [];
		
		controls.push(
			<button
				key="preview"
				className="grid-revision__button grid-revision__button-preview"
			    onClick={this.props.onPreview}
			>
				Preview
			</button>
		);
		if(state === "draft"){
			controls.push(
				<button
					key="delete"
					className="grid-revision__button grid-revision__button-delete"
				    onClick={this.props.onDelete}
				>
					Delete
				</button>
			);
		} else if(state === "deprecated"){
			controls.push(
				<button
					key="revert"
					className="grid-revision__button grid-revision__button-revert"
				    onClick={this.props.onRevert}
				>
					Revert
				</button>
			);
		}
		
		return (
			<div
				className="grid-revision"
			>
				<div className="grid-revision__description">
					<p className="grid-revision__date">{readable_date}</p>
					<p className="grid-revision__editor">{editor}</p>
				</div>
				<div
					className="grid-revision-controls"
				>
					{controls}
				</div>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
}

Revision.defaultProps = {
	onPreview: ()=>{},
	onDelete: ()=>{},
	onRevert: ()=>{},
}

/**
 * define property types
 */
Revision.propTypes = {
	date: PropTypes.string.isRequired,
	editor: PropTypes.string.isRequired,
	published: PropTypes.string.isRequired,
	revision: PropTypes.string.isRequired,
	state: PropTypes.string.isRequired,
	
	onPreview: PropTypes.func,
	onRevert: PropTypes.func,
	onDelete: PropTypes.func,
};

/**
 * export component to public
 */
export default Revision;