import React, {Component, PropTypes} from 'react';

class BoxEditorControls extends Component{
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
			<ul
				className="box-editor__controls"
			>
				<li
					className="control__save"
				>
					<button
						className="control__button control__type_save">
						<i className="icon-ok" />
						Save
					</button>
				</li>
			</ul>
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

export default BoxEditorControls;

