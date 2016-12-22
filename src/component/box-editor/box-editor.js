import React, {Component, PropTypes} from 'react';

import Controls from './controls.js';
import TextWithLink from './text-with-link.js';
import Collapsible from '../utils/collapsible.js';

import Widgets from './widgets/widgets.js';
import SelectWidget from './widgets/select.js';
import TextareaWidget from './widgets/textarea.js';
import HtmlWidget from './widgets/html.js';


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
				
				<Controls
				/>
				
				<div
					className="box-editor__content"
				>
					<div className="box-editor__header">
						<div
							className="box-editor__type">
							{type}
						</div>
						
						<TextWithLink
							className="box-editor__title"
							title="Boxtitle"
							onTextChange={this.onChangeTitle.bind(this)}
							onUrlChange={this.onChangeTitleUrl.bind(this)}
						/>
					</div>
					
					<Collapsible
						title="Prolog"
					>
						
						<HtmlWidget
							label="Prolog"
							value={this.state.content.prolog}
							onChange={this.onChangeProlog.bind(this)}
						/>
						
					</Collapsible>
					
					<Collapsible
						title="Spezific"
					    collapsed={false}
					>
						<Widgets
							content={content}
						    contentstructure={contentstructure}
						    onChangeContent={this.onChangeContent.bind(this)}
						/>
					</Collapsible>
					
					<Collapsible
						title="Epilog"
					>
						
						<HtmlWidget
							label="Epilog"
							value={this.state.content.epilog}
							onChange={this.onChangeEpilog.bind(this)}
						/>
						
						<TextWithLink
							title="Readmore"
							onTextChange={this.onChangeTitle.bind(this)}
							onUrlChange={this.onChangeTitleUrl.bind(this)}
						/>
						
					</Collapsible>
					
					<div className="box-editor__footer">
						
						<SelectWidget
							className="box-style"
							label="Box Style"
							value="1"
							selections={[{key:1,text:"eins"},{key:2, text: "zwei"}]}
							onChange={this.onChangeStyle.bind(this)}
						/>
						
					</div>
					
				</div>
			</div>
		);
	}
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChangeTitle(title){
		console.log(title);
	}
	onChangeTitleUrl(url){
		console.log(url);
	}
	onChangeEpilog(value){
		console.log(value);
	}
	onChangeProlog(value){
		console.log(value);
	}
	onChangeStyle(value){
		console.log("box style", value);
	}
	onChangeContent(key, value){
		this.state.content[key] = value;
		this.setState({content: this.state.content});
	}
}

BoxEditor.propTypes = {
	box: PropTypes.object.isRequired,
};
BoxEditor.defaultProps = {
};

export default BoxEditor;