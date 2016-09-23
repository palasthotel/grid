import React, {Component} from 'react';


export default class BoxEditorHeader extends Component{
	constructor(props) {
		super(props);
		
		
		
	}
	render(){
		
		return (
			<div
				className="box-editor__header"
			>
				<label
					className="box-editor__label">
					Boxtitle
				</label>
				
				<input
					placeholder="Title:"
					name="grid-editor-title"
					type="text"
					value="Youtube.com Link"
					className="box-editor__input-title" />
				
				
				<div
					className="grid-editor-url-builder"
				>
					<input
						placeholder="Title URL (for internals links, please use a relative path starting with '/'):"
						name="grid-editor-titleurl"
						type="text"
						value=""
						className="grid-editor-titleurl grid-editor-url-input"
						disabled="disabled"
					/>
						
						<button
							className="grid-editor-url-button icon-link"
						>
							Add link
						</button>
				</div>
			
			</div>
		);
	}
}