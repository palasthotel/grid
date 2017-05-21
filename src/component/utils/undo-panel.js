import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RestoreIcon from '../icon/restore.js';

export default class UndoPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            seconds:this.props.seconds,
        }
        this.undoTimer = setInterval(()=>{
            this.state.seconds--;
            if(this.state.seconds < 1){
                this.props.onTimeIsUp();
                clearInterval(this.undoTimer);
                return;
            }
            this.setState({seconds:this.state.seconds});
        },1000);
    }
    componentWillUnmount(){
        clearInterval(this.undoTimer);
    }
    render(){
        return (
            <div
                className="undo-panel"
                >
                {this.props.infoText.replace("%time%", this.state.seconds)}
                <button
                    className="button-undo"
                    onClick={this.props.onUndo}
                >
                    <RestoreIcon />
                    {this.props.buttonText}
                </button>
            </div>
        )
    }
}
UndoPanel.propTypes = {
    seconds: React.PropTypes.number,
    infoText: React.PropTypes.string,
    buttonText: React.PropTypes.string,
    onUndo: React.PropTypes.func.isRequired,
    onTimeIsUp: React.PropTypes.func.isRequired
}
UndoPanel.defaultProps = {
    seconds: 6,
    infoText: "You have %time% seconds to undo.",
    buttonText: "Undo"
};
