
/**
 * container types
 * @type {{SIDEBAR_LEFT: string, SIDEBAR_RIGHT: string, CONTAINER: string, INVISIBLE: string, UNKNOWN:string}}
 */
export const TYPES = {
	SIDEBAR_LEFT: "sidebar_left",
	SIDEBAR_RIGHT: "sidebar_right",
	CONTAINER: "container",
	INVISIBLE: "invisible",
	UNKNOWN: "unknown",
};

/**
 * helper functions for container types
 */
export default class ContainerTypeHelper {
	
	/**
	 * check if container type is sidebar
	 * @param container_type
	 * @returns {boolean}
	 */
	static isSidebar(container_type){
		return container_type.startsWith("s-");
	}
	
	/**
	 * extracts slot sizes array from container type
	 * @returns {array}
	 * @param container_type
	 */
	static getSlotSizes(container_type) {
		return container_type.split("-").splice(1);
	}
	
	/**
	 * calculates with of a divider slot size on percent
	 * @returns {float}
	 * @param slot_size
	 */
	static getSlotWidth(slot_size) {
		const parts = slot_size.split("d");
		return (parts[0]/parts[1])*100;
	}
	
	/**
	 * get denominator for container type
	 * @param container_type
	 * @returns {number}
	 */
	static getDenominator(container_type) {
		const slots = container_type.split("-");
		let denom = 0;
		for(let i = 1; i < slots.length; i++){
			denom+= parseInt(slots[i]);
		}
		return denom;
	}
	
	/**
	 * returns a static container type
	 * @param container_type
	 * @returns {TYPES}
	 */
	static getType(container_type){
		if(container_type.startsWith("c-")){
			return TYPES.CONTAINER;
		}
		if(container_type.startsWith("i-")){
			return TYPES.INVISIBLE;
		}
		if(container_type.startsWith("s-0")){
			return TYPES.SIDEBAR_RIGHT;
		}
		if(container_type.startsWith("s-")){
			return TYPES.SIDEBAR_LEFT;
		}
		return TYPES.UNKNOWN;
	}
}

