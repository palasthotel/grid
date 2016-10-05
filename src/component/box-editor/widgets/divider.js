import React, {Component, PropTypes} from 'react';

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