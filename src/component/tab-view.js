import React, {Component, PropTypes} from 'react';

class TabView extends Component {
	
	/**
	 * ------------------------------------------------
	 * lifecycle
	 * ------------------------------------------------
	 */
	constructor(props) {
		super(props);
		this.state = {
			active: props.active,
		}
	}
	
	/**
	 * ------------------------------------------------
	 * rendering
	 * ------------------------------------------------
	 */
	render() {
		const {titles} = this.props;
		const {active} = this.state;
		return (
			<div
				className="tab-view"
			>
				<div
					className="tab-view__tabs"
				>
					{titles.map((title, index)=>{
						return (
							<div
								key={index}
								className={`tab-view__tab${(active == index)? " is-active": ""}`}
							    onClick={this.onClickTab.bind(this,index)}
							>
								{title}
							</div>
						)
					})}
				</div>
				<div
					className="tab-view__content"
				>
					{this.props.children[active]}
				</div>
			</div>
		)
	}
	
	/**
	 * ------------------------------------------------
	 * events
	 * ------------------------------------------------
	 */
	onClickTab(index){
		this.setState({active: index});
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
TabView.defaultProps = {
	titles: [],
	active: 0,
};

/**
 * define property types
 */
TabView.propTypes = {
	titles: PropTypes.arrayOf(PropTypes.string).isRequired,
	active: PropTypes.number,
};

/**
 * export component to public
 */
export default TabView;