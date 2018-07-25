import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Container extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		this.state = {
			active: false,
		};
	}

	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { type, reused } = this.props;
		return (
			<div
				className={`grid-container container__${type}`}
			     ref={ (element) => this.state.dom = element }
			>
				
				<div className="grid-container__controls">
					<span className="grid-container__title">{this.props.title} {(reused)? reusetitle+"__":""}</span>

					<span
						style={{
							cursor: "move"
						}}
						className="grid-container__drag">
					  <i className="grid-icon__drag" />
				    </span>

					<div className="grid-container__options">
						<span className="grid-container__options--icon">Options <i className="grid-icon__options" /></span>
						<ul className="grid-container__options--list">
							<li
								className="grid-container__options--list-item"
							    onClick={this.onEdit.bind(this)}
							>
								<i className="grid-icon__edit" /> Edit
							</li>
							
							{this.renderReuse()}
							
							<li className="grid-container__options--list-item">
								<i className="grid-icon__style" /> Slot-styles
							</li>
							<li
								className="grid-container__options--list-item"
								role="delete"
							    onClick={this.onDelete.bind(this)}
							>
								<i className="grid-icon__trash" /> Delete
							</li>
						</ul>
					</div>
				</div>
				
				<div className="grid-container__content">
					<div className="grid-container__before">
						{this.renderIf("prolog")}
					</div>
					
					<div className="grid-slots">{this.props.children}</div>
					
					<div className="grid-container__after">
						{this.renderIf("epilog")}
					</div>
				</div>
			</div>
		)
	}
	renderIf(prop){
		if(this.props[prop]) return null;
		return <div className={`grid-container__${prop}`}>{this.props[prop]}</div>
	}
	renderReuse(){
		const {reused} = this.props;
		if(reused) return null;
		return (
			<li
				className="grid-container__options--list-item"
				onClick={this.onReuse.bind(this)}
			>
				<i className="grid-icon__reuse" /> Reuse
			</li>
		)
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onEdit(){
		this.props.onEdit(this.props.id);
	}
	onDelete(){
		this.props.onDelete(this.props.id);
	}
	onReuse(){
		const title = prompt("Reuse title?", "");
		if(title === "") return;
		this.props.onReuse(this.props.index, title);
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */

}

Container.defaultProps = {
	
	onEdit: ()=>{ },
	onDelete: ()=> {},
	onReuse: ()=>{ },
	reused: false,

};

Container.propTypes = {

	index: PropTypes.number.isRequired,
	title: PropTypes.string,

};

export default Container;