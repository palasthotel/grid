import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TextareaWidget extends Component {
	
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
	render() {
		return (
			<div
				className="box-editor__widget widget__textarea"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				<textarea
					className="widget__input"
					type="text"
					value={this.state.value}
					onChange={this.onChange.bind(this)}
				/>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChange(e){
		let value = e.target.value;
		this.setState({value: value});
		this.props.onChange(value);
	}
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
}

/**
 * property defaults
 */
TextareaWidget.defaultProps = {
	label: "",
	value: "",
};

/**
 * define property types
 */
TextareaWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default TextareaWidget;