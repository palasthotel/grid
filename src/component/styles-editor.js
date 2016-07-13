import React, {Component} from 'react';

class StyleEditor extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return (
            <div
                className="style-editor"
            >

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
        };

    }
    renderTabs(){
        console.log(this.props.styles);
        return (
            <div
                className="style-type-tabs"
            >
                {Object.keys(this.props.styles).map((key)=> this.renderTab(this.props.styles[key], key) )}
            </div>
        );
    }
    renderTab(values, type){
        let name = values.name;
        return (
            <div
                key={type}
                className="style-type-tab"
                onClick={this.onClickType.bind(this,type)}
                >
                {name}
            </div>
        );
    }
    onClickType(type){
        if(this.state.show == type) return;
        this.setState({show: type});
    }
    renderStyleEditorItems(){
        const elements = this.props.styles[this.state.show].styles;
        return (
            <div>
                {elements.map((style)=> style.slug)}
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