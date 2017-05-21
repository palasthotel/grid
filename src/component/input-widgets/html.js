import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TinyMCE from 'react-tinymce';

class HtmlWidget extends Component {
	
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
	renderEditor(){
		if(typeof tinymce == typeof undefined){
			return (
				<p>No Editor found.</p>
			)
		} else {
			return(
				<TinyMCE
					content={this.state.value}
					id={this.parentpath}
					config={{
						menubar:false,
						plugins: 'link',
						toolbar: 'bold italic underline strikethrough | ' +
						'link unlink anker | ' +
						'bullist numlist blockquote | ' +
						'undo redo cleanup'
					}}
					onChange={this.onChange.bind(this)}
				/>
			)
		}
	}
	render() {
		let {id} = this.props;
		if(id == ""){
			
		}
		
		return (
			<div
				className="box-editor__widget widget__html"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				{this.renderEditor()}
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
HtmlWidget.defaultProps = {
	label: "",
	value: "",
	id: "",
};

/**
 * define property types
 */
HtmlWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default HtmlWidget;