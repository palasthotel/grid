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
        this.state = {
            show: "container",
        };

    }
    renderTab(type, values){
        let name = "Unknown";
        switch (type){
            case "container":
                name = "Container Styles";
                break;
            case "slot":
                name = "Slot Styles";
                break;
            case "box":
                name = "Box Styles";
                break;
        }
        return (
            <div
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
    render(){
        return (
            <div
                className="styles-editor"
            >
                <div
                    className="style-type-tabs"
                >
                    {this.renderTab("container", this.props.container)}
                    {this.renderTab("slot", this.props.slot)}
                    {this.renderTab("box", this.props.box)}
                </div>
            </div>
        );
    }
}