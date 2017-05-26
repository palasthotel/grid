/**
 * source: https://github.com/google/material-design-icons/blob/eae603ae946b6f813b7edc5611226d8ceae327ff/action/svg/production/ic_delete_24px.svg
 */

import React, { Component} from 'react';
import PropTypes from 'prop-types';

export default class Notification extends Component{
    render(){
        return ( this.props.is_active)? this.renderActive(): this.renderInActive();

    }
    renderInActive(){
        return (
            <svg height="24" viewBox="0 0 24 24" width="24" >
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
        )
    }
    renderActive(){
        return (
            <svg height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z"/>
            </svg>
        )
    }
}

Notification.defaultProps = {
    is_active: false,
}

Notification.propTypes = {
    is_active: PropTypes.bool,
}