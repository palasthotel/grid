import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Loading extends Component {

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
				<p>Is loading</p>
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
 * export component to public
 */
export default Loading;