import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextWithLink from '../input-widgets/text-with-link.js';
import Collapsible from '../utils/collapsible.js';

import Widgets from '../input-widgets/widgets.js';
import SelectWidget from '../input-widgets/select.js';
import TextareaWidget from '../input-widgets/textarea.js';
import HtmlWidget from '../input-widgets/html.js';

import {
	findBoxPath,
} from '../../helper/store-iterator'


class BoxEditor extends Component{
	constructor(props) {
		super(props);
		this.state = {
			...props.box,
		}
		
	}
	render(){
		const {id} = this.props;
		const {
			type, title, titleurl,
			contentstructure, content,
			prolog, epilog, readmore, readmoreurl,
			style
		} = this.state;

		return (
			<div
				className="grid-box-editor"
			>
				<nav>
					<ul
						className="grid-box-editor__menu"
					>
						<li
							className="grid-box-editor__menu--item"
						>
							<button
								onClick={this.onSave.bind(this)}
							>
								Save
							</button>
						</li>
						<li
							className="grid-box-editor__menu--item"
						>
							<button
								onClick={this.props.onDiscardBoxeditor}
							>
								Discard
							</button>
						</li>
						<li
							className="grid-box-editor__menu--item"
						>
							<button
								onClick={this.props.onReuseBoxeditor}
							>
								Reuse
							</button>
						</li>
					</ul>
				</nav>
				
				<div
					className="grid-box-editor__content"
				>
					<div className="grid-box-editor__header">
						<div
							className="grid-box-editor__type">
							{type}
						</div>
						
						<TextWithLink
							className="grid-box-editor__title"
							title="Boxtitle"
							text={title}
							url={titleurl}
							onTextChange={this.onChangeBoxState.bind(this, "title")}
							onUrlChange={this.onChangeBoxState.bind(this, "titleurl")}
						/>
					</div>
					
					<Collapsible
						title="Prolog"
					>
						
						<HtmlWidget
							label="Prolog"
							value={prolog}
							onChange={this.onChangeBoxState.bind(this, "prolog")}
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
							value={epilog}
							onChange={this.onChangeBoxState.bind(this, "epilog")}
						/>
						
						<TextWithLink
							title="Readmore"
							text={readmore}
							url={readmoreurl}
							onTextChange={this.onChangeBoxState.bind(this, "readmore")}
							onUrlChange={this.onChangeBoxState.bind(this, "readmoreurl")}
						/>
						
					</Collapsible>
					
					<div className="box-editor__footer">
						
						<SelectWidget
							className="box-style"
							label="Box Style"
							value={(style)?style:""}
							selections={[{key:1,text:"eins"},{key:2, text: "zwei"}]}
							onChange={this.onChangeBoxState.bind(this, "style")}
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
	onSave(){
		const { container_id, slot_id, box_index } = findBoxPath(this.props.grid.container, this.props.box.id)
		console.log(container_id, slot_id, box_index, this.state)
		this.props.onSaveBoxeditor(this.props.grid.id, container_id, slot_id, box_index,  this.state);
	}
	onChangeBoxState(key, value){
		this.state[key] = value;
		this.setState(this.state)
	}
	onChangeContent(key, value){
		this.state.content[key] = value;
		this.setState({content: this.state.content});
	}
}

BoxEditor.propTypes = {
	box: PropTypes.shape({
		id: PropTypes.any.isRequired,
		type: PropTypes.string.isRequired,
		content: PropTypes.object,
	}).isRequired,

	onSaveBoxeditor: PropTypes.func,
	onDiscardBoxeditor: PropTypes.func,
	onReuseBoxeditor: PropTypes.func,

};
BoxEditor.defaultProps = {
	onSaveBoxeditor: ()=>{console.info("onSaveBoxeditor not implemented")},
	onDiscardBoxeditor: ()=>{console.info("onDiscardBoxeditor not implemented")},
	onReuseBoxeditor: ()=>{console.info("onReuseBoxeditor not implemented")},
};

export default BoxEditor;