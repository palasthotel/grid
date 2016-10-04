import React, {Component, PropTypes} from 'react';

class InfoWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			value: props.value,
		};
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	renderLabel(){
		if(typeof this.props.label !== typeof undefined && this.props.label != ""){
			return (
				<label
					className="widget__label widget-text__label"
				>
					{this.props.label}
				</label>
			)
		}
	}
	render() {
		return (
			<div
				className="box-editor__widget widget__text"
			>
				{this.renderLabel()}
				<p>{this.props.text}</p>
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
InfoWidget.defaultProps = {
	label: "",
	text: "",
};

/**
 * define property types
 */
InfoWidget.propTypes = {
	label: PropTypes.string,
	text: PropTypes.string,
};

/**
 * export component to public
 */
export default InfoWidget;