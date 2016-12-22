import React, {Component, PropTypes} from 'react';

class ContainerTypes extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
				
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {items} = this.props;
		return (
			<div
				className="container-types"
			>
				{items.map((container,index)=>{
					if(container.type.indexOf("i-") === 0
						|| container.type.indexOf("sc-") === 0
					)
						return;
					return (
						<div
							key={container.type}
						>
							{container.type}
						</div>
					)
				})}
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	
	/**
	 * ------------------------------------------------
	 * other functions
	 * ------------------------------------------------
	 */
}

/**
 * define property types
 */
ContainerTypes.propTypes = {
	items: PropTypes.array.isRequired
};

/**
 * export component to public
 */
export default ContainerTypes;