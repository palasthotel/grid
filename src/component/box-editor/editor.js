import React, {Component} from 'react';

import Controls from './controls.js';
import BoxEditorHeader from './editor-header.js';
import Prolog from './editor-prolog.js';
import Epilog from './editor-epilog.js';
import Footer from './editor-footer.js';


export default class BoxEditor extends Component{
	constructor(props) {
		super(props);
		
	}
	render(){
		
		return (
			<div
				className="box-editor"
			>
				<Controls/>
				<div
					className="box-editor__content">
					<div
						className="box-editor__type">
						Video
					</div>
					
					<BoxEditorHeader
					/>
					
					<Prolog/>
					
					
					<Epilog/>
					
					<Footer/>
						
				</div>
			</div>
		);
	}
}