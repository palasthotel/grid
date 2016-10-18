import React, {Component, PropTypes} from 'react';

class MultiAutocompleteWidget extends Component {
	
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
				className="box-editor__widget widget__autocomplete"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				<input
					className="widget__input"
					type="text"
					value={this.state.value}
					onChange={this.onChange.bind(this)}
				/>
				<div
					className="widget_list"
				>
					LIST
				</div>
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
MultiAutocompleteWidget.defaultProps = {
	label: "",
	value: "",
};

/**
 * define property types
 */
MultiAutocompleteWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default MultiAutocompleteWidget;