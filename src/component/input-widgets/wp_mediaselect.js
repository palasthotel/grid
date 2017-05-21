import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ErrorWidget from './error.js';

class WPMediaselect extends Component {
	
	constructor(props){
		super(props);
		
		let value = props.value;
		if(typeof value !== typeof {}){
			value = {
				id: "",
			};
		}
		
		this.state = {
			value: value,
		};
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		// TODO: implement in working wordpress installation
		/**
		 * if try to use outside an wordpress
		 */
		if( typeof wp == typeof undefined || typeof wp.media == typeof undefined){
			return (
				<ErrorWidget
					message="I don't think this is a WordPress installation... sorry!"
				    type="wp_mediaselect"
				/>
			)
		}
		
		return (
			<div
				className="box-editor__widget widget__wp-media"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				<button
					className="widget__button"
					onClick={this.onClick.bind(this)}
				>
					Media
				</button>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onClick(){
		let self = this;
		const {media_type} = this.props;
		const {value} = this.state;
		let frame = wp.media({
			//title : lang_values['title-wp-media'],
			multiple : false,
			library : { type : media_type},
			button : { text : "Insert" },
		});
		frame.on('open',function() {
			let selection = frame.state().get('selection');
			let attachment = wp.media.attachment(value.id);
			selection.add( attachment ? [ attachment ] : [] );
		});
		frame.on('close',function() {
			let selection = frame.state().get('selection');
			console.log(selection);
			// jQuery.each(frame.state().get('selection')._byId, function(id, val) {
			// 	var sizes = val.get("sizes");
			// 	if(typeof sizes == "undefined"){
			// 		sizes = {
			// 			full: {
			// 				height: "",
			// 				width: "",
			// 				url: val.get("url"),
			// 				orientation: ""
			// 			}
			// 		};
			// 	}
			// 	var r_json = {
			// 		id: val.id,
			// 		size: "full",
			// 		sizes: sizes
			// 	};
			// 	self.$input.val(JSON.stringify(r_json));
			// 	self.buildImageSizeSelect();
			// 	self.buildImagePreview();
			// 	return false;
			// });
		});
		frame.open();
	}
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	getImage(){
		// TODO: ask server about the image
		// mime type, path, etc
		// info for visualisation
	}
}

/**
 * property defaults
 */
WPMediaselect.defaultProps = {
	value: {},
	label: "",
	media_type: "*",
};

/**
 * define property types
 */
WPMediaselect.propTypes = {
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default WPMediaselect;