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
		const {title, titleurl, readmore, readmoreurl, prolog, epilog, type} = this.state;
		return (
			<div
				className="grid-container-editor"
			>
				<div
					className="grid-container-editor__menu"
				>
					<nav>
						<ul>
							<li
								className="grid-container-editor__menu--item"
							>
								<button
									onClick={this.onSave.bind(this)}
								>
									Save
								</button>
							</li>
							<li
								className="grid-container-editor__menu--item"
							>
								<button
									onClick={this.onCancel.bind(this)}
								>
									Discard
								</button>
							</li>
						</ul>
					</nav>
				</div>

				<div className="grid-container-editor__header">

					<div
						className="grid-container-editor__type">
						{type}
					</div>

					<TextWithLink
						className="grid-container-editor__title"
						title="Conatinertitle"
						text={title}
						url={titleurl}
						onTextChange={this.onChangeState.bind(this, "title")}
						onUrlChange={this.onChangeState.bind(this, "titleurl")}
					/>
				</div>

				<Collapsible
					title="Prolog"
				>

					<HtmlWidget
						label="Prolog"
						value={prolog}
						onChange={this.onChangeState.bind(this, "prolog")}
					/>

				</Collapsible>

				<div>Slot Styles?</div>

				<Collapsible
					title="Epilog"
				>

					<HtmlWidget
						label="Epilog"
						value={epilog}
						onChange={this.onChangeState.bind(this, "epilog")}
					/>

				</Collapsible>

				<TextWithLink
					className="grid-container-editor__readmore"
					title="Readmore"
					text={readmore}
					url={readmoreurl}
					onTextChange={this.onChangeState.bind(this, "readmore")}
					onUrlChange={this.onChangeState.bind(this, "readmoreurl")}
				/>

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
	onSave(){
		const {id} = this.props.container;
		console.log(id, this.state);
		this.props.onSave(id, this.state);
	}
	onCancel(){
		console.log("cancel");
		this.props.onCancel();
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
	onSave: ()=>{ console.log("onSave is not implemented") },
	onCancel: ()=> { console.log("onCancel is not implemented") },
	onReuse: ()=> { console.log("onReuse is not implemented") },
};

/**
 * define property types
 */
ContainerEditor.propTypes = {
	container: PropTypes.shape({
		id: PropTypes.any.isRequired,
	}).isRequired,

	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onReuse: PropTypes.func,

};

/**
 * export component to public
 */
export default ContainerEditor;