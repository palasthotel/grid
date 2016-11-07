import React, {Component} from 'react';
import TrashIcon from '../icon/trash.js';
import UndoPanel from '../utils/undo-panel.js';
import slugify from '../../helper/slugify.js';

export default class SingleEdit extends Component{

    /**
     * ---------------------
     * lifecycle
     * ---------------------
     */
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name,
            slug: this.props.slug,
            style: this.props.style,
            deleted: false,
            changed: false,
        };
    }

    componentWillUnmount(){
        if(this.state.deleted){
            this.onDeleteForever();
        }
    }

    /**
     * ---------------------
     * rendering
     * ---------------------
     */
    renderDeleted(){
        return (
            <div className="styles-editor-single-edit style-deleted">
                <UndoPanel
                    infoText="Style will be deleted from Server in %time%s."
                    seconds={5}
                    onTimeIsUp={this.onDeleteForever.bind(this)}
                    onUndo={this.onUndoDelete.bind(this)}
                />
            </div>
        )
    }
    renderSaveButton(){
        if(!this.state.changed)return null;
        return(
            <button
                className="style-save"
                onClick={this.onSave.bind(this)}
            >
                Save
            </button>
        )
    }
    renderEditor(){
        return (
            <div
                className="styles-editor-single-edit"
            >
                <div
                    className="style-name"
                >
                    <input
                        value={this.state.name}
                        onChange={this.onChangeName.bind(this)}
                    />
                    <span className="style-slug">
                        [{this.state.slug}]
                    </span>
                </div>
                <div className="style-classes">
                    <input
                        value={this.state.style}
                        onChange={this.onChangeClasses.bind(this)}
                    />
                </div>
                <button
                    className="style-delete"
                    onClick={this.onDelete.bind(this)}
                >
                    <TrashIcon />
                    Delete
                </button>
                {this.renderSaveButton()}
            </div>
        );
    }
    render(){
        if(this.state.deleted){
            return this.renderDeleted();
        }
        return this.renderEditor();

    }

    /**
     * ---------------------
     * events
     * ---------------------
     */
    onChangeName(e){
        const name = e.target.value;
        const slug = slugify(name);
        this.setState({name:name, slug:slug, changed:true});
    }
    onChangeClasses(e){
        const classes = e.target.value;
        if(!classes.match(/^[a-zA-Z0-9 _-]*$/)) return;
        this.setState({style:classes, changed:true});
    }
    onDelete(){
        if(this.props.new){
            this.onDeleteForever();
            return;
        }
        this.setState({deleted:true});
    }
    onDeleteForever(){
        this.props.onDelete(true);
    }
    onUndoDelete(){
        this.setState({deleted:false});
    }
    onSave(){
        this.props.onSave(this.state, (success)=>{
            if(success) this.setState({changed: false});
        });
    }

}

SingleEdit.propTypes = {
    name: React.PropTypes.string,
    slug: React.PropTypes.string,
    style: React.PropTypes.string,
    saved: React.PropTypes.bool,
    new: React.PropTypes.bool.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
}
SingleEdit.defaultProps = {
    name: "",
    slug: "",
    style: "",
    saved: false,
    delelted: false,
    new: false,
};
