import React, {Component, PropTypes} from 'react';

class ErrorWidget extends Component {
	
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {type, message} = this.props;
		return (
			<div className="box-editor__widget widget__error">
				<label
				className="widget__label"
				>
					{message}
				</label>
				<div>{type}</div>
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
	message: "Unknown widget of type:",
	type: "unknown",
};

/**
 * export component to public
 */
export default ErrorWidget;