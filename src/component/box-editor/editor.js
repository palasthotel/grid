import React, {Component, PropTypes} from 'react';

import Controls from './controls.js';
import TextWithLink from './text-with-link.js';
import Collapsible from './collapsible.js';

import Widgets from './widgets.js';

import BoxEditorHeader from './editor-header.js';
import Prolog from './editor-prolog.js';
import Epilog from './editor-epilog.js';
import Footer from './editor-footer.js';


class BoxEditor extends Component{
	constructor(props) {
		super(props);
		this.state = {
			content: props.box.content,
		}
		
	}
	render(){
		const {type, title, titleurl, contentstructure} = this.props.box;
		const {content} = this.state;
		return (
			<div
				className="box-editor"
			>
				<Controls/>
				<div
					className="box-editor__content">
					<div
						className="box-editor__type">
						Boxtype: {type}
					</div>
					
					<TextWithLink
						title="Boxtitle"
						onTextChange={this.onTitleChange.bind(this)}
						onUrlChange={this.onTitleUrlChange.bind(this)}
					/>
					
					<Collapsible
						title="Prolog"
					>
						<p>Hier kommt der Prolog hin</p>
					</Collapsible>
					
					<Collapsible
						title="Spezific"
					    collapsed={false}
					>
						<Widgets
							content={content}
						    contentstructure={contentstructure}
						    onChangeContent={this.onContentChange.bind(this)}
						/>
					</Collapsible>
					
					<Collapsible
						title="Epilog"
					>
						<p>Hier kommt der Epilog</p>
						
						<TextWithLink
							title="Readmore"
							onTextChange={this.onTitleChange.bind(this)}
							onUrlChange={this.onTitleUrlChange.bind(this)}
						/>
						
					</Collapsible>
						
				</div>
			</div>
		);
	}
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onTitleChange(title){
		console.log(title);
	}
	onTitleUrlChange(url){
		console.log(url);
	}
	onContentChange(content){
		console.log("content change", content);
		this.state.content = content;
		this.setState({content: this.state.content});
	}
}

BoxEditor.propTypes = {
	box: PropTypes.object.isRequired,
};
BoxEditor.defaultProps = {
};

export default BoxEditor;