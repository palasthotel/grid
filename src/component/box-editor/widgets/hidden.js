import React, {Component, PropTypes} from 'react';

class HiddenWidget extends Component {
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		return (
			<input
				type="hidden"
				className="box-editor__widget widget__hidden"
				value={this.props.value}
			/>
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
HiddenWidget.defaultProps = {
	value: "",
};

/**
 * define property types
 */
HiddenWidget.propTypes = {
	value: PropTypes.string.isRequired
};

/**
 * export component to public
 */
export default HiddenWidget;