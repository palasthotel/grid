import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TextWithLink extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {
			show_link_input: props.showLinkInput,
		}
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {
			title,
			title_placeholder,
			text,
			url,
			urlDeleteText,
			urlAddText,
			className,
		} = this.props;
		
		
		const {show_link_input} = this.state;
		
		return (
			<div
				className={`${className} widget__text-with-link`}
			>
				<label
					className="widget__text-with-link--label">
					{title}
				</label>


				<input
					placeholder={title_placeholder}
					type="text"
					value={text}
					className="widget__text-with-link--input"
					onChange={this.onTextChange.bind(this)}
				/>
				
				<div
					className={`widget__url-builder ${(show_link_input)? "is-active": "is-inactive" }`}
				>
					<input
						placeholder="Title URL (for internals links, please use a relative path starting with '/'):"
						type="text"
						value={url}
						className="widget__url-builder--url"
						onChange={this.onUrlChange.bind(this)}
						disabled={!show_link_input}
					/>
					
					<button
						className="widget__url-builder--button"
					    onClick={this.onToggleLink.bind(this)}
					>
						{(show_link_input)? urlDeleteText: urlAddText}
					</button>
				</div>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onToggleLink(){
		this.setState({show_link_input: !this.state.show_link_input});
		this.props.onUrlChange("");
	}
	onTextChange(e){
		this.props.onTextChange(e.target.value);
	}
	onUrlChange(e){
		this.props.onUrlChange(e.target.value);
	}
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
}

TextWithLink.defaultProps = {
	title: null,
	title_placeholder: "Title",
	text: "",
	url: "",
	showLinkInput: false,
	urlDeleteText: "Delete Link",
	urlAddText: "Add Link",
	className: "",
};

TextWithLink.propTypes = {
	title: PropTypes.string,
	title_placeholder: PropTypes.string,
	text: PropTypes.string,
	url: PropTypes.string,
	onTextChange: PropTypes.func.isRequired,
	onUrlChange: PropTypes.func.isRequired,
	showLinkInput: PropTypes.bool,
	urlDeleteText: PropTypes.string,
	urlAddText: PropTypes.string,
};

export default TextWithLink;