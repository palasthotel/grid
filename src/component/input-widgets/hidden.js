import React, {Component} from 'react';
import PropTypes from 'prop-types';

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