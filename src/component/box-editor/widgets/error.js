import React, {Component, PropTypes} from 'react';

class ErrorWidget extends Component {
	
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		return (
			<div className="box-editor__widget widget__error">
				<label
				className="widget__label"
				>
					Unknown widget of type:
				</label>
				<div>{this.props.type}</div>
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

/**
 * property defaults
 */
ErrorWidget.defaultProps = {
	type: "unknown",
};

/**
 * export component to public
 */
export default ErrorWidget;