'use strict';

/**
 *
 * @param container
 * @param container_id
 * @return {object|null}
 */
export function findContainer(container, container_id){
	for(const c of container) {
		if (c.id === container_id) {
			return c;
		}
	}
	return null;
}

/**
 *
 * @param {array} container
 * @param {int} container_id
 * @param {int} slot_id
 * @return {null|object}
 */
export function findSlot(container, container_id, slot_id){
	const c = findContainer(container, container_id)
	if(typeof c === typeof {}){
		for(const s of c.slots){
			if(s.id === slot_id){
				return s;
			}
		}
	}
	return null;
}

/**
 *
 * @param container
 * @param box_id
 * @return {null|object}
 */
export function findBoxPath(container, box_id) {
	for(const container_index in container){
		if(!container.hasOwnProperty(container_index)) continue
		const c = container[container_index];
		for(const slot_index in c.slots){
			if(!c.slots.hasOwnProperty(slot_index)) continue
			const s = c.slots[slot_index]
			for(const box_index in s.boxes){
				if(!s.boxes.hasOwnProperty(box_index)) continue
				const b = s.boxes[box_index];
				if(b.id === box_id) return {
					container_index,
					container_id: c.id,
					slot_index,
					slot_id: s.id,
					box_index,
					box_id
				}
			}
		}
	}
	return null;

}