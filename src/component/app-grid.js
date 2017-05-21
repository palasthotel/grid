import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TheGrid from './the-grid/the-grid'
import BoxEditor from './box-editor/box-editor'

class AppGrid extends Component {

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
		const {is_ready} = this.props;
		return (
			<div>
				{(!is_ready)? this.renderLoading(): this.renderGrid() }
			</div>
		)
	}

	renderLoading(){
		return <p>Loading...</p>
	}
	renderGrid(){
		const {edit_box} = this.props.ui;

		if( typeof edit_box === typeof {} ){
			const {container} = this.props.grid;
			let the_box = null;
			for(const c of container){
				if(c.id !== edit_box.container_id) continue;
				for(const s of c.slots){
					if(s.id !== edit_box.slot_id) continue;
					for(const i in s.boxes){
						const b = s.boxes[i];
						if(b.id === edit_box.box_id){
							the_box = {
								...b,
							}
						}
					}
				}
			}
			return (
				<BoxEditor
					{...this.props}
					box={the_box}
				/>
			)
		}

		return (<TheGrid
			{...this.props}
		/>)
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
AppGrid.defaultProps = {
	is_ready: false,
};

/**
 * define property types
 */
AppGrid.propTypes = {
	is_ready: PropTypes.bool,
};

/**
 * export component to public
 */
export default AppGrid;