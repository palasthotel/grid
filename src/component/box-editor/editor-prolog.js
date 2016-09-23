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
					    value="Prolog"
					/>
				</Collapsible>
			</div>
		);
	}
}