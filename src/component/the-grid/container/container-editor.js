import React, {Component, PropTypes} from 'react';

class ContainerEditor extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		
	}
	
	componentWillUnmount() {
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		return (
			<div>
				Component
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
 * property defaults
 */
ContainerEditor.defaultProps = {
	value: 0
};

/**
 * define property types
 */
ContainerEditor.propTypes = {
	value: PropTypes.number.isRequired
};

/**
 * export component to public
 */
export default ContainerEditor;