/**
 * get weights for container slots
 * @param container
 * @return {[ {weight: int, is_space: bool} ]}
 */
export function get_slot_weights(container){

	const dimensions = container.type.split("-");

	function get_weigth(dim) {
		return dim.split("d")[0];
	}

	function get_item(weight, is_space = false) {
		return {
			weight,
			is_space,
		}
	}

	const weights = [];

	if(typeof container.space_to_left === typeof ""){
		weights.push( get_item( get_weigth(container.space_to_left), true) )
	}

	for(let i = 1; i < dimensions.length; i++) {
		const dim = dimensions[i]
		if (dim === "0") continue;
		weights.push(get_item(get_weigth(dim)));
	}

	if(typeof container.space_to_right === typeof ""){
		weights.push( get_item( get_weigth(container.space_to_right), true) )
	}

	return weights;
}