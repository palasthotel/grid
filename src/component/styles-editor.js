import React, {Component} from 'react';

class StyleEditor extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.style.name,
            slug: this.props.style.slug,
            style: this.props.style.style,
            deleted: false,
            saved: this.props.saved,
        };

    }
    onChangeName(e){
        const name = e.target.value;
        const slug = this.slugify(name);
        this.setState({name:name, slug:slug});
    }
    slugify(value){
        return value.toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }
    onChangeClasses(e){
        const classes = e.target.value;
        if(!classes.match(/^[a-zA-Z0-9 _-]*$/)) return;
        this.setState({style:classes});
    }
    onDelete(){
        console.log("Delete");
        this.setState({deleted:true});
    }
    onSave(){
        this.props.save(this.state);
    }
    onUndoDelete(){
        this.setState({deleted:false});
    }
    renderDeleted(){
        return (
            <div className="style-deleted">
                <p>
                    The style "{this.state.name}" was deleted.
                    <span
                        className="style-undo button"
                        onClick={this.onUndoDelete.bind(this)}
                    >
                        Undo
                    </span>
                </p>
            </div>
        )
    }
    render(){
        if(this.state.deleted){
            return this.renderDeleted();
        }
        return (
            <div
                className="style-editor"
            >
                <div
                    className="style-name"
                >
                    <input
                        value={this.state.name}
                        onChange={this.onChangeName.bind(this)}
                    />
                    <span className="style-slug">
                        Slug: {this.state.slug}
                    </span>
                </div>
                <div className="style-classes">
                    <input
                        value={this.state.style}
                        onChange={this.onChangeClasses.bind(this)}
                    />
                </div>
                <div
                    className="style-delete button"
                    onClick={this.onDelete.bind(this)}
                >
                    Delete
                </div>
                <div
                    className="style-save button"
                    onClick={this.onSave.bind(this)}
                >
                    Save
                </div>
            </div>
        );
    }
}


export default class StylesEditor extends Component{
    constructor(props){
        super(props);
        let first = Object.keys(props.styles)[0];
        this.state = {
            show: first,
            styles: props.styles,
        };
        this.type_names = {
            container: "Container Styles",
            slot: "Slot Styles",
            box: "Box Styles",
        }

    }
    renderTabs(){
        return (
            <div
                className="style-type-tabs"
            >
                {Object.keys(this.state.styles).map((key)=> this.renderTab(this.state.styles[key], key) )}
            </div>
        );
    }
    renderTab(values, type){
        return (
            <div
                key={type}
                className={`style-type-tab ${(type == this.state.show)? "active":""}`}
                onClick={this.onClickType.bind(this,type)}
                >
                {this.type_names[type]}
            </div>
        );
    }
    onClickType(type){
        if(this.state.show == type) return;
        this.setState({show: type});
    }
    saveStyle(index,style){
        this.state.styles[this.state.show][index] = style;
        this.setState({styles:this.state.styles});
    }
    renderStyleEditorItems(){
        const elements = this.state.styles[this.state.show];
        return (
            <div>
                {elements.map((style, index)=>{
                    return (
                        <StyleEditor
                            key={style.slug}
                            style={style}
                            saved={true}
                            save={this.saveStyle.bind(this, index)}
                        />
                    )
                })}
            </div>
        )
    }
    render(){
        return (
            <div
                className="styles-editor"
            >
                {this.renderTabs()}
                <div
                    className="styles-list"
                    >
                    {this.renderStyleEditorItems()}
                </div>
            </div>
        );
    }
}