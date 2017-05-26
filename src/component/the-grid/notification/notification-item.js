import React, {Component} from 'react';
import PropTypes from 'prop-types';

import WarningIcon from '../../icon/warning'

class NotificationItem extends Component {

	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {is_hidden: this.props.is_hidden};
	}
	componentDidMount(){
		if(this.props.auto_hide === true){
			setTimeout(()=>{
				this.setState({is_hidden: true});
			},this.props.hide_after*1000);
		}
	}
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {type } = this.props;
		const {is_hidden} = this.state;
		return (
			<li
				className={`grid-notification__item grid-notification__item--is-${type} ${(is_hidden)? "is-hidden": ""}`}
			>
				<span
					className="grid-notification__icon"
				>
					{this.renderIcon()}
				</span>
				<span
					className="grid-notification__icon"
				/>
				{this.props.children}
			</li>
		)
	}

	renderIcon(){
		const {type } = this.props;
		switch (type){
			case "error":
				return <WarningIcon />;
		}
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
NotificationItem.defaultProps = {
	is_hidden: false,
	auto_hide: false,
	hide_after: 5,
	type: "notice",
};

/**
 * define property types
 */
NotificationItem.propTypes = {
	is_hidden: PropTypes.bool,
	auto_hide: PropTypes.bool,
	hide_after: PropTypes.number,
	type: PropTypes.string,
	children: PropTypes.element.isRequired,
};

/**
 * export component to public
 */
export default NotificationItem;