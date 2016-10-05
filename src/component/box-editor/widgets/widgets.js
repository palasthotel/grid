import React, {Component, PropTypes} from 'react';
import _ from 'underscore';
import ErrorWidget from './error.js';


/**
 * widgets component
 */
class Widgets extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		
		const {contentstructure, content} = this.props;
		const widgets = GRID.box_editor_widgets;
		
		let elements = [];
		
		for(let i = 0; i < contentstructure.length; i++){
			
			let cs = contentstructure[i];
			let key = (_.isUndefined(cs.key))? i: cs.key;
			let value = (_.isUndefined(content[key]))? "": content[key];
			
			/**
			 * if there is no widget registered
			 */
			let widget = widgets[cs.type];
			if(_.isUndefined(widget)){
				elements.push(<ErrorWidget
					{...cs}
					key={key}
				/>);
				continue;
			}
			
			/**
			 * else init widget
			 */
			elements.push(React.createElement(
				widget,
				{
					...cs,
					value: value,
					key: key,
					onChange: this.onChange.bind(this, key),
				}
			));
			
		}
		
		return (
			<div
				className="box-editor__widget-list"
			>
				{elements}
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChange(key, value){
		console.log("new value", key, value);
		this.props.onChangeContent(key, value);
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
Widgets.defaultProps = {
	content: {},
	contentstructure: [],
};

/**
 * define property types
 */
Widgets.propTypes = {
	content: PropTypes.object.isRequired,
	contentstructure: PropTypes.array.isRequired,
	onChangeContent: PropTypes.func.isRequired,
};



/**
 * export component to public
 */
export default Widgets;