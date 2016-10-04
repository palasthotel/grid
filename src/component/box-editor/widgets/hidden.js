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
	value: 0
};

/**
 * define property types
 */
HiddenWidget.propTypes = {
	value: PropTypes.number.isRequired
};

/**
 * export component to public
 */
export default HiddenWidget;