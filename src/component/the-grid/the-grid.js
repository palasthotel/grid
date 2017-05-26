import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Grid from './grid.js';
import TabView from './sidebar/tab-view.js';
import ContainerTypes from './sidebar/container-types.js';
import BoxTypes from './sidebar/box-types.js';

import Revision from './revision/revision';

import ToolbarButton from './toolbar/toolbar-button';

import GridLogoIcon from '../icon/grid'
import WarningIcon from '../icon/warning'
import NotificationIcon from '../icon/notification'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class TheGrid extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			show_revisions: false
		};
	}
	
	render(){

		const { container_types, box_types, revisions } = this.props;

		const { id, isDraft, container } = this.props.grid;

		const {edit_container, edit_box} = this.props.ui;

		const {show_revisions} = this.state;

		const draft_class = (isDraft)? "is-draft": "is-published";

		return (
			<div
				className={`grid-app ${draft_class}`}
			>

				<header
					className="grid-adminbar"
				>
					<div
						className="grid-logo"
					>
						<GridLogoIcon />
					</div>
					<nav>
						<ul
							className="grid-menu"
						>

							<ToolbarButton
								label="Publish"
								identifier="publish"
								onClick={this.props.onPublish.bind(this, id)}
							/>

							<ToolbarButton
								label="Preview"
								identifier="preview"
								onClick={this.props.onPreview.bind(this, id)}
							/>

							<ToolbarButton
								label="Revert"
								identifier="revert"
								onClick={this.props.onRevertDraft.bind(this, id)}
							/>

							<ToolbarButton
								label="Revisions"
								identifier="revisions"
								onClick={this.onClickRevisions.bind(this)}
							/>

							<ToolbarButton
								label="Options"
								identifier="options"
								onClick={()=>{}}
							>
								<ul
									className="grid-childmenu"
								>
									<ToolbarButton
										label="Option 2"
										identifier="opt-1"
										onClick={()=>{}}
									/>
									<ToolbarButton
										label="Option 2"
										identifier="opt-2"
										onClick={()=>{}}
									/>
								</ul>
							</ToolbarButton>

						</ul>
					</nav>

					<div
						className="grid-notifications"
					>
						<div>
							<NotificationIcon/>
						</div>
						<ul
							className="grid-notifications__list"
						>
							<li
								className="grid-notification__item grid-notification__item--is-published"
							>
								<span
									className="grid-notification__icon"
								/>
								<p>Version (XXX) wurde erfolgreich gespeichert.</p>
							</li>
							<li
								className="grid-notification__item grid-notification__item--is-success"
							>
								<span
									className="grid-notification__icon"
								/>
								<p>Revision (XXX) wurde wiederhergestellt.</p>
							</li>
							<li
								className="grid-notification__item grid-notification__item--is-error"
							>
								<span
									className="grid-notification__icon"
								>
									<WarningIcon />
								</span>
								<p>Es ist ein Fehler aufgetreten.</p>
								<button
									className="grid-notification__button"
								>&times;</button>
							</li>
						</ul>
					</div>

				</header>
				
				<div
					className="grid-revisions"
				>
					{show_revisions && revisions.map((item)=>{
						return (
							<Revision
								key={item.revision}
								{...item}
								onPreview={this.props.onPreview.bind(this, id, item.revision)}
							    onRevert={this.props.onRevertToRevision.bind(this, item.revision )}
							/>
						)
					} )}
				</div>
				
				<Grid
					draft={isDraft}
					container={container}

					edit_container={edit_container}
					edit_box={edit_box}

					container_types={container_types}
					box_types={box_types}

					onContainerEdit={this.props.onContainerEdit.bind(this, this.props.grid.id )}
					onContainerAdd={this.props.onContainerAdd.bind(this, this.props.grid.id)}
					onContainerMove={this.props.onContainerMove.bind(this, this.props.grid.id)}
				    onContainerDelete={this.props.onContainerDelete.bind(this, this.props.grid.id)}
				    onContainerReuse={this.props.onContainerReuse.bind(this, this.props.grid.id)}
					onContainerUpdate={this.props.onContainerEditUpdate.bind(this, this.props.grid.id)}

					onBoxEdit={this.props.onBoxEdit.bind(this, this.props.grid.id)}
				    onBoxAdd={this.props.onBoxAdd.bind(this, this.props.grid.id)}
				    onBoxMove={this.props.onBoxMove.bind(this, this.props.grid.id)}
				    onBoxDelete={this.props.onBoxDelete.bind(this, this.props.grid.id)}
					onBoxReuse={this.props.onBoxReuse.bind(this, this.props.grid.id)}
				    
				/>
				
				<TabView
					className="grid__new-elements"
					titles={["Containers","Boxes"]}
				>
					
					<ContainerTypes
						items={container_types}
					/>
					
					<BoxTypes
						items={box_types}
					    onSearch={this.onBoxTypeSearch.bind(this)}
					/>
					
				</TabView>
				
			</div>
		);
	}
	/**
	 * ---------------------
	 * events
	 * ---------------------
	 */
	onClickRevisions(){
		this.setState({show_revisions: !this.state.show_revisions})
	}

	onBoxTypeSearch(type, item, criteria, query){
		this.props.onBoxTypeSearch(this.props.grid.id, type, item, criteria, query);
	}
	
	/**
	 * ---------------------
	 * functions
	 * ---------------------
	 */
}

/**
 * property defaults
 */
TheGrid.defaultProps = {
	container_types: [],
	box_types: [],
	
	container_styles: [],
	slot_styles: [],
	box_styles: [],

	onPublish: (grid_id)=>{ console.info("onPublish is not implemented") },
	onPreview: (grid_id)=>{ console.info("onPreview is not implemented") },
	onRevertDraft: (grid_id)=>{ console.info("onRevertDraft is not implemented"); },
	onRevertToRevision: () => { console.info("onRevertToRevision is not implemented") },


	onContainerEdit: ()=>{console.info("onContainerEdit is not implemented") },
	onContainerAdd: ()=>{console.info("onContainerAdd is not implemented") },
	onContainerDelete: ()=>{console.info("onContainerDelete is not implemented") },
	onContainerMove: ()=>{console.info("onContainerMove is not implemented") },
	onContainerReuse: ()=>{console.info("onContainerReuse is not implemented") },

	onBoxEdit: ()=>{console.info("onBoxEdit is not implemented") },
	onBoxCreate: ()=>{console.info("onBoxCreate is not implemented") },
	onBoxDelete: ()=>{console.info("onBoxDelete is not implemented") },
	onBoxMove: ()=>{console.info("onBoxMove is not implemented") },
	onBoxReuse: ()=>{console.info("onBoxReuse is not implemented") },
	
	onBoxTypeSearch: (done, type, criteria, query)=>{ console.log("onBoxTypeSearch not implemented", type, criteria, query) },

};

/**
 * define property types
 */
TheGrid.propTypes = {

	// the grid state
	grid: PropTypes.shape({
		id: PropTypes.number.isRequired,
	}).isRequired,

	// other toolbox states
	revisions: PropTypes.array.isRequired,
	container_types: PropTypes.array.isRequired,
	box_types: PropTypes.array.isRequired,
	container_styles: PropTypes.array,
	slot_styles: PropTypes.array,
	box_styles: PropTypes.array,

	// event functions
	onPublish: PropTypes.func,
	onPreview: PropTypes.func,
	onRevertDraft: PropTypes.func,
	onRevertToRevision: PropTypes.func,

	onContainerEdit:PropTypes.func,
	onContainerAdd: PropTypes.func,
	onContainerDelete: PropTypes.func,
	onContainerMove: PropTypes.func,
	onContainerReuse: PropTypes.func,
	onContainerEditUpdate: PropTypes.func,

	onBoxCreate: PropTypes.func,
	onBoxDelete: PropTypes.func,
	onBoxMove: PropTypes.func,
	onBoxEdit: PropTypes.func,

};


export default DragDropContext(HTML5Backend)(TheGrid);