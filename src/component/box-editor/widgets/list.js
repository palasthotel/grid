import React, {Component, PropTypes} from 'react';
import _ from 'underscore';

import Widgets from '../widgets.js';

class ListWidgetItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			content: this.props.content,
		}
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render(){
		return (
			<Widgets
				content={this.state.content}
				contentstructure={this.props.contentstructure}
				onChangeContent={this.onChangeContent.bind(this)}
			/>
		)
	}
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChangeContent(value, key){
		console.log("list item content change", value, key);
		this.props.onChange(this.state.content);
	}
}
/**
 * property defaults
 */
ListWidgetItem.defaultProps = {
	content: {},
	contentstructure: [],
};

/**
 * define property types
 */
ListWidgetItem.propTypes = {
	content: PropTypes.object.isRequired,
	contentstructure: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
};

class ListWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			contents: this.props.value,
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
				className="box-editor__widget widget__list"
			>
				<label
				>
					{this.props.label}
					</label>
				<button
					onClick={this.onAddItem.bind(this)}
				>
					Add Item
				</button>
				
				<div>
					{this.state.contents.map((content, index) =>{
						return (
							<ListWidgetItem
								key={index}
								content={content}
								contentstructure={this.props.contentstructure}
								onChange={this.onChange.bind(this,index)}
							/>
						)
					} )}
				</div>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChange(index, content){
		console.log("list content change", index, content);
		this.state.contents[index] = content;
		this.setState({contents: this.state.contents})
		this.props.onChange(this.state.contents);
	}
	onAddItem(){
		console.log("Add Item");
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
ListWidget.defaultProps = {
	label: "",
	value: {},
	contentstructure: [],
};

/**
 * define property types
 */
ListWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default ListWidget;