"use strict";

export default class ContainerDragPreview{
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
}