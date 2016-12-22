/**
 * source:
 * https://raw.githubusercontent.com/google/material-design-icons/eae603ae946b6f813b7edc5611226d8ceae327ff/action/svg/production/ic_restore_24px.svg
 */

import React, { Component} from 'react';

export default class Restore extends Component{
    render(){
        return (
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="svg-icon svg-icon__restore"
            >
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
        )
    }
}