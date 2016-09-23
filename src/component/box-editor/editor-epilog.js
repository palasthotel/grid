import React, {Component} from 'react';
import Collapsible from './collapsible.js';


export default class BoxEditorProlog extends Component{
	constructor(props) {
		super(props);
		
	}
	render(){
		
		return (
			<div
				className="box-editor__prolog"
			>
				<Collapsible
					title="Prolog"
				    collapsed={true}
				>
					<label
						className="box-editor__label"
					>
						Text
					</label>
					<textarea
						className="form-html grid-editor-prolog"
					    value="epilog"
					/>
					
					<label
						className="box-editor__label">
						Readmore
					</label>
					
					<input
						placeholder="Readmore text:"
						type="text"
						value=""
						className="box-editor_input-readmore"
					/>
						<div
							className="box-editor__url-builder"
						>
							<input
								placeholder="Readmore URL (for internals links, please use a relative path starting with '/'):"
								type="text"
								value=""
								className="grid-editor-readmoreurl grid-editor-url-input"
								disabled="disabled"
							/>
							<button
								className="box-editor__url-button icon-link"
							>
								Add link
							</button>
						</div>
					
				</Collapsible>
			</div>
		);
	}
}