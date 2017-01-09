"use strict";

export class ContainerDragPreview{
	static height(){
		return 40;
	}
	static padding(){
		return 2;
	}
	static create(width, slots){
		let img = new Image();
		let c = document.createElement('canvas');
		c.height = this.height();
		c.width = width;
		
		let ctx = c.getContext('2d');
		
		let slot = (width/slots);
		for(let i = 0; i < slots; i++){
			let x = slot*i;
			if(x > 0 ) x+= 2;
			ctx.rect(
				x+this.padding(),
				0,
				slot-this.padding(),
				this.height()
			);
			ctx.fillStyle = "#333333";
			ctx.fill();
		}
		
		return {
			img: img,
			src: c.toDataURL(),
		};
	}
	
	static createByType(width, type){
		
		const img = new Image();
		const c = document.createElement('canvas');
		c.height = this.height();
		c.width = width;
		
		const slots = type.split("-");
		const parts = [];
		
		let zeros = 0;
		let space_left = 1;
		for(let i = 1; i < slots.length; i++){
			let slot = slots[i];
			if(slot == "0"){
				zeros++;
				parts.push(0);
				continue;
			}
			let division_pars = slot.split("d");
			let space = parseInt(division_pars[0])/parseInt(division_pars[1]);
			parts.push(space);
			space_left -= space;
		}
		
		const ctx = c.getContext('2d');
		let zero_space = (zeros > 0)? space_left/zeros: 0;
		let x_pos = 0;
		for(let part of parts){
			let _width = 1;
			if(part == 0){
				// zero space
				_width = parseInt(zero_space*width);
			} else {
				// normal space
				_width = parseInt(part*width);
			}
			
			
			ctx.rect(
				x_pos+this.padding(),
				0,
				_width-this.padding(),
				this.height()
			);
			ctx.fillStyle = "#333333";
			ctx.fill();
			
			x_pos += _width;
		}
		
		
		
		return {
			img: img,
			src: c.toDataURL(),
		};
		
		
		
	}
}

export class BoxDragPreview{
	static height(){
		return 40;
	}
	static padding(){
		return 2;
	}
	static create(width){
		let img = new Image();
		let c = document.createElement('canvas');
		c.height = this.height();
		c.width = width;
		
		let ctx = c.getContext('2d');
		ctx.rect(
			0,
			0,
			width,
			this.height()
		);
		ctx.fillStyle = "#333333";
		ctx.fill();
		
		
		return {
			img: img,
			src: c.toDataURL(),
		};
	}
}