import React, {Component, PropTypes} from 'react';
import _ from 'underscore';
import ErrorWidget from './widgets/error.js';

class Widgets extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		
	}
	
	componentWillUnmount() {
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		
		const widgets = GRID.box_editor_widgets;
		const {contentstructure, content} = this.props.box;
		
		let elements = [];
		for(let i = 0; i < contentstructure.length; i++){
			
			let cs = contentstructure[i];
			let key = (_.isUndefined(cs.key))? i: cs.key;
			
			/**
			 * if there is no widget registered
			 */
			let widget = widgets[cs.type];
			if(_.isUndefined(widget)){
				elements.push(<ErrorWidget
					key={key}
					type={cs.type}
					constentstructure={cs}
				/>);
				continue;
			}
			
			/**
			 * else init widget
			 */
			elements.push(React.createElement(
				widget,
				{
					key: key,
					content: content[key],
					onChange: this.onChangeWidget(key, value),
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
	onChangeWidget(key, value){
		console.log("new value", key, value);
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
};

/**
 * define property types
 */
Widgets.propTypes = {
	box: PropTypes.object.isRequired,
};

/**
 * export component to public
 */
export default Widgets;