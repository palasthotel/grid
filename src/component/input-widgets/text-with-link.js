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
			onTextChange,
			onUrlChange,
			urlDeleteText,
			urlAddText,
			className,
		} = this.props;
		
		
		const {show_link_input} = this.state;
		
		return (
			<div
				className={`${className} editor__text-with-link`}
			>
				<label
					className="text-with-link__label">
					{title}
				</label>


				<input
					placeholder={title_placeholder}
					type="text"
					value={text}
					className="text-with-link__input"
					onChange={onTextChange}
				/>
				
				<div
					className={`editor__url-builder ${(show_link_input)? "is-active": "is-inactive" }`}
				>
					<input
						placeholder="Title URL (for internals links, please use a relative path starting with '/'):"
						type="text"
						value={url}
						className="url-builder__title-url"
						onChange={onUrlChange}
						disabled={!show_link_input}
					/>
					
					<button
						className="url-builder__button"
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
		if(this.state.show_link_input){
			this.state.value = '';
		}
		this.setState({show_link_input: !this.state.show_link_input});
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