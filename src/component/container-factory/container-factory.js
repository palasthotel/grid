import React, {Component} from 'react';


export default class ContainerFactory extends Component{
	
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	
	constructor(props){
		super(props);
		this.state = {
			slots: 1,
			dimensions:[1],
			sidebar:{
				left:false,
				right: false,
			},
		}
	}
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	
	renderSlot(index, denominator){
		const dim = this.state.dimensions[index];
		const width = (dim/denominator)*100;
		const styles = {
			width: width+"%"
		};
		return(
			<div
				style={styles}
				key={index}
				className="container-factory-slot">
				{dim}d{denominator}<br />
				<button onClick={this.onPlus.bind(this, index)}>+</button> / <button onClick={this.onMinus.bind(this, index)}>-</button>
			</div>
		);
	}
	renderSlots(){
		let denominator = 0;
		for(let i = 0; i < this.state.slots; i++){
			denominator += this.state.dimensions[i];
		}
		let slots = [];
		for(let i = 0; i < this.state.slots; i++){
			slots.push(this.renderSlot(i, denominator));
		}
		return slots;
	}
	render(){
		return (
			<div className="container-factory">
				<div className="container-factory-num-slots">
					<button onClick={this.onMoreSlots.bind(this)}>+</button>
					{this.state.slots}
					<button onClick={this.onLessSlots.bind(this)}>-</button>
				</div>
				<div className="container-factory-slots-preview">
					{ this.renderSlots() }
				</div>
				<button
					onClick={this.onSaveContainer.bind(this)}
				>Save Container</button>
			</div>
		);
	}
	
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onChangeSlots(slots){
		let new_dim = [];
		for(let i = 0; i <= slots; i++){
			if(typeof this.state.dimensions[i] !== typeof undefined){
				new_dim.push(this.state.dimensions[i]);
			} else {
				new_dim.push(1);
			}
		}
		this.setState({
			slots: slots,
			dimensions: new_dim,
		});
	}
	onMoreSlots(){
		let slots = this.state.slots;
		slots++;
		if(slots > 12) return;
		this.onChangeSlots(slots);
	}
	onLessSlots(){
		let slots = this.state.slots;
		slots--;
		if(slots < 1) return;
		this.onChangeSlots(slots);
	}
	// onChangeSlot(index, e){
	// 	if(e.target.value == ""){
	// 		this.state.dimensions[index] = 1;
	// 		this.setState({
	// 			dimensions: this.state.dimensions
	// 		});
	// 		return;
	// 	}
	// 	const dim = parseInt(e.target.value);
	// 	if(dim < 1) return;
	// 	this.state.dimensions[index] = parseInt(e.target.value);
	// 	this.setState({
	// 		dimensions: this.state.dimensions
	// 	});
	// }
	onMinus(index){
		let dim = this.state.dimensions[index];
		if(dim > 1) this.state.dimensions[index]--;
		this.setState({dimensions: this.state.dimensions});
	}
	onPlus(index){
		this.state.dimensions[index]++;
		this.setState({dimensions: this.state.dimensions});
	}
	onSaveContainer(){
		console.log("save");
	}
	
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}

