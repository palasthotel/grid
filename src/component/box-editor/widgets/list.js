import React, {Component, PropTypes} from 'react';
import _ from 'underscore';
import uuid from 'node-uuid';

import Widgets from './widgets.js';

class ListWidgetItem extends Component{
	constructor(props){
		super(props);
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render(){
		return (
			<div
				className="widget-list-item"
			>
				<Widgets
					content={this.props.content}
					contentstructure={this.props.contentstructure}
					onChangeContent={this.onChangeContent.bind(this)}
				/>
				<button
					className="widget-list-item__button widget-list-item__remove-button"
				    onClick={this.props.onDelete}
				>
					<span className="icon-minus" />
					Remove item
				</button>
				<button
					className="widget-list-item__button widget-list-item__sort-button widget-list-item__move-up-button"
				    onClick={this.props.onMoveUp}
				>
					<span className="icon-dir-up" />
				</button>
				<button
					className="widget-list-item__button widget-list-item__sort-button widget-list-item__move-down-button"
				    onClick={this.props.onMoveDown}
				>
					<span className="icon-dir-down" />
				</button>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChangeContent(key, value){
		this.props.onChange(key, value);
	}
}
/**
 * property defaults
 */
ListWidgetItem.defaultProps = {
	content: {},
	contentstructure: [],
};

/**
 * define property types
 */
ListWidgetItem.propTypes = {
	content: PropTypes.object.isRequired,
	contentstructure: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onMoveUp: PropTypes.func.isRequired,
	onMoveDown: PropTypes.func.isRequired,
};

class ListWidget extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			contents: this.get_object(this.props.value),
		};
		
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {contents} = this.state;
		return (
			<div
				className="box-editor__widget widget__list"
			>
				<label
					className="widget__label"
				>
					{this.props.label}
				</label>
				
				<div
					className="widget__item-list"
				>
					{Object.keys(contents).map((index) =>{
						return (
							<ListWidgetItem
								key={index}
								content={contents[index]}
								contentstructure={this.props.contentstructure}
								onChange={this.onChange.bind(this,index)}
							    onDelete={this.onDelete.bind(this,index)}
							    onMoveUp={this.onMoveUp.bind(this, index)}
							    onMoveDown={this.onMoveDown.bind(this,index)}
							/>
						)
					} )}
				</div>
				<button
					className="widget__list-add-button"
					onClick={this.onAdd.bind(this)}
				>
					+ Add Item
				</button>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChange(content_key, key, value){
		let {contents} = this.state;
		contents[content_key][key] = value;
		this.setState({contents: contents});
		this._emitChange();
	}
	onDelete(key){
		delete this.state.contents[key];
		this.setState({contents:this.state.contents});
		this._emitChange();
	}
	onMoveUp(key){
		let index = this.get_index(key);
		this.onMove(index, -1);
	}
	onMoveDown(key){
		let index = this.get_index(key);
		this.onMove(index, 1);
	}
	onMove(index, offset){
		this.state.contents = this.get_object(
			this.move_element(
				this.get_value(), index, (index+offset)
			)
		);
		this.setState({contents: this.state.contents});
		this._emitChange();
	}
	onAdd(){
		this.state.contents[uuid.v4()] = {};
		this.setState({contents: this.state.contents});
		this._emitChange();
	}
	_emitChange(){
		this.props.onChange(this.get_value());
	}
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
	get_object(value){
		let contents = {};
		for(let i = 0; i < value.length; i++){
			contents[uuid.v4()] = value[i];
		}
		return contents;
	}
	get_value(){
		const {contents} = this.state;
		let _value = [];
		for(let index in contents){
			if(contents.hasOwnProperty(index)) _value.push(contents[index]);
		}
		return _value;
	}
	get_index(key){
		let i = 0;
		for(let _key in this.state.contents){
			if(_key == key) return i;
			i++;
		}
		return -1;
	}
	move_element(old, pos1, pos2){
		// local variables
		let _new = [];
		
		if(pos1 > old.length-1 || pos2 > old.length-1) throw new Exception("Cannot move positions that are out of bounce!");
		
		for(let i = 0; i < old.length; i++){
			if(i == pos1){
				_new[i] = old[pos2];
			} else if(i == pos2){
				_new[i] = old[pos1];
			} else {
				_new[i] = old[i];
			}
		}
		return _new;
	}
}

/**
 * property defaults
 */
ListWidget.defaultProps = {
	label: "",
	value: {},
	contentstructure: [],
};

/**
 * define property types
 */
ListWidget.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * export component to public
 */
export default ListWidget;