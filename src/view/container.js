import React from 'react';
import ReactDOM from 'react-dom';
import Slot from './slot';

export default class Container extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const class_name = "grid-container "+this.props.type;
		const slots = this.props.slots.map((slot, index)=>{
			return(
				<Slot
					key={index}
					{...slot}
				/>
			)
		});
		return(
			<div className={class_name} >
				<div className="grid-container-controls">
					<span className="grid-container-title">{this.props.title}</span>
					<div className="grid-container-options">
						<span className="grid-container-options-icon">Options <i className="icon-options" /></span>
						<ul className="grid-container-options-list">
							<li className="grid-container-options-list-item" role="edit"><i className="icon-edit" /> Edit</li>
							<li className="grid-container-options-list-item" role="reuse"><i className="icon-reuse" /> Reuse</li>
							<li className="grid-container-options-list-item" role="toggleslotstyles"><i className="icon-style" /> Slot-styles</li>
							<li className="grid-container-options-list-item" role="trash"><i className="icon-trash" /> Delete</li>
						</ul>
					</div>
				</div>
				<div className="grid-container-content">
					<div className="grid-container-before">
						<div className="grid-container-prolog">PROLOG</div>
					</div>
					<div className="grid-slots-wrapper"> {slots} </div>
						<div className="grid-container-after">
						<div className="grid-container-epilog">EPILOG</div>
					</div>
				</div>
			</div>
		)
	}
}
