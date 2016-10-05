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
				className="box-editor__widget widget__checkbox"
			>
				<label
					className="widget__label"
				>
					<input
						className="widget__input"
						type="checkbox"
						checked={this.state.value}
						onChange={this.onChange.bind(this)}
					/>
					{this.props.label}
				</label>
				
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChange(e){
		this.setState({value: e.target.checked});
		this.props.onChange(e.target.checked);
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