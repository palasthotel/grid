import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
					className="widget__label"
				>
					{this.props.label}
				</label>
			)
		}
	}
	render() {
		return (
			<div
				className="box-editor__widget widget__info"
			>
				{this.renderLabel()}
				<div
					className="widget__text"
					dangerouslySetInnerHTML={{__html: this.props.text}}
				/>
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