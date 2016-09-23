import React, {Component, PropTypes} from 'react';

class EditorInput extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
		}
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {placeholder, type, classname, disabled} = this.props;
		const {value} = this.state;
		return (
			<input
				placeholder={placeholder}
				type={type}
				value={value}
				className={`box-editor__input ${classname}`}
				onChange={this.onChange.bind(this)}
			    disabled={disabled}
			/>
		)
	}
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChange(event){
		this.setState({value:event.target.value});
		this.props.onChange(this.state.value);
	}
}

/**
 * property defaults
 */
EditorInput.defaultProps = {
	value: "",
	placeholder: "",
	type: "text",
	classname: "",
	disabeld: false,
};

/**
 * define property types
 */
EditorInput.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.string,
	type: PropTypes.string,
	classname: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

/**
 * export component to public
 */
export default EditorInput;