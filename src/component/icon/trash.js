/**
 * source: https://github.com/google/material-design-icons/blob/eae603ae946b6f813b7edc5611226d8ceae327ff/action/svg/production/ic_delete_24px.svg
 */

import React, { Component} from 'react';

export default class Trash extends Component{
    render(){
        return (
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="svg-icon svg-icon__delete"
            >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
        )
    }
}