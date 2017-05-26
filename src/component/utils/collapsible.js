import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
	componentWillReceiveProps(nextProps){
		this.setState({collapsed: nextProps.collapsed});
	}
	/**
	 * ---------------------
	 * render
	 * ---------------------
	 */
	render(){
		const {title, children, removeChildrenFromDom} = this.props;
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
					{(removeChildrenFromDom && collapsed)? null:children}
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
		if(typeof this.props.onStateChanged !== typeof undefined) this.props.onStateChanged(this.state.collapsed);
	}
	/**
	 * ---------------------
	 * other functions
	 * ---------------------
	 */
}
Collapsible.defaultProps = {
	collapsed: true,
	removeChildrenFromDom: false,
};
Collapsible.propTypes = {
	title: PropTypes.string.isRequired,
	collapsed: PropTypes.bool,
	removeChildrenFromDom:PropTypes.bool,
	onStateChanged: PropTypes.func,
};


export default Collapsible;

