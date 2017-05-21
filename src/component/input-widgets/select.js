import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SelectWidget extends Component {
	
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
		const {selections, value} = this.props;
		return (
			<div
				className="box-editor__widget widget__select"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				<select
					value={this.state.value}
					className="widget__select"
				    onChange={this.onChange.bind(this)}
				>
					{selections.map((item)=>{
						return (
							<option
								key={item.key}
							    value={item.key}
							>
							{item.text}
							</option>
						)
					})}
				</select>
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
SelectWidget.defaultProps = {
	label: "",
	value: "",
	selections:[],
};

/**
 * define property types
 */
SelectWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
	selections: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default SelectWidget;