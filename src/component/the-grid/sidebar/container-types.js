import React, {Component, PropTypes} from 'react';
import Collapsible from '../../utils/collapsible';
import NewContainer from './new-container';

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
				<Collapsible
					title="Containers"
					removeChildrenFromDom={true}
				>
					{items.map((container,index)=>{
						if(container.type.indexOf("i-") === 0
						|| container.type.indexOf("sc-") === 0
						|| container.type.indexOf("s-") === 0
						)
							return;
						return (
							<NewContainer
								key={container.type}
								item={container}
							/>
						)
					})}
				</Collapsible>
				<Collapsible
					title="Sidebars"
					removeChildrenFromDom={true}
				>
					{items.map((container,index)=>{
						if(container.type.indexOf("i-") === 0
						|| container.type.indexOf("sc-") === 0
						|| container.type.indexOf("c-") === 0
						)
							return;
						return (
							<NewContainer
								key={container.type}
								item={container}
							/>
						)
					})}
				</Collapsible>
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