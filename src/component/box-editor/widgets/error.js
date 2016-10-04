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
				<i>Unknown widget of type:</i> <b>{this.props.type}</b>
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