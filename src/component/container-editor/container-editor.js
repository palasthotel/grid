import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextWithLink from '../input-widgets/text-with-link.js';
import Collapsible from '../utils/collapsible.js';
import HtmlWidget from '../input-widgets/html.js';

class ContainerEditor extends Component {

	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {
			...this.props.container,
		}
	}

	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {title, prolog, epilog} = this.state;
		return (
			<div
				className="grid-container-editor"
			>

				<Collapsible
					title="Prolog"
				>

					<HtmlWidget
						label="Prolog"
						value={prolog}
						onChange={this.onChangeState.bind(this, "prolog")}
					/>

				</Collapsible>
				<Collapsible
					title="Epilog"
				>

					<HtmlWidget
						label="Epilog"
						value={epilog}
						onChange={this.onChangeState.bind(this, "epilog")}
					/>

				</Collapsible>

				<div>
					{title}
				</div>

			</div>
		)
	}

	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onChangeState(key, value){
		this.state[key] = value;
		this.setState(this.state)
	}

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
};

/**
 * define property types
 */
ContainerEditor.propTypes = {
	container: PropTypes.shape({
		id: PropTypes.any.isRequired,
	}).isRequired,
};

/**
 * export component to public
 */
export default ContainerEditor;