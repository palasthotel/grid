import React, {Component, PropTypes} from 'react';

// https://github.com/okonet/react-dropzone
import Dropzone from 'react-dropzone';


class FileWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			value: props.value,
			selected_file: null,
		};
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	renderFile(){
		return(
			<div
				className="widget__content"
			>
				<div
					className="widget__file"
				>
					<img
						className="widget__img"
						src={this.state.selected_file.preview}
					/>
				</div>
				<div
					className="widget__file-description"
				>
					<button
						className="widget__delete-button"
						onClick={this.onDelete.bind(this)}
					>
						Delete
					</button>
				</div>
			</div>
			
		)
	}
	renderDropzone(){
		return (
			<Dropzone
				onDrop={this.onDrop.bind(this)}
				multiple={false}
				className="widget__dropzone"
				style={{}}
			>
				<svg
					className="widget_svg"
					width="15"
					height="15"
					viewBox="0 0 1792 1792"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"
					/>
				</svg>
				Try dropping some files here, or click to select files to upload.
			</Dropzone>
		)
	}
	render() {
		return (
			<div
				className="box-editor__widget widget__file"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				{(()=>{
					if(this.state.selected_file != null){
						return this.renderFile();
					}
					return this.renderDropzone();
				})()}
			
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onDrop(files) {
		console.log(files[0]);
		this.setState({selected_file: files[0]});
	}
	onDelete(){
		this.setState({selected_file: null});
	}
	onChange(e){
		let value = e.target.value;
		this.setState({value: value});
		this.props.onChange(value);
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
FileWidget.defaultProps = {
	label: "",
	value: "",
};

/**
 * define property types
 */
FileWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default FileWidget;