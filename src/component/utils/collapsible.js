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
				className={`collapsible ${(collapsed)? "": "is-active"}`}
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
					{(collapsed)?null:children}
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
		if(typeof this.props.onStateChanged != typeof undefined) this.props.onStateChanged(this.state.collapsed);
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
	onStateChanged: PropTypes.func,
};
Collapsible.defaultProps = {
	collapsed: true,
};

export default Collapsible;

