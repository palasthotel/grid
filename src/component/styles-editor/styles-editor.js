import React, {Component} from 'react';
import SingleStyleEdit from './single-edit.js';
import AddIcon from '../icon/add.js';


export default class StylesEditor extends Component{

    /**
     * ---------------------
     * lifecycle
     * ---------------------
     */

    constructor(props){
        super(props);
        let first = Object.keys(props.styles)[0];
        this.state = {
            show: first,
            styles: this.getInitStyles(),
        };
        this.type_names = {
            container: "Container Styles",
            slot: "Slot Styles",
            box: "Box Styles",
        }
    }
    getInitStyles(){
        let styles = this.props.styles;
        for(let key in styles){
            for(let i = 0; i < styles[key].length; i++){
                styles[key][i].saved = true;
                styles[key][i].new = false;
            }
        }
        return styles;
    }

    /**
     * ---------------------
     * rendering
     * ---------------------
     */

    renderTab(values, type){
        return (
            <div
                key={type}
                className={`styles-editor-type-tab ${(type == this.state.show)? "active":""}`}
                onClick={this.onClickType.bind(this,type)}
                >
                {this.type_names[type]}
            </div>
        );
    }
    render(){
        const elements = this.state.styles[this.state.show];
        return (
            <div
                className="styles-editor"
            >
                <div
                    className="styles-editor-type-tabs"
                >
                    {Object.keys(this.state.styles).map((key)=> this.renderTab(this.state.styles[key], key) )}
                </div>
                <div
                    className="styles-list"
                    >
                    {elements.map((style, index)=>{
                        return (
                            <SingleStyleEdit
                                key={style.slug}
                                name={style.name}
                                slug={style.slug}
                                style={style.style}
                                saved={(style.saved)? true: false}
                                new={style.new}
                                onDelete={this.onDeleteStyle.bind(this, this.state.show, index)}
                                onSave={this.saveStyle.bind(this, this.state.show, index)}
                            />
                        )
                    })}
                </div>
                <button
                    className="style-add"
                    onClick={this.onAddStyle.bind(this)}
                >
                    <AddIcon />
                    Add new style
                </button>
            </div>
        );
    }

    /**
     * ---------------------
     * events
     * ---------------------
     */
    onClickType(type){
        if(this.state.show == type) return;
        this.setState({show: type});
    }
    onAddStyle(){
        if(this.newExists()) return;
        this.state.styles[this.state.show].push({
           name:"",
            slug:"",
            style:"",
            saved: false,
            new: true,
        });
        this.setState({styles:this.state.styles});

    }
    onDeleteStyle(type, index){
        // TODO: delete from server else restore and display message
        delete this.state.styles[type][index];
        this.setState({styles:this.state.styles});
    }
    saveStyle(type, index, style, changed_callback){
        // TODO: save to server else display message
        this.state.styles[type][index] = style;
        this.setState({styles:this.state.styles});
        changed_callback(true);
    }

    /**
     * ---------------------
     * helper functions
     * ---------------------
     */
    newExists(){
        let exists = false;
        this.state.styles[this.state.show].map((style)=>{
           if(style.new) exists = true;
        });
        return exists;
    }
}