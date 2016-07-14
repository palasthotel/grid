import React from 'react';
import ReactDOM from 'react-dom';

/**
 * grid dummy
 * @type {{id: number, isDraft: boolean, container: *[], isSidebar: boolean}}
 */
var container_types = require('./dummy-data/container_types');

class ContainerEditor extends React.Component{
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
	renderSlot(index, denominator){
		console.log("Render slot "+index);
		const slots = this.state.slots;
		const dim = this.state.dimensions[index];
		const width = (dim/denominator)*100;
		const styles = {
			width: width+"%"
		};
		return(
			<div
				style={styles}
				key={index}
				className="grid-slot">
				<input
					onChange={this.onChangeSlot.bind(this, index)}
					value={this.state.dimensions[index]}
					type="number"
				/>
			</div>
		);
	}
	renderSlots(){
		let denominator = 0;
		for(let i = 0; i < this.state.slots; i++){
			denominator += this.state.dimensions[i];
		}
		console.log("Has slots "+this.state.slots);
		console.log("Denominator "+denominator);
		let slots = [];
		for(let i = 0; i < this.state.slots; i++){
			slots.push(this.renderSlot(i, denominator));
		}
		return slots;
	}
	render(){
		return (
			<div className="grid-container-editor">
				<div className="grid-container-num-slots">
					<input
						ref="num_slots"
						value={this.state.slots}
						type="number"
					    onChange={this.onChangeSlots.bind(this)}
					/>
				</div>
				<div className="grid-container">
					{ this.renderSlots() }
				</div>
			</div>
		);
	}
	onChangeSlots(e){
		if(e.target.value == "") return;
		let new_dim = [];
		const slots = parseInt(e.target.value);
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
	onChangeSlot(index, e){
		if(e.target.value == ""){
			this.state.dimensions[index] = 1;
			this.setState({
				dimensions: this.state.dimensions
			});
			return;
		}
		const dim = parseInt(e.target.value);
		if(dim < 1) return;
		this.state.dimensions[index] = parseInt(e.target.value);
		this.setState({
			dimensions: this.state.dimensions
		});
	}
}
class ContainerType extends React.Component{
	getDenominator(){
		const slots = this.props.type.split("-");
		let denom = 0;
		for(let i = 1; i < slots.length; i++){
			denom+= parseInt(slots[i]);
		}
		return denom;
	}
	render(){
		return(
			<div key={container.type} className="grid-container">
				<p>{container.type}</p>
			</div>
		);
	}
}
class ContainerTypes extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			trashed: props.trashed,
		}
	}

	renderContainer(container){
		if(!container.type.startsWith("c-") && !container.type.startsWith('s-')) return;
		return(
			<div key={container.type} className="grid-container">
				<p>{container.type}</p>
			</div>
		);
	}
	render(){
		return(
			<div className="grid-containers">
				{this.props.container_types.map((container) => this.renderContainer(container ))}
			</div>
		)
	}
}


/**
 * append app to grid app root
 */
ReactDOM.render(
	<div className="grid-container-factory">
		<ContainerEditor />
		<ContainerTypes
			container_types={container_types}
        />
	</div>,
  document.getElementById("container-factory")
);