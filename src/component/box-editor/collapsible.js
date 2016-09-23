import React, {Component, PropTypes} from 'react';

class Collapsible extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props) {
		super(props);
		this.state = {
			collapsed: props.collapsed,
		}
	}
	/**
	 * ---------------------
	 * render
	 * ---------------------
	 */
	render(){
		const {title, children} = this.props;
		const {collapsed} = this.state;
		return (
			<div
				className="collapsible"
			>
				<div
					className="collapsible__title"
				    onClick={this.onToggle.bind(this)}
				>
					<span className="icon-arrow" />
					{title}
				</div>
				<div
					style={{
						display: (collapsed) ? "none": "block",
					}}
					className="collapsible__content"
				>
					{children}
				</div>
			</div>
		);
	}
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onToggle(){
		this.setState({collapsed: !this.state.collapsed});
	}
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}
Collapsible.propTypes = {
	title: PropTypes.string.isRequired,
	collapsed: PropTypes.bool,
};
Collapsible.defaultProps = {
	collapsed: true,
};

export default Collapsible;

