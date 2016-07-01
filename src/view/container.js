import React from 'react';
import ReactDOM from 'react-dom';
import Slot from './slot';

export default class Container extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const classname = "grid-container "+this.props.type;
		const slots = this.props.slots.map((slot, index)=>{
			return(
			  <Slot
				key={index}
				{...slot}
			  />
			)
		});
		return(




		  <div className={classname} >

			  <div class="grid-container-controls">

				<span class="grid-container-title">
					{this.props.title}
				</span>



				  <div class="grid-container-options">
					  <span class="grid-container-options-icon">Options <i class="icon-options"></i></span>
					  <ul class="grid-container-options-list">
						  <li class="grid-container-options-list-item" role="edit"><i class="icon-edit"></i> Edit</li>
						  <li class="grid-container-options-list-item" role="reuse"><i class="icon-reuse"></i> Reuse</li>
						  <li class="grid-container-options-list-item" role="toggleslotstyles"><i class="icon-style"></i> Slot-styles</li>
						  <li class="grid-container-options-list-item" role="trash"><i class="icon-trash"></i> Delete</li>
					  </ul>
				  </div>


			  </div>

			  <div class="grid-container-content">
				  <div class="grid-container-before">
					  <div class="grid-container-prolog">PROLOG</div>
				  </div>

				  <div class="grid-slots-wrapper"> {slots} </div>

				  <div class="grid-container-after">
					  <div class="grid-container-epilog">EPILOG</div>
				  </div>
			  </div>




		  </div>
		)
	}
}
