import React, {Component} from 'react';
import PropTypes from 'prop-types';


/**
 * NewBox component
 */
class NewBox extends Component{
	/**
	 * ---------------------
	 * lifecycle
	 * ---------------------
	 */
	constructor(props){
		super(props);
		this.state = {};
	}
	
	/**
	 * ---------------------
	 * rendering
	 * ---------------------
	 */
	render(){
		const { item } = this.props;
		return (
			<div
				className={`box box__new`}
				ref={ (element) => this.state.dom = element }
			>
				<div className="box__content">
					<div className="box__html" dangerouslySetInnerHTML={{__html: item.html}} />
				</div>
			</div>
		)
	}
}

NewBox.defaultProps = {
}

NewBox.propTypes = {
	item: PropTypes.object.isRequired,
};

export default NewBox;