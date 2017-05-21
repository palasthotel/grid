import React, {Component} from 'react';
import PropTypes from 'prop-types';

class DividerWidget extends Component {
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		return (
			<div
				className="box-editor__widget widget__divider"
			>
				{(this.props.text)}
			</div>
		)
	}
}
DividerWidget.defaultProps = {
	text: "",
}
DividerWidget.propTypes = {
	text: PropTypes.string,
}

export default DividerWidget;