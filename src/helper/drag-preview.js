"use strict";

export class ContainerDragPreview{
	static height(){
		return 40;
	}
	static padding(){
		return 4;
	}
	
	static createByType(width, type, space_to_left = null, space_to_right = null){
		
		const img = new Image();
		const c = document.createElement('canvas');
		c.height = this.height();
		c.width = width;
		
		const slots = type.split("-");
		
		const parts = [];
		
		for(let i = 1; i < slots.length; i++){
			let slot = slots[i];
			if(slot == "0"){
				continue;
			}
			let division_pars = slot.split("d");
			let space = parseInt(division_pars[0])/parseInt(division_pars[1]);
			parts.push(space);
		}
		
		const ctx = c.getContext('2d');
		
		/**
		 * space to left
		 */
		let x_pos = 0;
		if(typeof space_to_left == typeof ""){
			let division_pars = space_to_left.split("d");
			x_pos = parseInt(division_pars[0])/parseInt(division_pars[1])*width;
		}
		
		/**
		 * add elements
		 */
		let index = 0;
		for(let part of parts){
			let fillStyle = "#000";
			let _width = part*width;
			
			ctx.beginPath();
			ctx.rect(
				x_pos+(this.padding()/2),
				0,
				_width-this.padding(),
				this.height()
			);
			
			ctx.fillStyle = fillStyle;
			ctx.fill();
			
			index++;
			x_pos += _width;
		}
		
		// stroke or not?
		// ctx.beginPath();
		//
		// ctx.rect(
		// 	0,
		// 	0,
		// 	width,
		// 	this.height(),
		// );
		// ctx.lineWidth = this.padding();
		// ctx.stroke();
		
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