import React, {Component, PropTypes} from 'react';

class BoxEditorFooter extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props) {
		super(props);
	}
	/**
	 * ---------------------
	 * render
	 * ---------------------
	 */
	render(){
		return (
			<div
				className="box-editor__footer"
			>
				<div
					className="grid-editor-styles-wrapper"
				>
					<label>
						Boxstyle
					</label>
					
					<select
						name="grid-editor-style"
						className="form-select grid-editor-style"
						id="grid-editor-style"
					>
						<option value="">Default style</option>
					</select>
				</div>
			</div>
		);
	}
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}

export default BoxEditorFooter;

