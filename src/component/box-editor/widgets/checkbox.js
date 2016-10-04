import React, {Component, PropTypes} from 'react';

class CheckboxWidget extends Component {
	
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
				className="box-editor__widget widget__text"
			>
				<label
					className="widget__label widget-text__label"
				>
					{this.props.label}
				</label>
				<input
					className="widget__checkbox widget-text__checkbox"
					type="checkbox"
					checked={this.state.value}
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
CheckboxWidget.defaultProps = {
	label: "",
	value: false,
};

/**
 * define property types
 */
CheckboxWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.bool
		]).isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default CheckboxWidget;