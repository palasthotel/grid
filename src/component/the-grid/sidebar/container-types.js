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
		const {container_types} = this.props;
		return (
			<div
				className="container-types"
			>
				{container_types.map((container,index)=>{
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
	container_types: PropTypes.array.isRequired
};

/**
 * export component to public
 */
export default ContainerTypes;